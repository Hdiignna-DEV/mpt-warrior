/**
 * Capacitor Initialization Script
 * Handles status bar, fullscreen, and other mobile optimizations
 * IMPORTANT: This only runs in browser, not on server
 */

export async function initializeCapacitor() {
  // Only run on client-side
  if (typeof window === 'undefined') return;

  try {
    // Dynamic imports - only load on client at runtime
    // @ts-ignore - These packages are only available on native/Capacitor runtime
    const { StatusBar, Style } = await import('@capacitor/status-bar').catch(() => ({}));
    
    if (StatusBar && Style) {
      // Set Status Bar style untuk dark theme
      await StatusBar.setStyle({ style: Style.Dark });
      
      // Set status bar background color
      await StatusBar.setBackgroundColor({ color: "#0f172a" });
      
      console.log("[Capacitor] Status Bar configured");
    }
  } catch (error) {
    console.log("[Capacitor] StatusBar plugin not available");
  }

  // Handle app close behavior (back button)
  try {
    // @ts-ignore - App plugin only available on native runtime
    const { App } = await import('@capacitor/app').catch(() => ({}));
    
    if (App && App.addListener) {
      App.addListener("backButton", ({ canGoBack }: { canGoBack: boolean }) => {
        if (!canGoBack) {
          // Exit app on last screen
          App.exitApp();
        } else {
          // Let default browser back button behavior happen
          window.history.back();
        }
      });
      console.log("[Capacitor] Back button handler registered");
    }
  } catch (error) {
    console.log("[Capacitor] App plugin not available");
  }
}

