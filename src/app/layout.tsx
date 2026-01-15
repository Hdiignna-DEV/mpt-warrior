import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPT Trading HUB - Adapt to Every Market Condition",
  description: "MPT Trading HUB - Professional trading platform for Warriors.",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  viewport: {
    width: "device-width",
    initialScale: 1,
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
        <link rel="icon" type="image/png" href="/mpt-logo.png" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}