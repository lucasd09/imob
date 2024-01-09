import axios from "axios";
import { parseCookies } from "nookies";

const { "imob-token": token } = parseCookies();

export const axiosClient = axios.create({
  baseURL: "http://localhost:5000",
});

export const ZipCodeClient = axios.create({
  baseURL: "https://viacep.com.br/ws",
});

if (token) {
  axiosClient.defaults.headers["Authorization"] = `Bearer ${token}`;
}
