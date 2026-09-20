import type { Lang, LocalizedText } from '@/types/i18n';
import type { Season } from '@/types/season';

/**
 * UI 文言の辞書。
 *
 * 序・我は和風ハイファイ（`和風リメイク ハイファイ（序・我）.dc.html`）の COPY を正とする
 * （設計書 §0 優先順位表・§1 確定事項）。旧 Digital Luxury 版のコピーはそのまま持ち込まない。
 *
 * 作・技・歴・価・結はハイファイ未作成のため、`site_old` の COPY を暫定の既定値として
 * 移植した（設計書 §0 優先順位表 7位）。技・歴・価のハイファイが用意でき次第、
 * この暫定コピーは和風のトーンに合わせて差し替える（§12-2 #1 の未決事項）。
 */
export interface Dictionary {
  readonly prologue: {
    readonly tagline: string;
    readonly sub: string;
  };
  readonly about: {
    /**
     * 我の3行ステートメント。日本語は**句読点を入れない**（社長指摘・2026-09-16）。
     * 縦書きで読点を打つと1文字分の空きがそのまま行の途中に出て流れが切れ、
     * 短い3行に句点まで付くと文章の断片のように見える。標語として詰めて置く。
     */
    readonly statement: readonly [string, string, string];
    readonly bio: readonly [string, string];
  };
  readonly works: {
    readonly label: string;
    readonly title: readonly [string, string];
    readonly sub: string;
    /**
     * 欧文ラベルの下に添える2行の補足文(ワイヤーフレーム #3a 参照)。
     * 受託実績と誤解されない言い回しにすること(社長指摘・2026-09-16)。
     */
    readonly blurb: readonly [string, string];
    /**
     * 左カラムの案内文(社長指示・2026-09-20)。GitHub への導線と、
     * 「短冊そのものが押せる」ことの説明を兼ねる。
     * 全作品にリンクがあるわけではないので、断定しない言い回しにすること。
     */
    readonly more: string;
  };
  readonly skills: {
    readonly label: string;
    readonly title: readonly [string, string];
    readonly sub: string;
  };
  readonly career: {
    readonly label: string;
    readonly title: readonly [string, string];
  };
  readonly pricing: {
    /** [強調前, 強調語, 強調後] の3分割(強調語だけ真朱で塗るため) */
    readonly lead: readonly [string, string, string];
    readonly groupProduction: string;
    readonly groupMaintenance: string;
    readonly groupOptions: string;
  };
  readonly contact: {
    readonly label: string;
    readonly heading: readonly [string, string];
    readonly sub: string;
    readonly form: {
      readonly nameLabel: string;
      readonly namePlaceholder: string;
      readonly emailLabel: string;
      readonly emailPlaceholder: string;
      readonly projectTypeLabel: string;
      readonly projectTypePlaceholder: string;
      readonly briefLabel: string;
      readonly briefPlaceholder: string;
      readonly submit: string;
      readonly sending: string;
      readonly success: string;
      readonly error: string;
      readonly notConfigured: string;
      readonly required: string;
      readonly invalidEmail: string;
      /** `{max}` を最大文字数に置換して使う */
      readonly tooLong: string;
    };
  };
  readonly avatarTag: string;
}

