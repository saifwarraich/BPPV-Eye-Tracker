import { VideoContainer, VideoLabel } from "./Styles";

interface VideoPlayerProps {
  videoLabel: string;
}

function VideoPlayer({ videoLabel }: VideoPlayerProps) {
  return (
    <div>
      <VideoLabel>{videoLabel}</VideoLabel>
      <VideoContainer />
    </div>
  );
}

export default VideoPlayer;
