import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useThemeStore from '../store/themeStore';
import { lightTheme, darkTheme } from '../config/theme';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
