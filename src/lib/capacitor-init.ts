/**
 * Capacitor Initialization Script
 * Handles status bar, fullscreen, and other mobile optimizations
 * IMPORTANT: This only runs in browser, not on server
 */

export async function initializeCapacitor() {
  // Only run on client-side
  if (typeof window === 'undefined') return;

  try {
    // Dynamic imports - only load on client
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    const { App } = await import('@capacitor/app');

    // Set Status Bar style untuk dark theme
    await StatusBar.setStyle({ style: Style.Dark });
    
    // Set status bar background color
    await StatusBar.setBackgroundColor({ color: "#0f172a" });
    
    // Hide status bar if needed (fullscreen mode)
    // Uncomment jika ingin fullscreen tanpa status bar
    // await StatusBar.hide();
    
    console.log("[Capacitor] Initialization complete");
  } catch (error) {
    console.log("[Capacitor] Not running on native platform or plugin not available");
  }

  // Handle app close behavior (back button)
  try {
    const { App } = await import('@capacitor/app');
    App.addListener("backButton", ({ canGoBack }) => {
      if (!canGoBack) {
        // Exit app on last screen
        App.exitApp();
      } else {
        // Let default browser back button behavior happen
        window.history.back();
      }
    });
  } catch (error) {
    console.log("[Capacitor] App plugin not available");
  }
}
