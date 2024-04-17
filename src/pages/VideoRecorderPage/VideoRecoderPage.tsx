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
import { useEffect, useRef, useState } from "react";
import DetailForm from "./Components/DetailForm";
import Graphs from "./Components/Graphs";
import { BPPV_TYPES } from "../../utils/constants";
import { ChevronDownIcon } from "../../assets/ChevronDownIcon";
import AnnotationList from "./Components/AnnotationList";
import { InformationIcon } from "../../assets/informationIcon";
import { useLabelTimestamps } from "../../Context/useLabelTimeStamp";
import {
  AnnotationListDiv,
  FixedButton,
  FixedDiv,
  MenueCard,
  CenterDiv,
  WidthDiv,
  FlexRowDiv,
} from "./Styles";
import {
  deleteVideoService,
  getSingleVideoService,
  saveVideoDetailService,
  updateVideoDetailService,
} from "../../services/videoService";
import ReactPlayer from "react-player";
import { useVideoMode } from "../../Context/VideoModeContext";
import VideoDataList from "./Components/VideoDataList";
import { VideoDetailType, useVideos } from "../../Context/VideoContext";
import { IUpdateVideoDetailPayload } from "../../utils/schema/video";
import OfflineVideoPlayer from "./Components/OfflineVideoPlayer";
import { useAlert } from "react-alert";
import LoadingScreen from "../../components/LoadingScreen";
import { getHeadMovementData } from "../../services/sensorService";
import { GraphImage } from "./Components/Graphs/Styles";
import { HeadMovementDataType } from ".";

