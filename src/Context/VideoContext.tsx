import React, { createContext, useState, useContext, ReactNode } from "react";
import { getVideosDetailService } from "../services/videoService";

export interface VideoDetailType {
  _id: string;
  patientName: string;
  dateOfBirth?: string;
  gender?: string;
  label: {
    id: string;
    start: number;
    end: number;
    label: string;
    comment?: string;
  }[];
  headMovementData: {
    timestamp: number;
    sensorData: number[];
    angleValues: number[];
  }[];
  videoStartTime: number;
  leftEyeVideoPath: string;
  rightEyeVideoPath: string;
  combinedVideo: string;
}

interface VideosContextType {
  videoDetails: VideoDetailType[];
  setVideoDetails: React.Dispatch<React.SetStateAction<VideoDetailType[]>>;
  getVideosDetail: () => Promise<void>;
}

const VideosContext = createContext<VideosContextType>({
  videoDetails: [],
  setVideoDetails: () => {},
  getVideosDetail: async () => {},
});

// Custom hook to provide easy access to the Videos context throughout the application.
export const useVideos = () => useContext(VideosContext);

// Context provider component that encapsulates the state management for video details and provides methods to manipulate it.
export const VideosContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [videoDetails, setVideoDetails] = useState<VideoDetailType[]>([]);

  // Asynchronous function that fetches video details using a service and updates the state.
  const getVideosDetail = async () => {
    const allVideoDetails = await getVideosDetailService();
    setVideoDetails(allVideoDetails);
  };

  return (
    <VideosContext.Provider
      value={{
        videoDetails: videoDetails,
        setVideoDetails: setVideoDetails,
        getVideosDetail: getVideosDetail,
      }}
    >
      {children}
    </VideosContext.Provider>
  );
};
