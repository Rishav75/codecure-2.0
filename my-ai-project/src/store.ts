import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  user: any;
  setUser: (user: any) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  mood: string | null;
  setMood: (mood: string) => void;
  waterAmount: number;
  setWaterAmount: (amount: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      mood: null,
      setMood: (mood) => set({ mood }),
      waterAmount: 2.1,
      setWaterAmount: (waterAmount) => set({ waterAmount }),
    }),
    {
      name: 'codecure-storage',
    }
  )
);
