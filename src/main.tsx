import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { LabelTimestampsProvider } from "./Context/useLabelTimeStamp";
import { VideosContextProvider } from "./Context/VideoContext";
import { VideoModeContextProvider } from "./Context/VideoModeContext";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_LEFT,
  timeout: 5000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <LabelTimestampsProvider>
        <VideosContextProvider>
          <VideoModeContextProvider>
            <AlertProvider template={AlertTemplate} {...options}>
              <App />
            </AlertProvider>
          </VideoModeContextProvider>
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
