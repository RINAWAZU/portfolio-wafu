import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ホームディレクトリ直下に無関係な package-lock.json があり、Turbopack が
  // ワークスペースルートをそちらへ誤検出するのを防ぐため明示する。
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // 既定の上限は 3840。木目背景は縦長画面で「画面高 x 1.887」まで拡大されるため、
    // iPhone 縦(DPR3) で 4778px を要求する。既定のままだと 3840 で頭打ちになり
    // 1.24 倍に引き伸ばされる。元素材(4680)を使い切れるよう上限を伸ばす。
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 5120],
    // Next.js 16 から品質の許可リストが必須。既定の 75 に加え、木目背景と盆栽だけ
    // 90 を使う。元素材が既に WebP なので、75 で再エンコードすると二重に劣化する。
    qualities: [75, 90],
  },
};

export default nextConfig;
