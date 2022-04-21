import axios from "axios";

const request = axios.create({
  baseURL: "/",
  timeout: 6000,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
});

/*request.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers["x-access-token"] = getToken();
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);*/

export default request;
