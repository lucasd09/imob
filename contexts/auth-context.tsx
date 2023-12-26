"use client";
import axiosClient from "@/services/axios-client";
import { signInRequest } from "@/services/axios-requests";
import Router from "next/router";
import { setCookie } from "nookies";
import { createContext, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  signIn: (data: SignInProps) => Promise<string>;
};

type User = {
  token: string;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: ChildrenProps) {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInProps) {
    const token = await signInRequest({ email, password });

    if (!!token) {
      setCookie(undefined, "imob-token", token, {
        maxAge: 60 * 60 * 1, // 1 hour
      });

      axiosClient.defaults.headers["Authorization"] = `Bearer ${token}`;

      setUser({ token });

      return token;
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
