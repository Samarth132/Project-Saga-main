import { create } from 'zustand';

type ThemeState = {
  mode: 'light' | 'dark';
  toggleMode: () => void;
};

const useThemeStore = create<ThemeState>((set) => ({
  mode: (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light',
  toggleMode: () =>
    set((state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return { mode: newMode };
    }),
}));

export default useThemeStore;
