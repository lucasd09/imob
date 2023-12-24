import axios from "axios";
import { parseCookies } from "nookies";

const { "imob-token": token } = parseCookies();

const axiosClient = axios.create({
  baseURL: "http://localhost:5000",
});

if (token) {
  axiosClient.defaults.headers["Authorization"] = `Bearer ${token}`;
}

export default axiosClient;
