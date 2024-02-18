import VideoController from "./Components/VideoController/VideoController";
import VideoPlayer from "./Components/VideoPlayer/VideoPlayer";
import { PlayersContainer, VideoPageContainer } from "./Styles";

function VideoRecoderPage() {
  return (
    <>
      <VideoPageContainer>
        <PlayersContainer>
          <VideoPlayer videoLabel={"Right Eye"} />
          <VideoPlayer videoLabel={"Left Eye"} />
        </PlayersContainer>
      </VideoPageContainer>
      <VideoController />
    </>
  );
}

export default VideoRecoderPage;
