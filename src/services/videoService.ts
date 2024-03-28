import axios from "axios";
import CONFIG, { ENVIRONMENT } from "../utils/config";
import { IVideoDetailPayload } from "../utils/schema/video";
import { VideoDetailType } from "../Context/VideoContext";

export const saveVideoDetail = (payload: IVideoDetailPayload) => {
  const url = `${CONFIG.pythonUrl}${CONFIG.endpoints.SAVE_VIDEO}`;
  return axios.post(url, payload);
};

export const getVideosDetailReq = async (): Promise<VideoDetailType[]> => {
  const url = `${CONFIG.url[ENVIRONMENT]}${CONFIG.endpoints.GET_ALL_VIDEOS_DETAIL}`;
  const res = await axios.get(url);
  return res.data;
};
