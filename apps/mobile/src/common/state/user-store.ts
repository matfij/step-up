import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Achievements, Progress, User } from "../api/api-definitions";

type UserStore = {
  user?: User;
  progress?: Progress;
  achievements?: Achievements;
  signIn: (user: User) => void;
  signOut: () => void;
  setProgress: (progress: Progress) => void;
  setAchievements: (achievements: Achievements) => void;
  updateProgress: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      hydrated: false,
      signIn: (user: User) => set({ user }),
      signOut: () => set({ user: undefined }),
      setProgress: (progress: Progress) => set({ progress }),
      setAchievements: (achievements: Achievements) => set({ achievements }),
      updateProgress: () =>
        set((state) => ({
          progress: state.progress
            ? {
                ...state.progress,
                totalActivities: state.progress.totalActivities + 1,
              }
            : undefined,
        })),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Ensure state is loaded on app start
useUserStore.persist.hasHydrated();
