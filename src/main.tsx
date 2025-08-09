import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";
import { SwrProvider } from "./shared/api/swr.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SwrProvider>
      <App />
    </SwrProvider>
  </StrictMode>
);
