/**
 * Super Admin Settings Page
 * System-wide configuration (SUPER_ADMIN only)
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Settings,
  Save,
  Percent,
  Bell,
  FileText,
  Upload,
  Trash2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { showToast } from '@/utils/toast';

interface GlobalSettings {
  id: string;
  flatReferralDiscount: number;
  maxReferralsPerUser: number;
  systemAnnouncement: string | null;
  maintenanceMode: boolean;
  updatedAt: string;
}

export default function SuperAdminSettingsPage() {
  const router = useRouter();
  const { loading } = useAuth();
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [referralDiscount, setReferralDiscount] = useState(20);
  const [maxReferrals, setMaxReferrals] = useState(100);
  const [announcement, setAnnouncement] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('mpt_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        
        // Populate form
        setReferralDiscount(data.settings.flatReferralDiscount);
        setMaxReferrals(data.settings.maxReferralsPerUser);
        setAnnouncement(data.settings.systemAnnouncement || '');
        setMaintenanceMode(data.settings.maintenanceMode);
      } else if (response.status === 403) {
        showToast('Super Admin access required', 'error');
        router.push('/admin-hq');
      } else {
        showToast('Failed to load settings', 'error');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      showToast('Error loading settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('mpt_token');

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flatReferralDiscount: referralDiscount,
          maxReferralsPerUser: maxReferrals,
          systemAnnouncement: announcement || null,
          maintenanceMode
        })
      });

      if (response.ok) {
        showToast('Settings saved successfully', 'success');
        loadSettings();
      } else {
        showToast('Failed to save settings', 'error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Error saving settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
              System Settings
            </h1>
            <p className="text-gray-400 mt-1">
              Configure global system parameters (Super Admin Only)
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
            <Settings className="w-5 h-5" />
            <span className="font-semibold">SUPER ADMIN</span>
          </div>
        </div>

        {/* Referral Settings */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Percent className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-bold text-white">Referral Settings</h2>
          </div>

          <div className="space-y-4">
            {/* Flat Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Flat Referral Discount (%)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Discount applied when new users register with a LEGACY code
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={referralDiscount}
                  onChange={(e) => setReferralDiscount(parseInt(e.target.value) || 0)}
                  className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
                />
                <span className="text-2xl font-bold text-sky-400">{referralDiscount}%</span>
              </div>
            </div>

            {/* Max Referrals */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Max Referrals per User
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Maximum number of referral codes a Veteran can generate
              </p>
              <input
                type="number"
                min="1"
                max="1000"
                value={maxReferrals}
                onChange={(e) => setMaxReferrals(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </Card>

        {/* System Announcements */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white">System Announcement</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Announcement Message
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Displayed to all users on the dashboard (leave empty to hide)
            </p>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Enter system-wide announcement..."
              rows={4}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 resize-none"
            />
            
            {announcement && (
              <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-sm text-amber-300">
                  <strong>Preview:</strong> {announcement}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Maintenance Mode */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Maintenance Mode</h3>
              <p className="text-sm text-gray-400">
                Temporarily disable access for non-admin users
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {maintenanceMode && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-300">
                ⚠️ <strong>Warning:</strong> Only Super Admins can access the system while maintenance mode is active.
              </p>
            </div>
          )}
        </Card>

        {/* Content Management */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Content Manager</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-4">
                Upload Academy videos, PDFs, and course materials
              </p>
              
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-sky-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">MP4, PDF, or ZIP files (max 500MB)</p>
              </div>
            </div>

            {/* Placeholder for uploaded files list */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-400 mb-2">Recent Uploads</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-white">Module 1 - Introduction.mp4</p>
                      <p className="text-xs text-gray-500">125 MB • Uploaded 2 days ago</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold text-lg"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Last Updated */}
        {settings && (
          <p className="text-center text-sm text-gray-500">
            Last updated: {new Date(settings.updatedAt).toLocaleString('id-ID')}
          </p>
        )}

      </div>
    </div>
  );
}
