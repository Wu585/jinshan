import axios from "axios";

const request = axios.create({
  baseURL: "/",
  timeout: 6000,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
});

export default request;
