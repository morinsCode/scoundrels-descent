import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#f7b10eff",
      light: "#f7b10eff",
      dark: "#1565c0"
    },
    secondary: {
      main: "#a7790dff"
    },
    background: {
      default: "#0e0c0cff",
      paper: "#080808ff"
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
      color: "#fff2d2ff"
    }
  },
  spacing: 8,
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8
          }
        }
      }
    }
  }
});

export default theme;
