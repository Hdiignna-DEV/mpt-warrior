// Handle chunk loading errors and redirect to refresh
if (typeof window !== 'undefined') {
  // Listen for chunk load errors
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('Failed to load chunk')) {
      console.error('Chunk load error detected, reloading page...');
      // Clear Vercel CDN cache by adding a timestamp query param
      window.location.href = window.location.pathname + '?t=' + Date.now();
    }
  });

  // Also handle promise rejections for chunk errors
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && (event.reason.message || event.reason).includes('ChunkLoadError')) {
      console.error('ChunkLoadError detected, reloading page...');
      window.location.href = window.location.pathname + '?t=' + Date.now();
    }
  });
}
