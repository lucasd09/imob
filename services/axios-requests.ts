import { setCookie, parseCookies } from "nookies";
import axiosClient from "./axios-client";

const { "imob-token": token } = parseCookies();

export async function signIn({ email, password }: SignInProps) {
  try {
    const res = await axiosClient.post("/login", { email, password });

    if (res.status === 200) {
      const token = res.data.access_token;
      setCookie(undefined, "imob-token", token, {
        maxAge: 60 * 60 * 1, //1 hour
      });
      return true;
    }
  } catch {
    return false;
  }
}
