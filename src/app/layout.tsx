import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { ThemeProviderWrapper } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";
import I18nProvider from "@/components/I18nProvider";
import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from "sonner";
import Script from "next/script";

// Lazy load components with heavy dependencies
const LayoutWrapper = dynamic(() => import("@/components/LayoutWrapper"), {
  ssr: true,
  loading: () => null,
});

const PWAInstallPrompt = dynamic(() => import("@/components/PWAInstallPrompt"), {
  ssr: false,
  loading: () => null,
});

const PushNotificationPrompt = dynamic(() => import("@/components/PushNotificationPrompt"), {
  ssr: false,
  loading: () => null,
});

const MobileBottomNav = dynamic(() => import("@/components/MobileBottomNav").then(mod => ({ default: mod.MobileBottomNav })), {
  ssr: false,
  loading: () => null,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPT Trading HUB - Adapt to Every Market Condition",
  description: "MPT Trading HUB - Professional trading platform for Warriors. Complete trading management, AI mentor, and real-time leaderboard.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MPT Command Center",
    startupImage: [
      {
        url: "/mpt-logo.png",
        media: "(device-width: 375px) and (device-height: 667px)",
      },
      {
        url: "/mpt-logo.png",
        media: "(device-width: 414px) and (device-height: 896px)",
      }
    ],
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#0f172a",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    minimumScale: 1,
    viewportFit: "cover",
    userScalable: true,
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
              
              {/* Mobile Bottom Navigation */}
              <div className="md:hidden">
                <MobileBottomNav />
              </div>
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