import { ReactNode, createContext, useContext, useState } from "react";

interface VideoModeContextType {
  isLive: boolean;
  toggleVideoMode: () => void;
}

const VideoModeContext = createContext<VideoModeContextType>({
  isLive: true,
  toggleVideoMode: () => {},
});

export const useVideoMode = () => {
  const context = useContext(VideoModeContext);
  if (!context) {
    throw new Error("useLiveFeature must be used within a LiveFeatureProvider");
  }
  return context;
};

export const VideoModeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLive, setIsLive] = useState<boolean>(true);

  const toggleVideoMode = () => {
    setIsLive((prevIsLive) => !prevIsLive);
  };

  return (
    <VideoModeContext.Provider
      value={{ isLive, toggleVideoMode: toggleVideoMode }}
    >
      {children}
    </VideoModeContext.Provider>
  );
};
