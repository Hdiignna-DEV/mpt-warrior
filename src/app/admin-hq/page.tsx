'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  Key, 
  Activity, 
  Clock,
  Ban,
  Plus,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  telegram_id?: string;
  status: string;
  role: string;
  invitation_code: string;
  createdAt: string;
  join_date: string;
}

interface InvitationCode {
  code: string;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  description?: string;
}

export default function AdminHQPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(true, true); // Require auth + admin
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [invitationCodes, setInvitationCodes] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'codes'>('pending');

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('mpt_user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'ADMIN') {
      router.push('/access-denied');
      return;
    }

    setCurrentUser(user);
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('mpt_token');
      
      // Load pending users
      const pendingRes = await fetch('/api/admin/pending-users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const pendingData = await pendingRes.json();
      setPendingUsers(pendingData.users || []);

      // Load active users
      const activeRes = await fetch('/api/admin/active-users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const activeData = await activeRes.json();
      setActiveUsers(activeData.users || []);

      // Load invitation codes
      const codesRes = await fetch('/api/admin/invitation-codes', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const codesData = await codesRes.json();
      setInvitationCodes(codesData.codes || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    if (!confirm('Approve user ini?')) return;

    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch('/api/admin/approve-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert('✅ User berhasil di-approve!');
        loadData();
      } else {
        alert('❌ Gagal approve user');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      alert('❌ Terjadi kesalahan');
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm('Reject user ini? Aksi ini tidak bisa dibatalkan!')) return;

    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch('/api/admin/reject-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert('✅ User berhasil di-reject!');
        loadData();
      } else {
        alert('❌ Gagal reject user');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('❌ Terjadi kesalahan');
    }
  };

  const handleSuspend = async (userId: string) => {
    if (!confirm('Suspend user ini?')) return;

    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch('/api/admin/suspend-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert('✅ User berhasil di-suspend!');
        loadData();
      } else {
        alert('❌ Gagal suspend user');
      }
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('❌ Terjadi kesalahan');
    }
  };

  const handleGenerateCode = async () => {
    const code = prompt('Masukkan kode invitation (contoh: MPT-2026-FOXTROT):');
    if (!code) return;

    const roleChoice = confirm('Kode ini untuk ADMIN?\n\nOK = ADMIN\nCancel = WARRIOR (member biasa)');
    const role = roleChoice ? 'ADMIN' : 'WARRIOR';

    const description = prompt('Deskripsi (opsional):') || '';

    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch('/api/admin/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code, description, role }),
      });

      if (response.ok) {
        alert('✅ Kode invitation berhasil dibuat!');
        loadData();
      } else {
        const data = await response.json();
        alert(`❌ ${data.error || 'Gagal membuat kode'}`);
      }
    } catch (error) {
      console.error('Error generating code:', error);
      alert('❌ Terjadi kesalahan');
    }
  };

  const handleDeleteCode = async (code: string) => {
    if (!confirm(`Hapus kode ${code}? Aksi ini tidak bisa dibatalkan!`)) return;

    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch('/api/admin/delete-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        alert('✅ Kode berhasil dihapus!');
        loadData();
      } else {
        const data = await response.json();
        alert(`❌ ${data.error || 'Gagal menghapus kode'}`);
      }
    } catch (error) {
      console.error('Error deleting code:', error);
      alert('❌ Terjadi kesalahan');
    }
  };

  const handleEditCode = async (codeItem: InvitationCode) => {
    const newMaxUses = prompt(`Berapa user yang bisa pakai code ${codeItem.code}?`, String(codeItem.max_uses));
    if (!newMaxUses) return;

    const maxUses = parseInt(newMaxUses);
    if (isNaN(maxUses) || maxUses < 1) {
      alert('❌ Jumlah user harus angka minimal 1');
      return;
    }

    const newDescription = prompt('Deskripsi baru (opsional):', codeItem.description || '');
    const toggleActive = confirm(`Code saat ini ${codeItem.is_active ? 'AKTIF' : 'NONAKTIF'}.\n\nOK = Ubah status\nCancel = Biarkan ${codeItem.is_active ? 'aktif' : 'nonaktif'}`);
    const isActive = toggleActive ? !codeItem.is_active : codeItem.is_active;

    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch('/api/admin/edit-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: codeItem.code,
          max_uses: maxUses,
          description: newDescription || codeItem.description,
          is_active: isActive,
        }),
      });

      if (response.ok) {
        alert('✅ Code berhasil diupdate!');
        loadData();
      } else {
        const data = await response.json();
        alert(`❌ ${data.error || 'Gagal update code'}`);
      }
    } catch (error) {
      console.error('Error editing code:', error);
      alert('❌ Terjadi kesalahan');
    }
  };

  const handleCopyTemplate = (code: string) => {
    const template = `🎖️ Selamat! Kamu diundang bergabung ke MPT Warrior Community!

Kode Invitation: ${code}
Daftar di: https://mpt-community.vercel.app/register

MPT Warrior adalah platform eksklusif untuk trader yang ingin:
✅ Trading Journal dengan AI Analysis
✅ Dashboard tracking performa real-time
✅ Economic Calendar terintegrasi
✅ Komunitas trader profesional

Gunakan kode di atas untuk registrasi. See you on the battlefield! 🔥`;

    navigator.clipboard.writeText(template).then(() => {
      alert('✅ Template berhasil dicopy ke clipboard!\n\nTinggal paste dan kirim ke calon warrior! 🚀');
    }).catch((err) => {
      console.error('Failed to copy:', err);
      alert('❌ Gagal copy template');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin text-5xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <div className="p-4 bg-red-500/20 rounded-2xl">
              <Shield className="text-red-400" size={48} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-red-400">ADMIN HQ</h1>
              <p className="text-slate-300 text-sm md:text-base">Commander Control Panel</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={loadData}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <div className="text-left md:text-right text-sm text-slate-400">
                <p className="font-bold text-white truncate">{currentUser?.name}</p>
                <p className="truncate">{currentUser?.email}</p>
              </div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-red-500 via-amber-500 to-transparent rounded-full"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-premium rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-yellow-400" size={24} />
              <span className="text-slate-400 text-sm font-bold">PENDING</span>
            </div>
            <p className="text-4xl font-black text-yellow-400">{pendingUsers.length}</p>
          </div>

          <div className="glass-premium rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-green-400" size={24} />
              <span className="text-slate-400 text-sm font-bold">ACTIVE</span>
            </div>
            <p className="text-4xl font-black text-green-400">{activeUsers.length}</p>
          </div>

          <div className="glass-premium rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Key className="text-blue-400" size={24} />
              <span className="text-slate-400 text-sm font-bold">CODES</span>
            </div>
            <p className="text-4xl font-black text-blue-400">{invitationCodes.length}</p>
          </div>

          <div className="glass-premium rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-amber-400" size={24} />
              <span className="text-slate-400 text-sm font-bold">TOTAL</span>
            </div>
            <p className="text-4xl font-black text-amber-400">{pendingUsers.length + activeUsers.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 md:px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === 'pending'
                ? 'bg-yellow-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Pending ({pendingUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 md:px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === 'active'
                ? 'bg-green-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Active ({activeUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('codes')}
            className={`px-4 md:px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === 'codes'
                ? 'bg-blue-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Codes ({invitationCodes.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingUsers.length === 0 ? (
              <div className="glass-premium rounded-2xl p-12 text-center">
                <p className="text-slate-400">Tidak ada pending users</p>
              </div>
            ) : (
              pendingUsers.map((user) => (
                <div key={user.id} className="glass-premium rounded-2xl p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-black text-white mb-2">{user.name}</h3>
                      <div className="space-y-1 text-xs md:text-sm text-slate-400">
                        <p className="truncate">📧 {user.email}</p>
                        {user.whatsapp && <p>📱 WA: {user.whatsapp}</p>}
                        {user.telegram_id && <p>✈️ TG: {user.telegram_id}</p>}
                        <p>🔑 Code: <span className="text-amber-400 font-mono">{user.invitation_code}</span></p>
                        <p>📅 Registered: {new Date(user.createdAt).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <CheckCircle size={18} /> APPROVE
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                      >
                        <XCircle size={18} /> REJECT
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeUsers.map((user) => (
              <div key={user.id} className="glass-premium rounded-2xl p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-black text-white mb-2">{user.name}</h3>
                    <div className="space-y-1 text-xs md:text-sm text-slate-400">
                      <p className="truncate">📧 {user.email}</p>
                      {user.whatsapp && <p>📱 WA: {user.whatsapp}</p>}
                      {user.telegram_id && <p>✈️ TG: {user.telegram_id}</p>}
                      <p>📅 Joined: {new Date(user.join_date).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap items-center">
                    <div className="px-3 md:px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
                      <span className="text-green-400 font-bold text-xs md:text-sm">ACTIVE</span>
                    </div>
                    <button
                      onClick={() => handleSuspend(user.id)}
                      className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <Ban size={18} /> SUSPEND
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'codes' && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <button 
                onClick={handleGenerateCode}
                className="px-4 md:px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 text-sm md:text-base transition-colors"
              >
                <Plus size={20} /> Generate New Code
              </button>
            </div>

            {invitationCodes.map((code) => (
              <div key={code.code} className="glass-premium rounded-2xl p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-black text-amber-400 font-mono mb-2 break-all">{code.code}</h3>
                    <div className="space-y-1 text-xs md:text-sm text-slate-400">
                      <p>📊 Usage: {code.used_count} / {code.max_uses}</p>
                      <p>📅 Expires: {new Date(code.expires_at).toLocaleDateString('id-ID')}</p>
                      <p>🎖️ Role: <span className={`font-bold ${(code as any).role === 'ADMIN' ? 'text-red-400' : 'text-blue-400'}`}>{(code as any).role || 'WARRIOR'}</span></p>
                      {code.description && <p>📝 {code.description}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap items-start">
                    {code.is_active ? (
                      <div className="px-3 md:px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
                        <span className="text-green-400 font-bold text-xs md:text-sm">ACTIVE</span>
                      </div>
                    ) : (
                      <div className="px-3 md:px-4 py-2 bg-red-500/20 rounded-xl border border-red-500/30">
                        <span className="text-red-400 font-bold text-xs md:text-sm">INACTIVE</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleCopyTemplate(code.code)}
                      className="px-3 md:px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center gap-2 transition-colors text-xs md:text-sm"
                    >
                      📋 COPY
                    </button>
                    <button
                      onClick={() => handleEditCode(code)}
                      className="px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 transition-colors text-xs md:text-sm"
                    >
                      ✏️ EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteCode(code.code)}
                      className="px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center gap-2 transition-colors text-xs md:text-sm"
                    >
                      <XCircle size={16} /> DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
