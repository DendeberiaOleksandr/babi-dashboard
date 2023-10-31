"use client";
import Sidebar from "@/components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { useSecured } from "@/hooks/useSecured";
import { Provider } from "react-redux";
import { store } from "@/store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Provider store={store}>{children}</Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
