'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

export function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={true}
      enableColorScheme={false}
      storageKey="mpt-theme"
      forcedTheme={undefined}
      disableTransitionOnChange={false}
      themes={['light', 'dark']}
    >
      {children}
    </ThemeProvider>
  );
}