export const DICTIONARY: Readonly<Record<Lang, Dictionary>> = {
  ja: {
    prologue: {
      tagline: '麟 — つくり続ける。',
      sub: 'Web / iOS / AI 統合 ・ 東京を拠点に活動するフリーランス',
    },
    about: {
      statement: ['作業ではなくクラフト', '界面を建築として設計する', '質感もコードと同じ重さで'],
      bio: [
        '芝浦工業大学 システム理工学部 在学中。',
        '2027年4月、金融系IT企業に新卒入社予定。',
      ],
    },
    works: {
      label: '作品',
      title: ['動き続ける', 'ポートフォリオ。'],
      sub: '完成3件、制作中1件、構想中2件。いずれも依頼を受けた案件ではなく、扱える領域を示すために自ら設計した作品です — ブランドサイト、業務ツール、AIサーフェス、コーポレートWeb。',
      blurb: ['技術の幅を示すために', '自ら企画して作った作品'],
      more: '詳しくは GitHub から。公開している作品は短冊を選ぶと開きます。',
    },
    skills: {
      label: 'Tech Stack',
      title: ['意図して選んだ', 'ツール群。'],
      sub: '速度・型安全性・デザインの再現性を基準に絞り込んだスタック。案件が要求する場合のみ新しいツールを追加します。',
    },
    career: {
      label: 'Career / Timeline',
      title: ['リアルタイムで', '描いている経路。'],
    },
    pricing: {
      lead: ['制作会社に頼むより、', 'エンジニア直契約', 'の方が安い理由があります。'],
      groupProduction: '制作料金プラン',
      groupMaintenance: '月額保守プラン',
      groupOptions: 'オプション単価',
    },
    contact: {
      label: 'Contact',
      heading: ['ご相談は', 'お気軽に。'],
      sub: '毎月少数のフリーランス案件をお受けしています。ブランドサイト、プロダクトUI、iOSアプリ、AI統合ツールを特に歓迎します。',
      form: {
        nameLabel: 'お名前',
        namePlaceholder: '山田 太郎',
        emailLabel: 'メールアドレス',
        emailPlaceholder: 'you@company.com',
        projectTypeLabel: '案件タイプ',
        projectTypePlaceholder: 'ブランドサイト / iOSアプリ / AIツール …',
        briefLabel: '概要',
        briefPlaceholder: '案件の内容・スコープ・スケジュールをお聞かせください。',
        submit: '送信する',
        sending: '送信中…',
        success: 'お問い合わせを送信しました。折り返しご連絡いたします。',
        error: '送信に失敗しました。もう一度お試しいただくか、左のメールアドレスまでご連絡ください。',
        notConfigured: 'フォームの設定が未完了です。左記のメールアドレスをご利用ください。',
        required: '必須項目です',
        invalidEmail: '有効なメールアドレスを入力してください',
        tooLong: '{max}文字以内で入力してください',
      },
    },
    avatarTag: 'RIN / 2026',
  },
  en: {
    prologue: {
      tagline: 'RIN — Still making.',
      sub: 'Web / iOS / AI integration · Freelance, based in Tokyo',
    },
    about: {
      statement: ['Craft, not a checklist.', 'Interfaces designed as architecture.', 'Texture weighed like code.'],
      bio: [
        'Systems Engineering at Shibaura Institute of Technology.',
        'Joining a financial IT company in April 2027.',
      ],
    },
    works: {
      label: 'Selected Work',
      title: ['A portfolio in', 'motion.'],
      sub: 'Three complete, one in build, two in design. None of these are client commissions — each is a self-directed study in a specific problem: brand site, business tool, AI surface, corporate web.',
      blurb: ['Self-directed work, built to', 'show range and craft'],
      more: 'More on GitHub. Published works open from their card.',
    },
    skills: {
      label: 'Tech Stack',
      title: ['Tools, picked with', 'intent.'],
      sub: 'A focused stack chosen for velocity, type safety, and design fidelity. New tools are added only when a brief demands them.',
    },
    career: {
      label: 'Career / Timeline',
      title: ['A path drawn in', 'real time.'],
    },
    pricing: {
      lead: ['Going through an agency costs more than it should — ', 'a direct contract with the engineer', ' is why.'],
      groupProduction: 'Production Plans',
      groupMaintenance: 'Monthly Maintenance',
      groupOptions: 'Add-on Options',
    },
    contact: {
      label: 'Contact',
      heading: ['Got a brief?', "Let's talk."],
      sub: 'I take on a small number of freelance projects each month. Brand sites, product UIs, iOS apps, and AI-integrated tools are most welcome.',
      form: {
        nameLabel: 'Name',
        namePlaceholder: 'Your name',
        emailLabel: 'Email',
        emailPlaceholder: 'you@company.com',
        projectTypeLabel: 'Project Type',
        projectTypePlaceholder: 'Brand site / iOS app / AI tool …',
        briefLabel: 'Brief',
        briefPlaceholder: 'Tell me about the project, scope, and timeline.',
        submit: 'Send Brief',
        sending: 'Sending…',
        success: "Thank you — your brief has been sent. I'll get back to you soon.",
        error: 'Something went wrong. Please try again or email me directly.',
        notConfigured: 'The form is not configured yet. Please use the email address on the left.',
        required: 'Required',
        invalidEmail: 'Enter a valid email address',
        tooLong: 'Please keep this under {max} characters',
      },
    },
    avatarTag: 'RIN / 2026',
  },
};

/** 季節ラベル（BONSAI · 新緑 等）。設計書 §4-4 の対応表。 */
export const SEASON_LABEL: Readonly<Record<Season, LocalizedText>> = {
  spring: { ja: '新緑', en: 'Fresh green' },
  summer: { ja: '深緑', en: 'Deep green' },
  autumn: { ja: '紅葉', en: 'Autumn' },
  winter: { ja: '雪', en: 'Snow' },
};
