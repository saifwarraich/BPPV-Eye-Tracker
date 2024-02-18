import useDarkMode from "use-dark-mode";
import VideoRecoderPage from "./VideoRecorderPage";
import { Button, Card, CardBody } from "@nextui-org/react";

function App() {
  const darkMode = useDarkMode(false);

  return (
    <main
      className={`${
        darkMode.value ? "dark" : ""
      } text-foreground bg-background`}
    >
      <div className="h-screen w-fit">
        abc
        {/* <VideoRecoderPage /> */}
        <Card className="max-w-[200px]">
          <CardBody className="px-2 py-4">
            ABC
            {/* <video className=""></video> */}
          </CardBody>
        </Card>
        <Card className="max-w-[200px] !important">
          <CardBody className="px-2 py-4">
            ABC
            {/* <video className=""></video> */}
          </CardBody>
        </Card>
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
