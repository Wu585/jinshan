import Cookies from "js-cookie";
import { getGpsToken } from "@/apis/information";

export function getToken() {
  return Cookies.get("token");
}

export async function setToken() {
  const res = await getGpsToken();
  const token = res.data.data["x-access-token"];
  return Cookies.set("token", token);
}
