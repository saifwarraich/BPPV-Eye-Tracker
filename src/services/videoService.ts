import axios from "axios";
import CONFIG, { ENVIRONMENT } from "../utils/config";
import { IVideoDetailPayload } from "../utils/schema/video";

export const saveVideoDetail = (payload: IVideoDetailPayload) => {
  const url = `${CONFIG.url[ENVIRONMENT]}${CONFIG.api.SAVE_VIDEO}`;
  return axios.post(url, payload);
};
