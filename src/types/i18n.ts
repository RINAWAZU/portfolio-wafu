/** 対応言語。将来増える場合もこの union を拡張するだけで済むようにする。 */
export type Lang = 'ja' | 'en';

/** 言語ごとの文言を1つの値として持つための型。データ側はこれを敷き詰めるだけでよい。 */
export interface LocalizedText {
  readonly ja: string;
  readonly en: string;
}
