console.log("[main.tsx] Entry point reached - about to import i18n");

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/i18n"; // Import i18n configuration

console.log("[main.tsx] All imports done, about to render");

try {
  createRoot(document.getElementById("root")!).render(<App />);
  console.log("[main.tsx] Render called successfully");
} catch (e) {
  console.error("[main.tsx] Error during render:", e);
}
