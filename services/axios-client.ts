import axios from "axios";
import { parseCookies } from "nookies";

const { "imob-token": token } = parseCookies();

export const axiosClient = axios.create({
  baseURL: "https://imob-api.onrender.com",
});

export const ZipCodeClient = axios.create({
  baseURL: "https://viacep.com.br/ws",
});

if (token) {
  axiosClient.defaults.headers["Authorization"] = `Bearer ${token}`;
}
