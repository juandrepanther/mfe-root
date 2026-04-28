"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

type ProvidersProps = {
  children: React.ReactNode;
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#102a43",
    },
  },
});

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
