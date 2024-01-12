"use client";
import { axiosClient } from "@/services/axios-client";
import { signInRequest } from "@/services/axios-requests";
import { useUserStore } from "@/stores/user-store";
import { setCookie } from "nookies";
import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  isAuthenticated: boolean;
  signIn: (data: SignInProps) => Promise<string>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: ChildrenProps) {
  const user = useUserStore();

  const isAuthenticated = !!user.token;

  async function signIn({ email, password }: SignInProps) {
    const token = await signInRequest({ email, password });

    if (!!token) {
      setCookie(undefined, "imob-token", token, {
        maxAge: 60 * 60 * 1, // 1 hour
      });

      axiosClient.defaults.headers["Authorization"] = `Bearer ${token}`;

      const jwt = jwtDecode<JwtProps>(token);

      user.updateId(jwt.sub);
      user.updateUsername(jwt.name);
      user.updateToken(token);

      return token;
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
