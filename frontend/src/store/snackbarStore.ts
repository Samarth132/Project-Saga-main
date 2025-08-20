import { create } from 'zustand';
import type { AlertColor } from '../types/utils';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
  showSnackbar: (message: string, severity?: AlertColor) => void;
  hideSnackbar: () => void;
}

const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: '',
  severity: 'success',
  showSnackbar: (message, severity = 'success') => set({ open: true, message, severity }),
  hideSnackbar: () => set({ open: false }),
}));

export default useSnackbarStore;
