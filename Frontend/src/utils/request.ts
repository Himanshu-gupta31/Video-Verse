import axios from "axios";




export const newRequest = axios.create({
  baseURL: `https://video-verse-4.onrender.com/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    // Authorization: `Bearer ${Cookies.get("accesstoken")}`,
  },
});