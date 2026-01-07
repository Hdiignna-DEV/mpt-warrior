/**
 * Demo Mode Warning Banner
 * Displayed when Cosmos DB is not configured
 */

'use client';

import { useUser } from '@/contexts/UserContext';
import { AlertTriangle } from 'lucide-react';

export function DemoModeBanner() {
  const { user } = useUser();

  // Only show if user profile has _demoMode flag
  if (!user || !(user as any)._demoMode) {
    return null;
  }

  return (
    <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
            Demo Mode Active
          </h3>
          <p className="text-sm text-yellow-600 dark:text-yellow-300">
            Database belum terkonfigurasi. Anda menggunakan demo profile sementara. 
            Data tidak akan tersimpan secara permanen.
          </p>
          <p className="text-xs text-yellow-600/80 dark:text-yellow-300/80 mt-2">
            Admin: Set environment variables <code className="px-1 py-0.5 bg-black/10 rounded">AZURE_COSMOS_ENDPOINT</code> dan{' '}
            <code className="px-1 py-0.5 bg-black/10 rounded">AZURE_COSMOS_KEY</code> di Vercel Dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
