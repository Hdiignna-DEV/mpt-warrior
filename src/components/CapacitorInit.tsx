'use client';

import { useEffect } from 'react';
import { initializeCapacitor } from '@/lib/capacitor-init';

/**
 * CapacitorInit Component
 * Initializes Capacitor plugins when app starts on native platform
 */
export function CapacitorInit() {
  useEffect(() => {
    initializeCapacitor();
  }, []);

  return null; // Component tidak render UI, hanya initialization
}
