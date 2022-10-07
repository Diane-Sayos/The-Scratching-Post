import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1760a5",
      light: "#f8f8f8",
    },
    secondary: {
      main: "#15c630",
    },
    otherColors: {
      main: "#3FA796",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1600,
    },
  },
});