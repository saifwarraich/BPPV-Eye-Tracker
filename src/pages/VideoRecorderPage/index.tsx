import { Button } from "@nextui-org/react";
import VideoPlayer from "./Components/VideoPlayer";
import { useEffect, useState } from "react";
import rightVide from "../../../python/output_right.mp4";
import DetailForm from "./Components/DetailForm";
import Graphs from "./Components/Graphs";
import { socket } from "../../socket";

function VideoRecoderPage() {
  const [imageDataLeft, setImageDataLeft] = useState("");
  const [imageDataRight, setImageDataRight] = useState("");
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    console.log(rightVide);
    return () => {
      setImageDataLeft("");
      setImageDataRight("");
      fetch("http://127.0.0.1:5000/stop-video");
    };
  }, []);

  const manageStream = () => {
    if (!imageDataLeft) {
      setImageDataLeft(`http://127.0.0.1:5000/start-video-left`);
      setImageDataRight(`http://127.0.0.1:5000/start-video-right`);
      socket.connect();
      socket.on("updateSensorData", (data) => {
        console.log("Received message:", data);
        setGraphData(data.value);
      });
    } else {
      setImageDataLeft("");
      setImageDataRight("");
      fetch("http://127.0.0.1:5000/stop-video");
      socket.off("message");
      // Disconnect the socket when the component unmounts
      socket.disconnect();
    }
  };

  return (
    <>
      <div className="min-h-fit !important">
        <DetailForm />
        <div className="flex items-center justify-center">
          <VideoPlayer
            eye="right"
            label={"Right Eye"}
            imageData={imageDataRight}
          />
          <VideoPlayer
            eye={"left"}
            label={"Left Eye"}
            imageData={imageDataLeft}
          />
        </div>
        <div className="flex items-center justify-center">
          <Button
            color={imageDataLeft ? "danger" : "primary"}
            variant="shadow"
            onClick={manageStream}
          >
            {imageDataLeft ? "Stop" : "Start"}
          </Button>
        </div>
        <Graphs data={graphData} />
      </div>
    </>
  );
}

export default VideoRecoderPage;
