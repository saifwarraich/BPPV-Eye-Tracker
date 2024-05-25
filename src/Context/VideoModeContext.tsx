import { ReactNode, createContext, useContext, useState } from "react";

interface VideoModeContextType {
  isLive: boolean;
  toggleVideoMode: () => void;
}

const VideoModeContext = createContext<VideoModeContextType>({
  isLive: true,
  toggleVideoMode: () => {},
});

// Hook for accessing the video mode context with safety checks.
export const useVideoMode = () => {
  const context = useContext(VideoModeContext);
  if (!context) {
    throw new Error("useLiveFeature must be used within a LiveFeatureProvider");
  }
  return context;
};

// Provider component that manages the state for video mode and exposes context.
export const VideoModeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLive, setIsLive] = useState<boolean>(true); // State to track whether video mode is live

  // Function to toggle the current state of `isLive` between true and false
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
