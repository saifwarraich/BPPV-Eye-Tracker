import axios from "axios";
import CONFIG, { ENVIRONMENT } from "../utils/config";
import {
  IUpdateVideoDetailPayload,
  IVideoDetailPayload,
} from "../utils/schema/video";
import { VideoDetailType } from "../Context/VideoContext";

export const saveVideoDetailService = (payload: IVideoDetailPayload) => {
  const url = `${CONFIG.pythonUrl}${CONFIG.endpoints.SAVE_VIDEO}`;
  return axios.post(url, payload);
};

export const updateVideoDetailService = (
  payload: IUpdateVideoDetailPayload
) => {
  const url = `${CONFIG.url[ENVIRONMENT]}${CONFIG.endpoints.UPDATE_VIDEO_DETAIL}`;
  return axios.put(url, payload);
};

export const getVideosDetailService = async (): Promise<VideoDetailType[]> => {
  const url = `${CONFIG.url[ENVIRONMENT]}${CONFIG.endpoints.GET_ALL_VIDEOS_DETAIL}`;
  const res = await axios.get(url);
  return res.data;
};

export const getSingleVideoService = (path: string): string => {
  return `${CONFIG.url[ENVIRONMENT]}${CONFIG.endpoints.GET_SINGLE_VIDEO}?path=${path}`;
};

export const deleteVideoService = (ids: string[]) => {
  const url = `${CONFIG.url[ENVIRONMENT]}${CONFIG.endpoints.DELETE_VIDEO_DETAIL}`;
  return axios.delete(url, { data: { ids } });
};
