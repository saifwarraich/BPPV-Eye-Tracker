import useDarkMode from "use-dark-mode";
import VideoRecoderPage from "./VideoRecorderPage";
import Topbar from "../components/Topbar";
// import { listSerialPorts } from "../../electron/renderer/serialPort";

function App() {
  const darkMode = useDarkMode(false);

  // useEffect(() => {
  //   // listSerialPorts();
  //   // Listen for 'message' event
  //   // socket.connect();
  //   // console.log("Connected");
  //   // socket.on("updateSensorData", (data) => {
  //   //   console.log("Here");
  //   //   console.log("Received message:", data);
  //     // Update your React component state with the received data
  //   });
  //   // Clean up function
  //   // return () => {
  //   //   // socket.off("message");
  //   //   // Disconnect the socket when the component unmounts
  //   //   // socket.disconnect();
  //   // };
  // }, []);

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
