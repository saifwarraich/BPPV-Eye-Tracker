import useDarkMode from "use-dark-mode";
import VideoRecoderPage from "./VideoRecorderPage";
import { Button, Card, CardBody } from "@nextui-org/react";
import Preview from "../components/Preview";
import Topbar from "../components/Topbar";

function App() {
  const darkMode = useDarkMode(false);

  return (
    <main
      className={`${
        darkMode.value ? "dark" : ""
      } text-foreground bg-background w-full h-screen  `}
    >
      <Topbar />
      <div className="">
        abc
        {/* <VideoRecoderPage /> */}
        <div className="flex items-center justify-center  ">
          <Preview
            link="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            text={"Left Eye"}
          />
          <Preview
            link={
              "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            }
            text={"Right Eye"}
          />
        </div>
        <div className="flex items-center justify-center m-10">
          <Button color="primary"> Start</Button>
        </div>
        <ThemeSwitcher />
      </div>
    </main>
  );
}

const ThemeSwitcher = () => {
  const darkMode = useDarkMode(false);

  return (
    <div>
      <Button color="secondary" onClick={darkMode.disable} variant="shadow">
        Light Mode
      </Button>
      <Button color="secondary" onClick={darkMode.enable}>
        Dark Mode
      </Button>
    </div>
  );
};

export default App;
