import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import PanicButton from "@/components/PanicButton";
import TradingViewCalendar from "@/components/TradingViewCalendar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPT Warrior Hub - Trading Excellence",
  description: "Mindset Plan Trader Warrior Hub - Complete Trading System",
};

<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <link rel="apple-touch-icon" href="/mpt-logo.png" />
</head>

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 overflow-x-hidden`}>
        <div className="flex flex-col lg:flex-row h-screen lg:h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-950 w-full">
            {children}
          </main>
        </div>

        {/* Global Floating Components */}
        <PanicButton />
        <TradingViewCalendar />
      </body>
    </html>
  );
}