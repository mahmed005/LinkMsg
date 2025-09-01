"use client";

import { Session } from "next-auth";
import { createContext, PropsWithChildren } from "react";

type ContextProps = {
  session: Session | null;
};

export const AuthContext = createContext<ContextProps | null>(null);

export default function AuthProvider({
  session,
  children,
}: PropsWithChildren<ContextProps>) {
  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
}
