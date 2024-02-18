import { useState } from "react";
import Button from "../../../../components/Button";

function VideoController() {
  const [textToAppear, setTextToAppear] = useState("Start");

  const toggleStartButton = () =>
    setTextToAppear((prev) => (prev === "Start" ? "Stop" : "Start"));

  return (
    <div>
      <Button
        varient={textToAppear === "Start" ? "Primary" : "Secondary"}
        onClick={toggleStartButton}
      >
        {textToAppear}
      </Button>
    </div>
  );
}

export default VideoController;
