import React from "react";
import { CenterDiv } from "../../Styles";
import ReactPlayer from "react-player";
import { PlayerPlaceholder, ReactPlayerContainer } from "./Styles";

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
        {videoUrl ? (
          <ReactPlayer
            ref={videoRef}
            url={videoUrl}
            width={800}
            height={400}
            controls
            onProgress={() => console.log("called")}
          />
        ) : (
          <PlayerPlaceholder src="/video-load-placeholder.svg" />
        )}
      </ReactPlayerContainer>
    </CenterDiv>
  );
};

export default OfflineVideoPlayer;
