export interface ContactFormValues {
  readonly name: string;
  readonly email: string;
  readonly projectType: string;
  readonly brief: string;
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactValidationMessages {
  readonly required: string;
  readonly invalidEmail: string;
  readonly tooLong: (max: number) => string;
}

/**
 * 各項目の最大長。
 *
 * このエンドポイントは Web3Forms のアクセスキーを保持したまま外部へ中継する唯一の
 * サーバー処理であり、上限が無いと数MBの本文を無制限に中継する踏み台になり得る
 * （受信箱の汚染・API クォータの枯渇）。`email` の 254 は RFC 5321 の上限に合わせている。
 */
export const CONTACT_MAX_LENGTH = {
  name: 100,
  email: 254,
  projectType: 100,
  brief: 4000,
} as const satisfies Record<keyof ContactFormValues, number>;

/**
 * 必須・メール形式・最大長のバリデーション。クライアント(入力時のフィードバック)と
 * サーバー(Route Handler)の双方から同じ関数を呼ぶことで、検証ロジックの二重実装を避ける
 * (設計書 §14 T24 完了条件「サーバー／クライアント双方で効く」)。
 */
export function validateContactForm(values: ContactFormValues, messages: ContactValidationMessages): ContactFormErrors {
  const errors: ContactFormErrors = {};

  const name = values.name.trim();
  if (!name) errors.name = messages.required;
  else if (name.length > CONTACT_MAX_LENGTH.name) errors.name = messages.tooLong(CONTACT_MAX_LENGTH.name);

  const email = values.email.trim();
  if (!email) {
    errors.email = messages.required;
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = messages.invalidEmail;
  } else if (email.length > CONTACT_MAX_LENGTH.email) {
    errors.email = messages.tooLong(CONTACT_MAX_LENGTH.email);
  }

  const projectType = values.projectType.trim();
  if (projectType.length > CONTACT_MAX_LENGTH.projectType) {
    errors.projectType = messages.tooLong(CONTACT_MAX_LENGTH.projectType);
  }

  const brief = values.brief.trim();
  if (!brief) errors.brief = messages.required;
  else if (brief.length > CONTACT_MAX_LENGTH.brief) errors.brief = messages.tooLong(CONTACT_MAX_LENGTH.brief);

  return errors;
}
