import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ホームディレクトリ直下に無関係な package-lock.json があり、Turbopack が
  // ワークスペースルートをそちらへ誤検出するのを防ぐため明示する。
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
