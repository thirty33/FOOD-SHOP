import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GlobalProvider } from "./context/globalContext.tsx";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")!).render(
  <GlobalProvider>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </GlobalProvider>
);
