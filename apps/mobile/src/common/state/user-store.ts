import { create } from "zustand";

type UserStore = {
  id?: string;
  email?: string;
  username?: string;
  signIn: (user: { id: string; email: string; username: string }) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  signIn: (user: { id: string; email: string; username: string }) =>
    set({
      id: user.id,
      email: user.email,
      username: user.username,
    }),
}));
