import { NextResponse } from 'next/server';
import { validateContactForm, type ContactFormValues } from '@/lib/contactValidation';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Web3Forms 中継(設計書 §7-3, §14 T24)。
 *
 * アクセスキーは `WEB3FORMS_ACCESS_KEY`(`NEXT_PUBLIC_` を付けない)として
 * サーバー側の環境変数からのみ読む。クライアントには一切渡さない。
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * 受け付ける JSON 全体の上限。各項目の上限（`CONTACT_MAX_LENGTH`）の合計に
 * JSON の構造分の余裕を足した値。巨大な本文をパースする前に門前払いする。
 */
const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ success: false, code: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ success: false, code: 'INVALID_BODY' }, { status: 400 });
  }

  // content-length は詐称できるため、実際に読み取ったバイト数でも確認する。
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ success: false, code: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ success: false, code: 'INVALID_BODY' }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ success: false, code: 'INVALID_BODY' }, { status: 400 });
  }

  // honeypot: bot は隠しフィールドまで含めて全入力する傾向があるため、
  // 値が入っていたら「成功したふり」をして静かに破棄する(botに気付かせない)。
  if (readString(body.botcheck).trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  const values: ContactFormValues = {
    name: readString(body.name),
    email: readString(body.email),
    projectType: readString(body.projectType),
    brief: readString(body.brief),
  };

  // ここでのメッセージ文言は使われない（クライアントが自前の文言で再表示する）。
  // サーバー側の役割は「不正な入力を中継しない」ことなので、キー名だけで足りる。
  const errors = validateContactForm(values, {
    required: 'required',
    invalidEmail: 'invalidEmail',
    tooLong: () => 'tooLong',
  });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, code: 'VALIDATION_ERROR', errors }, { status: 400 });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();
  if (!accessKey) {
    return NextResponse.json({ success: false, code: 'NOT_CONFIGURED' }, { status: 503 });
  }

  const projectType = values.projectType.trim() || '(not specified)';

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        name: values.name,
        email: values.email,
        subject: `[RIN Portfolio] ${projectType}`,
        message: values.brief,
        project_type: projectType,
        from_name: values.name,
      }),
    });

    const data: unknown = await response.json();
    const succeeded = isRecord(data) && data.success === true;

    if (!response.ok || !succeeded) {
      return NextResponse.json({ success: false, code: 'SUBMIT_FAILED' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, code: 'SUBMIT_FAILED' }, { status: 502 });
  }
}
