import axios from "axios";
import CONFIG, { ENVIRONMENT } from "../utils/config";
import {
  IUpdateVideoDetailPayload,
  IVideoDetailPayload,
} from "../utils/schema/video";
import { VideoDetailType } from "../Context/VideoContext";

// Saves video detail data to a server using a POST request.
export const saveVideoDetailService = (payload: IVideoDetailPayload) => {
  const url = `${CONFIG.pythonUrl}${CONFIG.endpoints.SAVE_VIDEO}`;
  return axios.post(url, payload);
};

// Updates video detail data on the server using a PUT request.
export const updateVideoDetailService = (
  payload: IUpdateVideoDetailPayload
) => {
  const url = `${CONFIG.url[ENVIRONMENT]}${CONFIG.endpoints.UPDATE_VIDEO_DETAIL}`;
  return axios.put(url, payload);
};

// Retrieves all video details from the server using a GET request.
export const getVideosDetailService = async (): Promise<VideoDetailType[]> => {
  const url = `${CONFIG.url[ENVIRONMENT]}${CONFIG.endpoints.GET_ALL_VIDEOS_DETAIL}`;
  const res = await axios.get(url);
  return res.data;
};

// Constructs a URL to access a single video based on its path.
export const getSingleVideoService = (path: string): string => {
  return `${CONFIG.url[ENVIRONMENT]}${CONFIG.endpoints.GET_SINGLE_VIDEO}?path=${path}`;
};

// Deletes one or more video details from the server using a DELETE request.
export const deleteVideoService = (ids: string[]) => {
  const url = `${CONFIG.url[ENVIRONMENT]}${CONFIG.endpoints.DELETE_VIDEO_DETAIL}`;
  return axios.delete(url, { data: { ids } });
};
