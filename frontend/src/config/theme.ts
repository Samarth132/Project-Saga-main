import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7b4f30ff', // SaddleBrown
    },
    secondary: {
      main: '#800000', // Maroon
    },
    error: {
      main: '#d32f2f', // A standard red for errors
    },
    background: {
      default: '#d0c9b7ff', // Parchment-like cream
      paper: '#c4bda9ff', // Slightly darker shade for paper elements
    },
    text: {
      primary: '#2c1e12', // Very dark brown
      secondary: '#5a5a5a', // Corrected grey
    },
  },
  typography: {
    fontFamily: "Lora, serif",
    h1: {
      fontFamily: "MedievalSharp, cursive",
    },
    h2: {
      fontFamily: "MedievalSharp, cursive",
    },
    h3: {
      fontFamily: "MedievalSharp, cursive",
    },
    h4: {
      fontFamily: "MedievalSharp, cursive",
    },
    h5: {
      fontFamily: "MedievalSharp, cursive",
    },
    h6: {
      fontFamily: "MedievalSharp, cursive",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '2px solid #8b4513',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '2px solid #8b4513',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '2px solid #8b4513',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b79677ff', // Lighter, desaturated brown
    },
    secondary: {
      main: '#b25b5b', // Desaturated red
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#3a3a3a', // Dark, aged scroll color
      paper: '#4a4a4a', // Contrasting dark surface
    },
    text: {
      primary: '#fdf6e3', // Light parchment cream for text
      secondary: '#cccccc',
    },
  },
  typography: {
    fontFamily: "Lora, serif",
    h1: {
      fontFamily: "MedievalSharp, cursive",
    },
    h2: {
      fontFamily: "MedievalSharp, cursive",
    },
    h3: {
      fontFamily: "MedievalSharp, cursive",
    },
    h4: {
      fontFamily: "MedievalSharp, cursive",
    },
    h5: {
      fontFamily: "MedievalSharp, cursive",
    },
    h6: {
      fontFamily: "MedievalSharp, cursive",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '2px solid #a07e5f',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '2px solid #a07e5f',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '2px solid #a07e5f',
          backgroundImage: 'none', // Remove gradient/shadow for a flatter look
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
