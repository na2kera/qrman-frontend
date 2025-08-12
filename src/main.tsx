import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";
import { SwrProvider } from "./shared/api/swr.tsx";
import { authStore } from "./app/store";

// アプリ描画前に認証状態を復元して API クライアントへ反映
authStore.load();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SwrProvider>
      <App />
    </SwrProvider>
  </StrictMode>
);
