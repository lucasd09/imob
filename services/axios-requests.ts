import { setCookie, parseCookies, destroyCookie } from "nookies";
import axiosClient from "./axios-client";

const { "imob-token": token } = parseCookies();

export async function signInRequest({ email, password }: SignInProps) {
  try {
    const res = await axiosClient.post("/login", { email, password });

    if (res.status === 200) {
      const token = res.data.access_token;
      return token;
    }
  } catch {
    return null;
  }
}

export async function getRenters(
  userId: number
): Promise<RenterProps[] | undefined> {
  try {
    const res = await axiosClient.get(`/renters/${userId}`);

    if (res.status === 200) {
      const Renters: RenterProps[] = res.data.map((item: RenterProps) => {
        return {
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          cnpjcpf: item.cnpjcpf,
          pessoa: item.pessoa,
          birthdate: item.birthdate,
          ierg: item.ierg,
          userId: item.userId,
        };
      });
      return Renters;
    }
  } catch {}
}

export async function getRenter(
  userId: number,
  id: number
): Promise<RenterProps | undefined> {
  const res = await axiosClient.get(`/renters/${userId}/${id}`);

  if (res.status === 200) {
    const renter: RenterProps = {
      id: res.data.id,
      name: res.data.name,
      email: res.data.email,
      userId: res.data.userId,
      birthdate: res.data.birthdate,
      cnpjcpf: res.data.cnpjcpf,
      ierg: res.data.ierg,
      phone: res.data.phone,
      pessoa: res.data.pessoa,
    };
    return renter;
  }
}

export async function createRenter(data: RenterProps, userId: number) {
  const res = await axiosClient.post("/renters", {
    name: data.name,
    email: data.email,
    birthdate: data.birthdate,
    cnpjcpf: data.cnpjcpf,
    ierg: data.ierg,
    phone: data.phone,
    pessoa: data.pessoa,
    user: { connect: { id: userId } },
  });

  if (res.status === 201) {
    return res.data;
  }
}

export function logout() {
  destroyCookie(undefined, "imob-token");
}
