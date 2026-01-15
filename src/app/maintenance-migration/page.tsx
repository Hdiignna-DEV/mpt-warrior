'use client';

import { useEffect, useState } from 'react';
import { Shield, Download, Smartphone, Zap, Lock, AlertCircle, Check, Clock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import MptLogo from '@/components/MptLogo';

interface MigrationStatus {
  databaseMigration: boolean;
  mobileAppBuild: boolean;
  finalTesting: boolean;
  webRestoration: boolean;
  estimatedCompletion?: string;
}

interface AdminStats {
  activeAdmins: number;
  usersBlocked: number;
  apiHealth: 'healthy' | 'warning' | 'error';
  lastChecked: string;
}

export default function MaintenanceMigrationPage() {
  const { user, loading } = useAuth(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    databaseMigration: true,
    mobileAppBuild: true,
    finalTesting: true,
    webRestoration: false,
  });
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const adminCheck = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
      setIsAdmin(adminCheck);
      
      if (adminCheck) {
        // Load admin stats jika tersedia
        loadAdminStats();
      }
    }
  }, [user, loading]);

  const loadAdminStats = async () => {
    try {
      // Simulasi load stats - ganti dengan API call real
      setAdminStats({
        activeAdmins: 2,
        usersBlocked: 0,
        apiHealth: 'healthy',
        lastChecked: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error('[AdminStats] Load failed:', error);
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-400' : 'bg-slate-500';
  };

  const getStatusText = (status: boolean) => {
    return status ? 'Completed' : 'Pending';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Admin Banner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-b border-green-500/30 px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-green-400 flex-shrink-0" />
                <div>
                  <span className="text-green-300 font-semibold block">Admin Mode Active</span>
                  <span className="text-green-400/70 text-sm">Website is hidden from public during migration</span>
                </div>
              </div>
              <button
                onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300 text-sm font-semibold rounded transition-colors"
              >
                {showAdminDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full space-y-8 text-center">
          {/* Logo */}
          <div className="flex justify-center">
            <MptLogo size={64} className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-amber-400">
              MPT IS EVOLVING
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-300">
              MOBILE MIGRATION IN PROGRESS
            </h2>
          </div>

          {/* Description */}
          <div className="space-y-4 text-slate-300">
            <p className="text-lg">
              Kami sedang memindahkan seluruh ekosistem <span className="text-amber-400 font-bold">MPT Trading HUB</span> ke aplikasi mobile native untuk pengalaman yang lebih stabil, cepat, dan responsif.
            </p>
            <p className="text-sm sm:text-base">
              Platform web akan kembali segera setelah proses migrasi selesai. Sementara itu, semua fitur tersedia di aplikasi mobile kami yang baru.
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-slate-800/50 border border-amber-500/20 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Zap size={20} className="text-amber-400" />
              <h3 className="text-xl font-bold text-amber-300">Migration Status</h3>
            </div>
            <div className="space-y-3 text-left text-sm">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(migrationStatus.databaseMigration)}`} />
                <span className="text-slate-300 flex-1">Database Migration</span>
                <span className={`font-semibold ${migrationStatus.databaseMigration ? 'text-green-400' : 'text-slate-400'}`}>
                  {getStatusText(migrationStatus.databaseMigration)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(migrationStatus.mobileAppBuild)}`} />
                <span className="text-slate-300 flex-1">Mobile App Build</span>
                <span className={`font-semibold ${migrationStatus.mobileAppBuild ? 'text-green-400' : 'text-slate-400'}`}>
                  {getStatusText(migrationStatus.mobileAppBuild)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${getStatusColor(migrationStatus.finalTesting)}`} />
                <span className="text-slate-300 flex-1">Final Testing & QA</span>
                <span className={`font-semibold ${migrationStatus.finalTesting ? 'text-amber-400' : 'text-slate-400'}`}>
                  {migrationStatus.finalTesting ? 'In Progress' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(migrationStatus.webRestoration)}`} />
                <span className="text-slate-300 flex-1">Web Restoration</span>
                <span className={`font-semibold ${migrationStatus.webRestoration ? 'text-green-400' : 'text-slate-400'}`}>
                  {getStatusText(migrationStatus.webRestoration)}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Dashboard */}
          {isAdmin && showAdminDashboard && adminStats && (
            <div className="bg-slate-800/70 border border-green-500/30 rounded-lg p-6 space-y-6 mt-6">
              <div className="flex items-center gap-2 pb-4 border-b border-green-500/20">
                <Activity size={20} className="text-green-400" />
                <h3 className="text-lg font-bold text-green-300">Admin Monitoring Dashboard</h3>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 border border-green-500/20 rounded p-4">
                  <div className="text-green-400/70 text-xs font-semibold mb-2">Active Admins</div>
                  <div className="text-2xl font-bold text-green-300">{adminStats.activeAdmins}</div>
                </div>
                <div className="bg-slate-900/50 border border-amber-500/20 rounded p-4">
                  <div className="text-amber-400/70 text-xs font-semibold mb-2">Users Blocked</div>
                  <div className="text-2xl font-bold text-amber-300">{adminStats.usersBlocked}</div>
                </div>
                <div className="bg-slate-900/50 border border-green-500/20 rounded p-4 col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-400/70 text-xs font-semibold mb-2">API Health</div>
                      <div className="flex items-center gap-2">
                        <Check size={18} className="text-green-400" />
                        <span className="text-green-300 font-semibold capitalize">{adminStats.apiHealth}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-xs">Last Checked</div>
                      <div className="text-slate-300 font-mono text-sm">{adminStats.lastChecked}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-green-500/20 pt-4">
                <div className="text-green-400/70 text-xs font-semibold mb-3">Quick Actions</div>
                <div className="flex flex-col gap-2">
                  <a href="/admin-hq" className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300 text-sm font-semibold rounded transition-colors text-center">
                    Go to Admin Dashboard
                  </a>
                  <button
                    onClick={loadAdminStats}
                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-sm font-semibold rounded transition-colors"
                  >
                    Refresh Stats
                  </button>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-amber-900/20 border border-amber-500/30 rounded p-4 flex gap-3">
                <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="text-amber-300 font-semibold mb-1">Maintenance Mode Active</div>
                  <p className="text-amber-200/80">
                    Regular users cannot access the platform. Only Admin and Super Admin accounts have full access during migration.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Download Aplikasi Mobile Kami
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/get-app" target="_blank" rel="noopener noreferrer">
                <Button className="w-full sm:w-auto bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold flex items-center justify-center gap-2">
                  <Smartphone size={20} />
                  <span>Download App</span>
                </Button>
              </a>
              <a href="/downloads/HOW_TO_GET_APP.txt" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto border-amber-500/30 text-amber-400 hover:bg-amber-500/10 flex items-center justify-center gap-2">
                  <Download size={20} />
                  <span>Installation Guide</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Why Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 space-y-2">
              <Zap size={24} className="text-amber-400 mx-auto" />
              <h4 className="font-bold text-amber-300">Lebih Cepat</h4>
              <p className="text-xs text-slate-400">Performa native app jauh lebih optimal</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 space-y-2">
              <Smartphone size={24} className="text-amber-400 mx-auto" />
              <h4 className="font-bold text-amber-300">Mobile First</h4>
              <p className="text-xs text-slate-400">Dioptimalkan khusus untuk perangkat mobile</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 space-y-2">
              <Lock size={24} className="text-amber-400 mx-auto" />
              <h4 className="font-bold text-amber-300">Lebih Aman</h4>
              <p className="text-xs text-slate-400">Enkripsi dan keamanan tingkat enterprise</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 px-4 py-6 text-center">
        <p className="text-sm text-slate-500">
          MPT Trading HUB © 2026 | Maintenance Mode
        </p>
        <p className="text-xs text-slate-600 mt-2">
          Pertanyaan? Hubungi support@mpt-trading.com
        </p>
      </div>
    </div>
  );
}

