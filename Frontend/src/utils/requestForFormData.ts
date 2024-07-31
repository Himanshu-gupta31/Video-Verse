// requestForFormData.ts
import axios from "axios";
import { baseUrl } from "../main";


export const formDataRequest = axios.create({
  baseURL: `${baseUrl}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

