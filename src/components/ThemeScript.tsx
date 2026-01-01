export function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        const theme = localStorage.getItem('mpt-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let shouldUseDark = prefersDark;
        
        if (theme === 'dark') {
          shouldUseDark = true;
        } else if (theme === 'light') {
          shouldUseDark = false;
        } else if (theme === 'system' || !theme) {
          shouldUseDark = prefersDark;
        }
        
        if (shouldUseDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      } catch (e) {
        console.warn('Theme initialization error:', e);
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
