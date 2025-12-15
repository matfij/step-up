import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../api/api-definitions";

type UserStore = {
  user?: User;
  signIn: (user: User) => void;
  signOut: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      hydrated: false,
      signIn: (user: User) => set({ user }),
      signOut: () => set({ user: undefined }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Ensure state is loaded on app start
useUserStore.persist.hasHydrated();
