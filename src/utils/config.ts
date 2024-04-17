type ENVIRONMENT_TYPE = "development" | "production";

export const ENVIRONMENT: ENVIRONMENT_TYPE =
  (process.env.NODE_ENV as ENVIRONMENT_TYPE) || "development";

const CONFIG = {
  url: {
    development: "http://localhost:4000",
    production: "",
  },
  pythonUrl: "http://127.0.0.1:5000/",
  endpoints: {
    SAVE_VIDEO: "/save-video",
    GET_ALL_VIDEOS_DETAIL: "/v1/video-detail/",
    GET_SINGLE_VIDEO: "/v1/video-detail/get-video",
    UPDATE_VIDEO_DETAIL: "/v1/video-detail/",
    DELETE_VIDEO_DETAIL: "/v1/video-detail/",
    GET_HEAD_POINT: "/sensor_data",
  },
};

export default CONFIG;
