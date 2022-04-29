import axios from "axios";
import { getToken } from "@/utils/auth";

const request = axios.create({
  baseURL: "/",
  timeout: 6000,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
});

request.interceptors.request.use(
  config => {
    if (config.url.indexOf("exchange") >= 0 && getToken()) {
      config.headers["x-access-token"] = getToken();
    }
    return config;
  },
  error => {
    console.log(error);
    Promise.reject(error);
  }
);

request.interceptors.response.use(
  response => {
    const code = response.status
    if (code < 200 || code > 300) {
      return Promise.reject('error')
    } else {
      return response
    }
  },
)

export default request;
