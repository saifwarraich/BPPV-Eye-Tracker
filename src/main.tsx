import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { LabelTimestampsProvider } from "./Context/useLabelTimeStamp";
import { VideosContextProvider } from "./Context/VideoContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <LabelTimestampsProvider>
        <VideosContextProvider>
          <App />
        </VideosContextProvider>
      </LabelTimestampsProvider>
    </NextUIProvider>
  </React.StrictMode>
);

// Remove Preload scripts loading
postMessage({ payload: "removeLoading" }, "*");

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
