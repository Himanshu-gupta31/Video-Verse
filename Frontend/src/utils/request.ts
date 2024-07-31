import axios from "axios";
import { baseUrl } from "../main";



export const newRequest = axios.create({
  baseURL: `${baseUrl}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    // Authorization: `Bearer ${Cookies.get("accesstoken")}`,
  },
});