import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GlobalProvider } from "./context/globalContext.tsx";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { loadFonts } from "./utils/fontLoader";

// Load fonts dynamically from CloudFront
loadFonts();

createRoot(document.getElementById("root")!).render(
  <GlobalProvider>
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      action={(snackbarId) => (
        <button
          onClick={() => closeSnackbar(snackbarId)}
          style={{
            color: 'white',
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ✕
        </button>
      )}
    >
      <App />
    </SnackbarProvider>
  </GlobalProvider>
);
