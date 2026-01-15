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
import { MobileBottomNav } from "@/components/MobileBottomNav";
import Script from "next/script";

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
        {/* Handle chunk loading errors early */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('error', function(event) {
                  if (event.message && (event.message.includes('Failed to load chunk') || event.message.includes('ChunkLoadError'))) {
                    console.error('[MPT] Chunk load error detected, reloading page...');
                    window.location.href = window.location.pathname + '?t=' + Date.now();
                  }
                });
                window.addEventListener('unhandledrejection', function(event) {
                  if (event.reason && ((event.reason.message || event.reason).includes('ChunkLoadError') || (event.reason.message || event.reason).includes('Failed to load chunk'))) {
                    console.error('[MPT] ChunkLoadError detected, reloading page...');
                    window.location.href = window.location.pathname + '?t=' + Date.now();
                  }
                });
              }
            `,
          }}
        />
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