export function VideoRecoderPage() {
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
  const [videoDetailToUpdate, setVideoDetailToUpdate] =
    useState<IUpdateVideoDetailPayload | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const { isLive } = useVideoMode();
  const videoDivRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<ReactPlayer>(null);
  const accordianDivRef = useRef<HTMLDivElement>(null);
  const [showNameError, setShowNameError] = useState(false);
  const [showGenderError, setShowGenderError] = useState(false);
  const { getVideosDetail } = useVideos();
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [xangle, setXangle] = useState(0);
  const [yangle, setYangle] = useState(0);

  const toggleCard = () => {
    setIsAnnotationListOpen(false);
    setIsOpen(!isOpen);
  };

  const toggleOpenAnnotationList = () => {
    setIsOpen(false);
    setIsAnnotationListOpen(!isAnnotationListOpen);
  };

  const toggleAnnotating = () => {
    if (isLive) {
      if (!starAnnotatingTime) {
        setStartAnnotatingTime(Date.now());
      } else {
        setLabelTimestamps([
          ...labelTimestamps,
          {
            id:
              Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            start: starAnnotatingTime,
            end: Date.now(),
            label: bppvTypeSelected ? bppvTypeSelected : BPPV_TYPES[0].value,
          },
        ]);
        setStartAnnotatingTime(null);
        setBppvTypeSelected("");
      }
    } else {
      if (videoPlayerRef.current) {
        const milSecPlayed = 1000 * videoPlayerRef.current?.getCurrentTime();
        if (!starAnnotatingTime) {
          setStartAnnotatingTime(milSecPlayed + startTime);
        } else {
          setLabelTimestamps([
            ...labelTimestamps,
            {
              id:
                Date.now().toString(36) +
                Math.random().toString(36).slice(2, 7),
              start: starAnnotatingTime,
              end: milSecPlayed + startTime,
              label: bppvTypeSelected ? bppvTypeSelected : BPPV_TYPES[0].value,
            },
          ]);
          setStartAnnotatingTime(null);
          setBppvTypeSelected("");
        }
      }
    }
  };

  const resetData = () => {
    if (imageDataLeft) manageStream();
    setLabelTimestamps([]);
    setStartTime(0);
    setStartAnnotatingTime(null);
    setHeadMovementData([]);
    setVideoUrl("");
    setVideoDetailToUpdate(null);
    setPatientName("");
    setGender("");
    setDateOfBirth("");
    setShowNameError(false);
    setShowGenderError(false);
  };

  const saveData = async () => {
    try {
      setLoading(true);
      if (!patientName.length || !gender.length) {
        if (!patientName.length) setShowNameError(true);
        if (!gender.length) setShowGenderError(true);
        alert.show("Enter patient details properly", { type: "error" });
        return;
      }
      if (isLive) {
        const payload = {
          patientName,
          gender,
          dateOfBirth,
          label: labelTimestamps,
          headMovementData,
          videoStartTime: startTime,
        };
        await saveVideoDetailService(payload);
        resetData();
        alert.show("Saved Successfully", { type: "success" });
      } else {
        if (videoDetailToUpdate) {
          const payload = {
            ...videoDetailToUpdate,
            patientName,
            gender,
            dateOfBirth,
            label: labelTimestamps,
          };
          await updateVideoDetailService(payload);
          await getVideosDetail();
          alert.show("Saved Successfully", { type: "success" });
        }
      }
    } catch (e) {
      console.log("Error ::: ", e);
      alert.show("Something went wrong while saving", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const setVideoDetailOnClick = (videoDetail: VideoDetailType) => {
    setVideoUrl(getSingleVideoService(videoDetail.combinedVideo));
    setGender(videoDetail.gender ?? "");
    setDateOfBirth(videoDetail.dateOfBirth ?? "");
    setPatientName(videoDetail.patientName);
    setLabelTimestamps(videoDetail.label);
    setStartTime(videoDetail.videoStartTime);
    setVideoDetailToUpdate(videoDetail);
    setHeadMovementData(videoDetail.headMovementData);
    setShowNameError(false);
    setShowGenderError(false);
    if (accordianDivRef.current) accordianDivRef.current.click();
    if (videoDivRef.current)
      videoDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const deleteVideos = async (ids: string[]) => {
    try {
      await deleteVideoService(ids);
      await getVideosDetail();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    return () => {
      setImageDataLeft("");
      setImageDataRight("");
      fetch("http://127.0.0.1:5000/stop-video");
    };
  }, []);

  useEffect(() => {
    if (isLive) resetData();
  }, [isLive]);

  const fetchHeadData = async () => {
    const res = await getHeadMovementData();
    const data = res.data;
    setHeadMovementData((prev) => [...prev, data]);
    const newXAngle = Math.floor(data.angleValues[0] * 1);
    const newYAngle = Math.floor(data.angleValues[1] * 100);
    console.log(data.angleValues[0], data.angleValues[1]);
    console.log(newXAngle, newYAngle);
    setXangle(data.angleValues[0]);
    setYangle(data.angleValues[1]);
    setGraphData(data.angleValues);
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // Example: Generate random angles for demonstration
  //     const newXAngle = Math.random() * 360;
  //     const newYAngle = Math.random() * 360;
  //     setXangle(newXAngle);
  //     setYangle(newYAngle);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);
  const manageStream = () => {
    if (!imageDataLeft) {
      setImageDataLeft(
        `http://127.0.0.1:5000/start-video-left?rand=${Math.random()}`
      );
      setImageDataRight(
        `http://127.0.0.1:5000/start-video-right?rand=${Math.random()}`
      );
      const id = setInterval(fetchHeadData, 1000);
      setIntervalId(id);
      // socket.connect();
      // socket.on("updateSensorData", (data) => {
      //   setHeadMovementData((prev) => [...prev, data]);
      //   setXangle(data.angleValues[0])
      //   setYangle(data.angleValues[1])
      //   setGraphData(data.angleValues);
      // });
      setStartTime(Date.now());

      setIsOpen(true);
    } else {
      setImageDataLeft("");
      setImageDataRight("");
      fetch("http://127.0.0.1:5000/stop-video");
      if (intervalId) clearInterval(intervalId);
      setIntervalId(null);
      // socket.off("message");
      // socket.disconnect();
      if (starAnnotatingTime) {
        toggleAnnotating();
      }
      setXangle(0);
      setYangle(0);
    }
  };

  return (
    <>
      <LoadingScreen isShow={loading} />
      <div className="min-h-fit !important">
        <div ref={accordianDivRef}>
          <DetailForm
            isDisabled={!isLive && !Boolean(videoUrl.length)}
            patientName={patientName}
            setPatientName={setPatientName}
            gender={gender}
            setGender={setGender}
            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
            showNameError={showNameError}
            showGenderError={showGenderError}
            setShowGenderError={setShowGenderError}
          />
        </div>
        {!isLive ? (
          <FlexRowDiv>
            <CenterDiv>
              <WidthDiv>
                <VideoDataList
                  setVideoUrl={setVideoDetailOnClick}
                  deleteVideos={deleteVideos}
                />
              </WidthDiv>
            </CenterDiv>
            <OfflineVideoPlayer
              videoUrl={videoUrl}
              videoRef={videoPlayerRef}
              containerRef={videoDivRef}
            />
          </FlexRowDiv>
        ) : (
          ""
        )}
        {isLive ? (
          <>
            <CenterDiv>
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
            </CenterDiv>
            <CenterDiv>
              <Button
                color={imageDataLeft ? "danger" : "primary"}
                variant="shadow"
                onPress={manageStream}
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
            </CenterDiv>
          </>
        ) : (
          ""
        )}

        {isLive ? (
          <div className="flex justify-center gap-4 items-center mt-5">
            <div className="text-center text-xl font-semibold">
              <p>Pitch</p>
              <div style={{ transform: `rotate(${xangle}deg)` }}>
                <div></div>
                <GraphImage
                  className={"rounded-full !important"}
                  src={"/y-img.jpg"}
                  alt="X"
                />
              </div>
            </div>
            <div className="text-center text-xl font-semibold">
              <p>Roll</p>
              <div style={{ transform: `rotate(${yangle}deg)` }}>
                <div></div>
                <img
                  className={"rounded-full !important"}
                  src={"/x-img.jpg"}
                  alt="Y"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-4 items-center mt-5"></div>
        )}

        {/* {isLive ? ( */}
        <Graphs data={graphData} xAngle={xangle} yAngle={yangle} />
        {/* ) : ( */}
        {/* "" */}
        {/* )} */}
        <FixedDiv hidden={!isLive && !Boolean(videoUrl.length)}>
          <ButtonGroup>
            <Tooltip content="Save annotations and video database">
              <Button
                size="sm"
                radius="full"
                color="success"
                variant="flat"
                onPress={saveData}
                isDisabled={!startTime || !!imageDataLeft}
              >
                Save
              </Button>
            </Tooltip>
            <Tooltip content="Reset all the annotations and video">
              <Button
                size="sm"
                radius="full"
                variant="flat"
                onPress={resetData}
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
                onPress={toggleOpenAnnotationList}
              >
                Annotations
              </Button>
            </Badge>
          ) : (
            <AnnotationListDiv>
              <Button
                isIconOnly
                onPress={toggleOpenAnnotationList}
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
                onPress={toggleCard}
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
                    onPress={toggleCard}
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
                    isDisabled={!imageDataLeft && !Boolean(videoUrl.length)}
                    color={starAnnotatingTime ? "danger" : "default"}
                    onPress={toggleAnnotating}
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
