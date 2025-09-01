"use client";

import { createTheme, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { PropsWithChildren } from "react";
import { lato, outfit } from "../utils/fonts";
import Header from "../components/Header/Header";
import { Session } from "next-auth";
import SocketProvider from "../components/Providers/SocketProvider";
import AuthProvider from "../components/Providers/AuthProvider";

const theme = createTheme({
  palette: {
    primary: {
      main: "#308C6D",
    },
    secondary: {
      main: "#CBE59E",
    },
    background: {
      paper: "#E5EEE1",
    },
  },
  typography: {
    fontFamily: [
      lato.style.fontFamily,
      outfit.style.fontFamily,
      "sans-serif",
    ].join(", "),
    h1: {
      fontFamily: "Outfit",
      fontSize: "3rem",
      fontWeight: "500",
      lineHeight: "60px",
    },
    h2: {
      fontFamily: "Outfit",
      fontSize: "3rem",
      fontWeight: 400,
      lineHeight: "60px",
    },
    h3: {
      fontFamily: "Outfit",
      fontSize: "1.5rem",
      fontWeight: "400",
      lineHeight: "30px",
    },
    h4: {
      fontFamily: [outfit.style.fontFamily].join(", "),
      fontSize: "1.5rem",
      fontWeight: "600",
      lineHeight: "30px",
    },
    body1: {
      fontFamily: "Lato",
      fontSize: "1rem",
      fontWeight: "400",
    },
    h5: {
      fontFamily: "Lato",
      fontSize: "1.5rem",
      fontWeight: "600",
    },
    caption: {
      fontFamily: "Lato",
      fontSize: "1.125rem",
      fontWeight: "400",
      letterSpacing: "3%",
      color: "rgba(0, 0, 0, 0.75)",
    },
    body2: {
      fontFamily: "Lato",
      fontSize: "1rem",
      fontWeight: "400",
      color: "rgba(0, 0, 0, 0.75)",
    },
    h6: {
      fontFamily: "Lato",
      fontSize: "1rem",
      fontWeight: "600",
    },
  },
});

type Props = {
  session: Session | null;
  image: string | null | undefined;
};

export default function CustomThemeProvider({
  children,
  session,
  image,
}: PropsWithChildren<Props>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <SocketProvider>
          <AuthProvider session={session}>
            <Header image={image} session={session} />
            <div className="w-full">{children}</div>
          </AuthProvider>
        </SocketProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
