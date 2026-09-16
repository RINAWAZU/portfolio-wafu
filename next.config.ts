import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ホームディレクトリ直下に無関係な package-lock.json があり、Turbopack が
  // ワークスペースルートをそちらへ誤検出するのを防ぐため明示する。
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Next.js 16 から品質の許可リストが必須。既定の 75 に加え、木目背景と盆栽だけ
    // 90 を使う。元素材が既に WebP なので、75 で再エンコードすると二重に劣化する。
    qualities: [75, 90],
  },
};

export default nextConfig;
