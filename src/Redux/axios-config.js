import axios from "axios";

const url = process.env.NEXT_PUBLIC_BASE_URL;
const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
  headers: {},
  // headers: {
  //   // "Access-Control-Allow-Origin": "*",
  //   // "Access-Control-Allow-Headers": "*",
  //   // "Access-Control-Allow-Credentials": true,
  //   // "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  //   // Authorization: `Bearer ${token}`,
  // },
});

export default axiosInstance;
