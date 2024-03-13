type ENVIRONMENT_TYPE = "development" | "production";

export const ENVIRONMENT: ENVIRONMENT_TYPE =
  (process.env.NODE_ENV as ENVIRONMENT_TYPE) || "development";

const CONFIG = {
  url: {
    development: "http://127.0.0.1:5000/",
    production: "",
  },
  api: {
    SAVE_VIDEO: "/save-video",
  },
};

export default CONFIG;
