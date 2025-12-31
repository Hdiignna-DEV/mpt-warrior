import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MPT Warrior",
  description: "Markas Komunitas Mindset Plan Trader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-[#0d1b2a] text-white">
        {children}
      </body>
    </html>
  );
}