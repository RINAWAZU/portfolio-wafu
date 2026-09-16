'use client';

import dynamic from 'next/dynamic';

/**
 * `ssr: false` の動的 import はクライアントコンポーネントからしか行えないため、
 * この 1 枚だけを挟む。BonsaiVisual をサーバーコンポーネントのまま保つための境界。
 *
 * three.js は初期バンドルに載せない。序が見えている間だけ読み込まれればよい。
 */
const BonsaiModel = dynamic(() => import('./BonsaiModel'), { ssr: false });

export interface BonsaiModelLoaderProps {
  readonly src: string;
}

export function BonsaiModelLoader({ src }: BonsaiModelLoaderProps) {
  return <BonsaiModel src={src} />;
}
