import { create } from "zustand";

type State = {
  id: number;
};

type Actions = {
  updateId: (id: State["id"]) => void;
};

export const useContractStore = create<State & Actions>((set) => ({
  id: 0,
  updateId: (id: number) => set(() => ({ id: id })),
}));
