/**
 * Profile Edit Page
 * Allow users to update their warrior profile
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { 
  Save,
  Upload,
  User as UserIcon,
  Target,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { showToast } from '@/utils/toast';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState('');
  const [personalGoal, setPersonalGoal] = useState('');
  const [tradingStrategy, setTradingStrategy] = useState<'SCALPING' | 'DAY_TRADING' | 'SWING_TRADING' | 'POSITION_TRADING'>('DAY_TRADING');
  const [preferredTimeframe, setPreferredTimeframe] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.name);
      setPersonalGoal(user.profileSettings?.personalGoal || '');
      setTradingStrategy(user.profileSettings?.tradingStrategy || 'DAY_TRADING');
      setPreferredTimeframe(user.profileSettings?.preferredTimeframe || '');
      setBio(user.profileSettings?.bio || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be less than 5MB', 'error');
      return;
    }

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('mpt_token');

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          displayName,
          avatar,
          profileSettings: {
            personalGoal,
            tradingStrategy,
            preferredTimeframe,
            bio
          }
        })
      });

      if (response.ok) {
        showToast('Profile updated successfully', 'success');
        await refreshUser();
        router.push('/profile');
      } else {
        showToast('Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Error saving profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/profile')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">
              Edit Profile
            </h1>
            <p className="text-gray-400 mt-1">
              Update your warrior profile and settings
            </p>
          </div>
        </div>

        {/* Avatar Upload */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <UserIcon className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-bold text-white">Profile Photo</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Current Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex-1">
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-sky-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 mb-1">Click to upload new photo</p>
                  <p className="text-xs text-gray-500">JPG, PNG or GIF (max 5MB)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </Card>

        {/* Basic Info */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>

          <div className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Trading Preferences */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Trading Preferences</h2>
          </div>

          <div className="space-y-4">
            {/* Trading Strategy */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Trading Strategy
              </label>
              <select
                value={tradingStrategy}
                onChange={(e) => setTradingStrategy(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors"
              >
                <option value="SCALPING">Scalping</option>
                <option value="DAY_TRADING">Day Trading</option>
                <option value="SWING_TRADING">Swing Trading</option>
                <option value="POSITION_TRADING">Position Trading</option>
              </select>
            </div>

            {/* Preferred Timeframe */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Preferred Timeframe
              </label>
              <input
                type="text"
                value={preferredTimeframe}
                onChange={(e) => setPreferredTimeframe(e.target.value)}
                placeholder="e.g., 1H, 4H, 1D"
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>
        </Card>

        {/* Personal Goal */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Personal Trading Goal</h2>
          </div>

          <textarea
            value={personalGoal}
            onChange={(e) => setPersonalGoal(e.target.value)}
            placeholder="What's your trading goal? Keep yourself motivated..."
            rows={4}
            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors resize-none"
          />
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push('/profile')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={saveProfile}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  );
}
