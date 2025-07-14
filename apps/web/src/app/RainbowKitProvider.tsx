"use client";

import { useTheme } from "next-themes";
import {
  darkTheme,
  lightTheme,
  RainbowKitProvider as ParentProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

export function RainbowKitProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <ParentProvider theme={resolvedTheme === "light" ? lightTheme() : darkTheme()}>
      {children}
    </ParentProvider>
  );
}
