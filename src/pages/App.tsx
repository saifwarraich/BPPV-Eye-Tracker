import useDarkMode from "use-dark-mode";
import VideoRecoderPage from "./VideoRecorderPage";
import Topbar from "../components/Topbar";
import { useEffect } from "react";
import { listSerialPorts } from "../../electron/renderer/serialPort";

function App() {
  const darkMode = useDarkMode(false);

  useEffect(() => {
    listSerialPorts();
  }, []);

  return (
    <main
      className={`${
        darkMode.value ? "dark" : ""
      } text-foreground bg-background w-full h-dvh`}
    >
      <Topbar />
      <VideoRecoderPage />
    </main>
  );
}

export default App;
