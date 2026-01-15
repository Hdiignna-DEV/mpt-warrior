'use client';

import { useEffect, useState } from 'react';

export default function MaintenancePage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user info is available in localStorage (set by auth)
    // Or check if they have admin-related data accessible
    try {
      const userRole = localStorage.getItem('userRole');
      if (userRole) {
        const role = userRole.toUpperCase();
        setIsAdmin(role === 'ADMIN' || role === 'SUPER_ADMIN');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Admin Mode Banner */}
      {isAdmin && (
        <div className="bg-yellow-500/20 border-b-2 border-yellow-500 text-yellow-300 px-4 py-3 flex items-center gap-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13 16a1 1 0 11-2 0 1 1 0 012 0zm0-6a1 1 0 11-2 0 1 1 0 012 0zM9 2a1 1 0 11-2 0 1 1 0 012 0zm0 6a1 1 0 11-2 0 1 1 0 012 0zm6-6a1 1 0 11-2 0 1 1 0 012 0zm0 6a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <span className="font-semibold">Admin Mode Active - Website is hidden from public</span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="max-w-2xl w-full">
          {/* Animated Logo/Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m6 2a6 6 0 11-12 0 6 6 0 0112 0zm0 0h.01M15.3 15.3A9 9 0 1 0 3 12a9 9 0 0 0 12.3 3.3z" />
              </svg>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
              MPT IS EVOLVING
            </h1>
            <p className="text-lg md:text-xl text-purple-300 font-semibold">
              Mobile Migration In Progress
            </p>
          </div>

          {/* Description Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Apa yang sedang terjadi?</h2>
            
            <p className="text-white/90 leading-relaxed mb-6">
              Kami sedang memindahkan seluruh ekosistem <span className="font-semibold text-blue-300">MPT</span> ke aplikasi <span className="font-semibold text-blue-300">mobile</span> untuk memberikan pengalaman yang lebih stabil, cepat, dan responsif.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/30 text-blue-300">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/80">Platform web akan tersedia kembali setelah migrasi selesai</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/30 text-blue-300">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/80">Semua data user akan aman dan dapat diakses melalui aplikasi mobile</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/30 text-blue-300">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/80">Fitur-fitur baru dan peningkatan performa menanti Anda</p>
              </div>
            </div>
          </div>

          {/* Installation Guide Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              Bersiaplah untuk Upgrade
            </h2>

            <p className="text-white/80 mb-5">
              Download aplikasi mobile MPT untuk pengalaman yang optimal:
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/download"
                className="flex-1 inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
                Download App
              </a>

              <a
                href="/download#guide"
                className="flex-1 inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Panduan Instalasi
              </a>
            </div>
          </div>

          {/* Timeline/Status Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Status Migrasi
            </h2>

            <div className="space-y-4">
              {[
                { label: 'Infrastructure Setup', status: 'complete' },
                { label: 'Mobile App Development', status: 'complete' },
                { label: 'Data Migration', status: 'in-progress' },
                { label: 'Testing & QA', status: 'pending' },
                { label: 'Public Launch', status: 'pending' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.status === 'complete' && (
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500/30 text-green-400">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                  {item.status === 'in-progress' && (
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-yellow-500/30 text-yellow-400 animate-spin">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      </div>
                    </div>
                  )}
                  {item.status === 'pending' && (
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-500/30 text-gray-400">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <p className="text-white/80">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-white/60 text-sm">
            <p>Terima kasih atas kesabaran Anda. Kami bekerja keras untuk memberikan pengalaman terbaik!</p>
            <p className="mt-2">Pertanyaan? Hubungi tim support kami di support@mpt.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
