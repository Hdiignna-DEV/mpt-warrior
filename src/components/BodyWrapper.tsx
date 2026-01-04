'use client';
import { useEffect, useState } from 'react';

export function BodyWrapper({ children, className }: { children: React.ReactNode; className: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check initial sidebar state from localStorage
    const stored = localStorage.getItem('sidebar-desktop-open');
    const isOpen = stored === null ? true : stored === 'true';
    
    if (isOpen) {
      document.body.classList.add('sidebar-open');
      document.body.classList.remove('sidebar-closed');
    } else {
      document.body.classList.add('sidebar-closed');
      document.body.classList.remove('sidebar-open');
    }
  }, []);

  if (!mounted) return null;
  
  return <>{children}</>;
}
