"use client";

import { PropsWithChildren } from "react";
import ThemeProvider from "./theme";
import { SocketProvider } from "./socket";
import { AuthProvider } from "./auth";

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <SocketProvider>{children}</SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
