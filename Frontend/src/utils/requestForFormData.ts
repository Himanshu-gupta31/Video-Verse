// requestForFormData.ts
import axios from "axios";


export const formDataRequest = axios.create({
  baseURL: "https://video-verse-4.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

