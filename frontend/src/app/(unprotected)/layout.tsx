"use client";

import { PropsWithChildren } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import "../(protected)/globals.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { lato } from "../utils/fonts";

const theme = createTheme({
  palette: {
    primary: {
      main: "#04724D",
    },
    secondary: {
      main: "#CBE59E",
    },
  },
  typography: {
    fontFamily: [lato.style.fontFamily, "sans-serif"].join(", "),
  },
});

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html>
      <head>
        <title>LinkMsg</title>
        {/* <link rel="icon" href="" /> */}
      </head>
      <body className="w-screen min-h-screen h-screen overflow-y-auto overflow-x-hidden">
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
