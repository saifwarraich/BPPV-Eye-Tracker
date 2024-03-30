import useDarkMode from "use-dark-mode";
import VideoRecoderPage from "./VideoRecorderPage";
import Topbar from "../components/Topbar";
import { useEffect } from "react";
import { useVideos } from "../Context/VideoContext";
import { useVideoMode } from "../Context/VideoModeContext";
// import { listSerialPorts } from "../../electron/renderer/serialPort";

function App() {
  const darkMode = useDarkMode(false);

  const { getVideosDetail } = useVideos();
  const { isLive } = useVideoMode();

  useEffect(() => {
    getVideosDetail();
  }, []);

  useEffect(() => {
    console.log(isLive);
  }, [isLive]);

  return (
    <>
      <main
        className={`${
          darkMode.value ? "dark" : ""
        } text-foreground bg-background w-full h-fit`}
      >
        <Topbar />
        <VideoRecoderPage />
      </main>
      <div
        style={{
          height: "100px",
          background: darkMode.value ? "black" : "white",
        }}
      ></div>
    </>
  );
}

export default App;
