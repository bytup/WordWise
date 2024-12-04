"use client";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

export function NextAuthProvider({ children }: PropsWithChildren) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
