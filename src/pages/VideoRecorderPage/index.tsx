import {
  Badge,
  Button,
  ButtonGroup,
  CardBody,
  Select,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";
import VideoPlayer from "./Components/VideoPlayer";
import { useEffect, useState } from "react";
import DetailForm from "./Components/DetailForm";
import Graphs from "./Components/Graphs";
import { socket } from "../../socket";
import { BPPV_TYPES } from "../../utils/constants";
import { ChevronDownIcon } from "../../assets/ChevronDownIcon";
import AnnotationList from "./Components/AnnotationList";
import { InformationIcon } from "../../assets/informationIcon";
import { useLabelTimestamps } from "../../Context/useLabelTimeStamp";
import { AnnotationListDiv, FixedButton, FixedDiv, MenueCard } from "./Styles";
import { saveVideoDetail } from "../../services/videoService";

interface HeadMovementDataType {
  timestamp: number;
  sensorData: number[];
  angleValues: number[];
}

function VideoRecoderPage() {
  const [imageDataLeft, setImageDataLeft] = useState("");
  const [imageDataRight, setImageDataRight] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const { labelTimestamps, setLabelTimestamps } = useLabelTimestamps();
  const [starAnnotatingTime, setStartAnnotatingTime] = useState<
    number | null
  >();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnnotationListOpen, setIsAnnotationListOpen] = useState(false);
  const [bppvTypeSelected, setBppvTypeSelected] = useState<string>("");
  const [headMovementData, setHeadMovementData] = useState<
    HeadMovementDataType[]
  >([]);
  const [patientName, setPatientName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const toggleCard = () => {
    setIsAnnotationListOpen(false);
    setIsOpen(!isOpen);
  };

  const toggleOpenAnnotationList = () => {
    setIsOpen(false);
    setIsAnnotationListOpen(!isAnnotationListOpen);
  };

  const toggleAnnotating = () => {
    if (!starAnnotatingTime) {
      setStartAnnotatingTime(Date.now());
    } else {
      setLabelTimestamps([
        ...labelTimestamps,
        {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
          start: starAnnotatingTime,
          end: Date.now(),
          label: bppvTypeSelected ? bppvTypeSelected : BPPV_TYPES[0].value,
        },
      ]);
      setStartAnnotatingTime(null);
      setBppvTypeSelected("");
    }
  };

  const resetData = () => {
    if (imageDataLeft) manageStream();
    setLabelTimestamps([]);
    setStartTime(0);
    setStartAnnotatingTime(null);
    setHeadMovementData([]);
  };

  const saveData = async () => {
    try {
      const payload = {
        patientName,
        gender,
        dateOfBirth,
        label: labelTimestamps,
        headMovementData,
        videoStartTime: startTime,
      };
      console.log(payload);
      await saveVideoDetail(payload);
      resetData();
    } catch (e) {
      console.log("Error ::: ", e);
    }
  };

  useEffect(() => {
    return () => {
      setImageDataLeft("");
      setImageDataRight("");
      fetch("http://127.0.0.1:5000/stop-video");
    };
  }, []);

  const manageStream = () => {
    if (!imageDataLeft) {
      setImageDataLeft(
        `http://127.0.0.1:5000/start-video-left?rand=${Math.random()}`
      );
      setImageDataRight(
        `http://127.0.0.1:5000/start-video-right?rand=${Math.random()}`
      );
      socket.connect();
      socket.on("updateSensorData", (data) => {
        setHeadMovementData((prev) => [...prev, data]);
        // if (headMovementData?.length)
        //   setHeadMovementData([...headMovementData, data]);
        // else setHeadMovementData([data]);
        setGraphData(data.angleValues);
      });
      setStartTime(Date.now());

      setIsOpen(true);
    } else {
      setImageDataLeft("");
      setImageDataRight("");
      fetch("http://127.0.0.1:5000/stop-video");
      socket.off("message");
      socket.disconnect();
      if (starAnnotatingTime) {
        toggleAnnotating();
      }
    }
  };

  useEffect(() => {
    console.log("head ::", headMovementData);
  }, [headMovementData]);

  return (
    <>
      <div className="min-h-fit !important">
        <DetailForm
          patientName={patientName}
          setPatientName={setPatientName}
          gender={gender}
          setGender={setGender}
          dateOfBirth={dateOfBirth}
          setDateOfBirth={setDateOfBirth}
        />
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
            isDisabled={
              !!startTime && !imageDataLeft && labelTimestamps.length > 0
            }
          >
            {imageDataLeft ? "Stop" : "Start"}
          </Button>
          {!!startTime && !imageDataLeft && labelTimestamps.length > 0 && (
            <Tooltip
              showArrow
              placement="right"
              content={"Save or Reset existing record first"}
            >
              <Button
                isIconOnly
                size="sm"
                radius="full"
                variant="flat"
                className="p-2 ml-2 w-1 h-8"
              >
                <InformationIcon />
              </Button>
            </Tooltip>
          )}
        </div>
        <Graphs data={graphData} />

        <FixedDiv>
          <ButtonGroup>
            <Tooltip content="Save annotations and video database">
              <Button
                size="sm"
                radius="full"
                color="success"
                variant="flat"
                onClick={saveData}
                isDisabled={
                  !startTime || !!imageDataLeft || labelTimestamps.length === 0
                }
              >
                Save
              </Button>
            </Tooltip>
            <Tooltip content="Reset all the annotations and video">
              <Button
                size="sm"
                radius="full"
                variant="flat"
                onClick={resetData}
              >
                {"Reset"}
              </Button>
            </Tooltip>
          </ButtonGroup>
          {!isAnnotationListOpen ? (
            <Badge content={labelTimestamps.length} color="primary">
              <Button
                size="sm"
                radius="full"
                variant="ghost"
                onClick={toggleOpenAnnotationList}
              >
                Annotations
              </Button>
            </Badge>
          ) : (
            <AnnotationListDiv>
              <Button
                isIconOnly
                onClick={toggleOpenAnnotationList}
                size="sm"
                radius="full"
                color="danger"
                variant="faded"
              >
                <ChevronDownIcon />
              </Button>
              <AnnotationList videoStart={startTime} />
            </AnnotationListDiv>
          )}
          {!isOpen ? (
            <FixedButton>
              <Button
                isIconOnly
                onClick={toggleCard}
                radius="full"
                color="primary"
                variant="faded"
              >
                <ChevronDownIcon />
              </Button>
            </FixedButton>
          ) : (
            <MenueCard>
              <CardBody>
                <div className="absolute top-0 right-1">
                  <Button
                    isIconOnly
                    onClick={toggleCard}
                    size="sm"
                    radius="full"
                    color="danger"
                    variant="faded"
                  >
                    <ChevronDownIcon />
                  </Button>
                </div>
                <div className="flex items-center justify-start">
                  <p className="mr-2">Annotation</p>
                  <Button
                    size="sm"
                    radius="full"
                    isDisabled={!imageDataLeft}
                    color={starAnnotatingTime ? "danger" : "default"}
                    onClick={toggleAnnotating}
                  >
                    {!starAnnotatingTime ? "Start" : "Stop"}
                  </Button>
                </div>
                <Select
                  isDisabled={!starAnnotatingTime}
                  size="sm"
                  label="BPPV Type"
                  className="mt-2"
                  selectedKeys={[bppvTypeSelected]}
                  onChange={(e) => setBppvTypeSelected(e.target.value)}
                >
                  {BPPV_TYPES.map((bppvType) => (
                    <SelectItem key={bppvType.value} value={bppvType.value}>
                      {bppvType.label}
                    </SelectItem>
                  ))}
                </Select>
              </CardBody>
            </MenueCard>
          )}
        </FixedDiv>
      </div>
    </>
  );
}

export default VideoRecoderPage;
