import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // コンテナ外からアクセス
    port: 3000, // 要件どおり 3000 に固定
    strictPort: true,
    hmr: {
      host: "localhost", // 開発PCからアクセスするホスト名
      clientPort: 3000, // 公開ポート
      protocol: "ws",
    },
    // Docker + mac環境でファイル監視が不安定な場合
    watch: { usePolling: true, interval: 100 },
  },
});
