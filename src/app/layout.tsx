import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import PanicButton from "@/components/PanicButton";
import TradingViewCalendar from "@/components/TradingViewCalendar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPT Warrior Hub - Trading Command Center",
  description: "Mindset Plan Trader - Professional Trading Platform",
  icons: {
    icon: '/mpt-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 overflow-hidden`}>
        <div className="flex h-screen w-screen overflow-hidden">
          {/* Sidebar - Fixed */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Bar - Sticky */}
            <TopBar />

            {/* Page Content - Scrollable */}
            <main className="flex-1 overflow-y-auto">
              <div className="min-h-full">
                {children}
              </div>
            </main>
          </div>

          {/* Global Components */}
          <PanicButton />
          <TradingViewCalendar />
        </div>

        {/* Scroll behavior smooth */}
        <style jsx global>{`
          html {
            scroll-behavior: smooth;
          }
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: rgba(100, 116, 139, 0.5);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(100, 116, 139, 0.8);
          }
        `}</style>
      </body>
    </html>
  );
}