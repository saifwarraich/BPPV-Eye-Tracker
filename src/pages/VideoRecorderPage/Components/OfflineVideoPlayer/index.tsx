import React from "react";
import { CenterDiv } from "../../Styles";
import ReactPlayer from "react-player";
import { ReactPlayerContainer } from "./Styles";

interface OfflineVideoPlayerProps {
  videoUrl: string;
  videoRef: React.RefObject<ReactPlayer>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const OfflineVideoPlayer: React.FC<OfflineVideoPlayerProps> = ({
  videoUrl,
  videoRef,
  containerRef,
}) => {
  return (
    <CenterDiv>
      <ReactPlayerContainer ref={containerRef}>
        {/* <BackButtonContainer>
      <Button
        size="sm"
        variant="shadow"
        color="default"
        radius="full"
      >
        ↩ close
      </Button>
    </BackButtonContainer> */}
        <ReactPlayer
          ref={videoRef}
          url={videoUrl}
          width={800}
          height={400}
          controls
        />
      </ReactPlayerContainer>
    </CenterDiv>
  );
};

export default OfflineVideoPlayer;
