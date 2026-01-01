import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PanicButton from "@/components/PanicButton";
import TradingViewCalendar from "@/components/TradingViewCalendar";
import { ThemeProviderWrapper } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPT Warrior Hub - Trading Excellence",
  description: "Mindset Plan Trader Warrior Hub - Complete Trading System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/mpt-logo.png" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 overflow-x-hidden dark flex flex-col min-h-screen`}>
        <ThemeProviderWrapper>
          {/* Header */}
          <Header />

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-950 w-full">
              {children}
            </main>
          </div>

          {/* Footer */}
          <Footer />

          {/* Global Floating Components */}
          <PanicButton />
          <TradingViewCalendar />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}