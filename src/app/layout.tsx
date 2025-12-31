import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import PanicButton from "@/components/PanicButton";
import InvestingCalendar from "@/components/TradingViewCalendar";
import TradingViewCalendar from "@/components/TradingViewCalendar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPT Warrior Hub - Trading System",
  description: "Mindset Plan Trader - Full Trading Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* Global Components */}
          <PanicButton />
          <TradingViewCalendar />
        </div>
      </body>
    </html>
  );
}