import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ThemeProviderWrapper } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";
import I18nProvider from "@/components/I18nProvider";
import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPT Warrior - Adapt to Every Market Condition",
  description: "Command your trades in the dark of the night or the light of the day. MPT Warrior provides the clarity you need, whenever you need it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/mpt-logo.png" />
        <link rel="icon" type="image/png" href="/mpt-logo.png" />
      </head>
      <body className={`${inter.className}`} suppressHydrationWarning>
        <I18nProvider>
          <UserProvider>
            {/* Toast Notifications */}
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--glass-bg)',
                  color: 'rgb(var(--text-primary))',
                  border: '1px solid var(--glass-border)',
                  backdropFilter: 'blur(20px)',
                },
                className: 'sonner-toast',
              }}
              richColors
              closeButton
            />
            <ThemeProviderWrapper>
              {/* Conditional Layout: Landing vs Dashboard */}
              <LayoutWrapper>{children}</LayoutWrapper>
            </ThemeProviderWrapper>
          </UserProvider>
        </I18nProvider>
      </body>
    </html>
  );
}