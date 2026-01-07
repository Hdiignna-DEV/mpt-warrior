import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ThemeProviderWrapper } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";
import I18nProvider from "@/components/I18nProvider";
import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from "sonner";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPT Warrior - Adapt to Every Market Condition",
  description: "Command your trades in the dark of the night or the light of the day. MPT Warrior provides the clarity you need, whenever you need it.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MPT Warrior",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#0ea5e9",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    viewportFit: "cover",
  },
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
        <link rel="apple-touch-icon" href="/mpt-logo.png" />
        <link rel="icon" type="image/png" href="/mpt-logo.png" />
      </head>
      <body className={`${inter.className}`} suppressHydrationWarning>
        {/* Register Service Worker */}
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/service-worker.js')
                    .then(function(registration) {
                      console.log('[PWA] Service Worker registered:', registration.scope);
                    })
                    .catch(function(error) {
                      console.log('[PWA] Service Worker registration failed:', error);
                    });
                });
              }
            `,
          }}
        />

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
            
            {/* PWA Install Prompt */}
            <PWAInstallPrompt />
            
            {/* Push Notification Prompt */}
            <PushNotificationPrompt />
          </UserProvider>
        </I18nProvider>
      </body>
    </html>
  );
}