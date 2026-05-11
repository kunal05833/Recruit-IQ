// src/main.jsx
import React    from "react";
import ReactDOM from "react-dom/client";
import { Provider }    from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store }       from "./redux/store";
import App             from "./App";
import "./styles/global.css";
import "./utils/chartConfig";

if (import.meta.env.PROD) {
  console.warn  = () => {};
  console.debug = () => {};
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* ✅ FIX: React Router v7 warnings band */}
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);