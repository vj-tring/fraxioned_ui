import React from "react";
import { createRoot } from "react-dom/client";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SnackbarProvider } from "./components/snackbar-provider"; // Adjust the path as necessary
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
const disableConsole = (): void => {
  if (process.env.NODE_ENV === "development") {
    console.log = (): void => {};
    console.warn = (): void => {};
    // console.error = (): void => {};
    console.info = (): void => {};
    console.debug = (): void => {};
  }
};

// disableConsole();
if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      </LocalizationProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
