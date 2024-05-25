import axios from "axios";
import CONFIG from "../utils/config";

// Function to fetch head movement data from a defined API endpoint.
export const getHeadMovementData = () => {
  const url = `${CONFIG.pythonUrl}${CONFIG.endpoints.GET_HEAD_POINT}`;
  return axios.get(url);
};
