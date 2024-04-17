import axios from "axios";
import CONFIG from "../utils/config";

export const getHeadMovementData = () => {
  const url = `${CONFIG.pythonUrl}${CONFIG.endpoints.GET_HEAD_POINT}`;
  return axios.get(url);
};
