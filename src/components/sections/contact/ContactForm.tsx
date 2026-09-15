'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useLang } from '@/hooks/useLang';
import { getDictionary } from '@/lib/i18n';
import {
  CONTACT_MAX_LENGTH,
  validateContactForm,
  type ContactFormErrors,
  type ContactFormValues,
} from '@/lib/contactValidation';

const INITIAL_VALUES: ContactFormValues = { name: '', email: '', projectType: '', brief: '' };

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'notConfigured';

/**
 * 問い合わせフォーム(設計書 §14 T24)。`app/api/contact/route.ts` へ中継するだけで、
 * Web3Forms のアクセスキーはこのコンポーネントからは一切参照しない。
 */
export function ContactForm() {
  const { lang } = useLang();
  const f = getDictionary(lang).contact.form;

  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  const isSubmitting = status === 'submitting';

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name as keyof ContactFormErrors] ? { ...prev, [name]: undefined } : prev));
    if (status === 'success' || status === 'error' || status === 'notConfigured') setStatus('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // honeypot は state で持たず、送信時に DOM の実値を読む。
    // 固定値を送ると「対策が入っているように見えて実際は素通り」という最悪の状態になる。
    const botcheck = String(new FormData(event.currentTarget).get('botcheck') ?? '');

    const nextErrors = validateContactForm(values, {
      required: f.required,
      invalidEmail: f.invalidEmail,
      tooLong: (max) => f.tooLong.replace('{max}', String(max)),
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus('submitting');
    setErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, botcheck }),
      });
      const data: unknown = await response.json();
      const succeeded =
        typeof data === 'object' && data !== null && 'success' in data && (data as { success: unknown }).success === true;

      if (!response.ok || !succeeded) {
        const code = typeof data === 'object' && data !== null && 'code' in data ? (data as { code: unknown }).code : null;
        setStatus(code === 'NOT_CONFIGURED' ? 'notConfigured' : 'error');
        return;
      }

      setValues(INITIAL_VALUES);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/*
        honeypot: 視覚的に隠し、支援技術からも除外する(bot対策・§14 T24「honeypot 維持」)。
        `type="text"` にしているのは、フォームを自動補完する bot に埋めさせるため
        (checkbox だと素通りされやすい)。値は `handleSubmit` が FormData から読む。
      */}
      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
      />

      <Field
        id="contact-name"
        name="name"
        maxLength={CONTACT_MAX_LENGTH.name}
        label={f.nameLabel}
        placeholder={f.namePlaceholder}
        value={values.name}
        onChange={handleChange}
        error={errors.name}
        disabled={isSubmitting}
        autoComplete="name"
      />
      <Field
        id="contact-email"
        name="email"
        maxLength={CONTACT_MAX_LENGTH.email}
        type="email"
        label={f.emailLabel}
        placeholder={f.emailPlaceholder}
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        disabled={isSubmitting}
        autoComplete="email"
      />
      <Field
        id="contact-project-type"
        name="projectType"
        maxLength={CONTACT_MAX_LENGTH.projectType}
        label={f.projectTypeLabel}
        placeholder={f.projectTypePlaceholder}
        value={values.projectType}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      <div className="flex flex-col gap-1.5 border-b border-hairline pb-1.5">
        <label htmlFor="contact-brief" className="font-mono text-[11px] tracking-[.2em] text-gofun/50">
          {f.briefLabel}
        </label>
        <textarea
          id="contact-brief"
          name="brief"
          rows={4}
          value={values.brief}
          onChange={handleChange}
          placeholder={f.briefPlaceholder}
          disabled={isSubmitting}
          maxLength={CONTACT_MAX_LENGTH.brief}
          aria-invalid={Boolean(errors.brief)}
          aria-describedby={errors.brief ? 'contact-brief-error' : undefined}
          className="resize-none bg-transparent font-body text-body text-gofun placeholder:text-gofun/35"
        />
        {errors.brief && (
          <span id="contact-brief-error" role="alert" className="font-mono text-[11px] text-shinshu">
            {errors.brief}
          </span>
        )}
      </div>

      {/*
        ライブリージョンは「空のまま DOM に常駐させ、後から中身を入れる」ことで確実に読み上げられる。
        要素ごと条件付きでマウントすると、スクリーンリーダーによっては通知が落ちる。
      */}
      <p
        role="status"
        className={`font-mono text-xs ${status === 'success' ? 'text-matsuba-bright' : 'text-shinshu'} ${
          status === 'success' || status === 'error' || status === 'notConfigured' ? '' : 'sr-only'
        }`}
      >
        {status === 'success' ? f.success : status === 'error' ? f.error : status === 'notConfigured' ? f.notConfigured : ''}
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start border border-kincha px-5 py-2.5 font-latin text-xs tracking-latin text-kincha uppercase transition-colors duration-[0.4s] ease-out hover:bg-kincha hover:text-sumi disabled:opacity-50"
      >
        {isSubmitting ? f.sending : `${f.submit} →`}
      </button>
    </form>
  );
}

interface FieldProps {
  readonly id: string;
  readonly name: keyof ContactFormValues;
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly error?: string;
  readonly disabled: boolean;
  readonly type?: string;
  readonly autoComplete?: string;
  readonly maxLength: number;
}

/**
 * 入力欄1件。`focus:outline-none` は付けないこと ─ 付けると globals.css の
 * `:focus-visible`（金茶1px / offset 2px）ごと打ち消され、キーボード操作で
 * どの欄にいるのか分からなくなる（Playwright の実測で 4欄が無リング状態だったため除去）。
 */
function Field({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled,
  type = 'text',
  autoComplete,
  maxLength,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-hairline pb-1.5">
      <label htmlFor={id} className="font-mono text-[11px] tracking-[.2em] text-gofun/50">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="bg-transparent font-body text-body text-gofun placeholder:text-gofun/35"
      />
      {error && (
        <span id={`${id}-error`} role="alert" className="font-mono text-[11px] text-shinshu">
          {error}
        </span>
      )}
    </div>
  );
}
