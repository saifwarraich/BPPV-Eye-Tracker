import React from "react";
import { OverlayDiv } from "./Styles";
import { CircularProgress } from "@nextui-org/react";

interface OfflineVideoPlayerProps {
  isShow: boolean;
}

const LoadingScreen: React.FC<OfflineVideoPlayerProps> = ({ isShow }) => {
  return (
    <>
      {isShow ? (
        <OverlayDiv>
          <CircularProgress size="lg" aria-label="Loading..." />
        </OverlayDiv>
      ) : (
        ""
      )}
    </>
  );
};

export default LoadingScreen;
