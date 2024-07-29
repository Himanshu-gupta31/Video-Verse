// requestForFormData.ts
import axios from "axios";
import Cookies from "js-cookie";

export const formDataRequest = axios.create({
  baseURL: "https://video-verse-six.vercel.app/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${Cookies.get("accesstoken")}`,
  },
});

// // Interceptor to update the token before each request
// formDataRequest.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer ${Cookies.get("accesstoken")}`;
//   return config;
// });