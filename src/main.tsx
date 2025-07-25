import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GlobalProvider } from "./context/globalContext.tsx";
import { SnackbarProvider } from "notistack";
import { loadFonts } from "./utils/fontLoader";

// Load fonts dynamically from CloudFront
loadFonts();

createRoot(document.getElementById("root")!).render(
  <GlobalProvider>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </GlobalProvider>
);
