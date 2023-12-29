import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  id: number;
  username: string;
  token: string | null;
};

type Action = {
  updateId: (id: User["id"]) => void;
  updateUsername: (username: User["username"]) => void;
  updateToken: (token: User["token"]) => void;
};

export const useUserStore = create(
  persist<User & Action>(
    (set) => ({
      id: 0,
      username: "",
      token: null,
      updateId: (id) => set(() => ({ id: id })),
      updateUsername: (username) => set(() => ({ username: username })),
      updateToken: (token) => set(() => ({ token: token })),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    }
  )
);
