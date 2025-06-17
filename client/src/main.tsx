import { createRoot } from "react-dom/client";
import "@/styles/css/style.css";
import App from "./App";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "@/store/store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
    <ToastContainer />
  </Provider>
);
