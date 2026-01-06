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
  RefreshCw,
  Download
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

interface AuditLog {
  id: string;
  action: string;
  performed_by: string;
  target_user?: string;
  timestamp: string;
  metadata?: any;
}

export default function AdminHQPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(true, true); // Require auth + admin
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [invitationCodes, setInvitationCodes] = useState<InvitationCode[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'codes' | 'audit'>('pending');
  
  // Search states
  const [searchPending, setSearchPending] = useState('');
  const [searchActive, setSearchActive] = useState('');
  const [searchCodes, setSearchCodes] = useState('');

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('mpt_user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
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

      // Load audit logs
      const auditRes = await fetch('/api/admin/audit-logs?limit=50', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const auditData = await auditRes.json();
      setAuditLogs(auditData.logs || []);

      // Load statistics
      const statsRes = await fetch('/api/admin/statistics', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const statsData = await statsRes.json();
      setStatistics(statsData.statistics || null);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter functions
  const filteredPendingUsers = pendingUsers.filter(user => 
    user.name.toLowerCase().includes(searchPending.toLowerCase()) ||
    user.email.toLowerCase().includes(searchPending.toLowerCase()) ||
    user.invitation_code.toLowerCase().includes(searchPending.toLowerCase())
  );

  const filteredActiveUsers = activeUsers.filter(user =>
    user.name.toLowerCase().includes(searchActive.toLowerCase()) ||
    user.email.toLowerCase().includes(searchActive.toLowerCase()) ||
    user.role.toLowerCase().includes(searchActive.toLowerCase())
  );

  const filteredCodes = invitationCodes.filter(code =>
    code.code.toLowerCase().includes(searchCodes.toLowerCase()) ||
    (code.description && code.description.toLowerCase().includes(searchCodes.toLowerCase()))
  );

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
        const data = await response.json();
        
        // Show email status to admin
        if (data.emailStatus === 'sent') {
          alert('✅ User berhasil di-approve!\n📧 Email notifikasi terkirim.');
        } else if (data.emailStatus === 'failed') {
          const errorMsg = data.emailError || '';
          
          // Check if it's Resend domain verification issue
          if (errorMsg.includes('verify a domain') || errorMsg.includes('testing emails')) {
            alert(
              '✅ User berhasil di-approve!\n\n' +
              '⚠️ Email Limitation (Resend Free Tier):\n' +
              '- Hanya bisa kirim ke email: dedenhadigun@gmail.com\n' +
              '- Untuk kirim ke semua user, verify domain di resend.com/domains\n\n' +
              '💡 Untuk sekarang:\n' +
              'Informasikan user via WhatsApp bahwa akun sudah approved.'
            );
          } else {
            alert(`✅ User berhasil di-approve!\n⚠️ Email gagal terkirim: ${errorMsg}\n\nSilakan informasikan user secara manual.`);
          }
        } else {
          alert('✅ User berhasil di-approve!\n⚠️ Email tidak terkirim (RESEND_API_KEY belum disetup)');
        }
        
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

  const handlePromoteToAdmin = async (email: string, userName: string) => {
    if (!confirm(`Promote ${userName} (${email}) menjadi ADMIN?\n\n⚠️ ADMIN akan memiliki akses ke Admin HQ!`)) return;

    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch('/api/admin/promote-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${userName} berhasil dipromote menjadi ${data.targetRole}!`);
        loadData();
      } else {
        const data = await response.json();
        alert(`❌ ${data.error || 'Gagal promote user'}`);
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('❌ Terjadi kesalahan');
    }
  };

  // Export to CSV functions
  const downloadCSV = (data: string, filename: string) => {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPendingUsersCSV = () => {
    const headers = ['Name', 'Email', 'WhatsApp', 'Telegram', 'Invitation Code', 'Role', 'Registered Date'];
    const rows = filteredPendingUsers.map(user => [
      user.name,
      user.email,
      user.whatsapp || '-',
      user.telegram_id || '-',
      user.invitation_code,
      user.role,
      new Date(user.createdAt).toLocaleDateString('id-ID')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    downloadCSV(csvContent, `pending-users-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportActiveUsersCSV = () => {
    const headers = ['Name', 'Email', 'WhatsApp', 'Telegram', 'Role', 'Status', 'Join Date'];
    const rows = filteredActiveUsers.map(user => [
      user.name,
      user.email,
      user.whatsapp || '-',
      user.telegram_id || '-',
      user.role,
      user.status,
      new Date(user.join_date).toLocaleDateString('id-ID')
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    downloadCSV(csvContent, `active-users-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportCodesCSV = () => {
    const headers = ['Code', 'Role', 'Usage', 'Max Uses', 'Status', 'Created Date', 'Expires Date', 'Description'];
    const rows = filteredCodes.map(code => [
      code.code,
      (code as any).role || 'WARRIOR',
      code.used_count.toString(),
      code.max_uses.toString(),
      code.is_active ? 'Active' : 'Inactive',
      new Date(code.created_at).toLocaleDateString('id-ID'),
      new Date(code.expires_at).toLocaleDateString('id-ID'),
      code.description || '-'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    downloadCSV(csvContent, `invitation-codes-${new Date().toISOString().split('T')[0]}.csv`);
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

  const handleBulkGenerate = async () => {
    const maxAllowed = currentUser?.role === 'SUPER_ADMIN' ? 100 : 50;
    const quantity = prompt(`Berapa kode yang ingin dibuat? (max ${maxAllowed}):`);
    if (!quantity) return;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1 || qty > maxAllowed) {
      alert(`❌ Jumlah harus antara 1-${maxAllowed}`);
      return;
    }

    const prefix = prompt('Prefix kode (contoh: MPT-2026-BATCH):');
    if (!prefix || prefix.length < 3) {
      alert('❌ Prefix minimal 3 karakter');
      return;
    }

    const roleChoice = confirm('Kode-kode ini untuk ADMIN?\n\nOK = ADMIN\nCancel = WARRIOR (member biasa)');
    const role = roleChoice ? 'ADMIN' : 'WARRIOR';

    const description = prompt('Deskripsi batch (opsional):') || 'Bulk generated';

    const maxUsesInput = prompt('Berapa user per code? (default: 1):', '1');
    const maxUsesPerCode = parseInt(maxUsesInput || '1');

    if (isNaN(maxUsesPerCode) || maxUsesPerCode < 1) {
      alert('❌ Max uses harus minimal 1');
      return;
    }

    if (!confirm(`Generate ${qty} codes dengan prefix "${prefix}"?\n\nRole: ${role}\nMax uses per code: ${maxUsesPerCode}`)) {
      return;
    }

    try {
      const token = localStorage.getItem('mpt_token');
      const response = await fetch('/api/admin/bulk-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: qty,
          prefix,
          role,
          description,
          maxUsesPerCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Berhasil generate ${data.quantity} kode invitation!`);
        loadData();
      } else {
        const data = await response.json();
        alert(`❌ ${data.error || 'Gagal generate codes'}`);
      }
    } catch (error) {
      console.error('Error bulk generating:', error);
      alert('❌ Terjadi kesalahan');
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-premium rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-yellow-400" size={24} />
              <span className="text-slate-400 text-sm font-bold">PENDING</span>
            </div>
            <p className="text-4xl font-black text-yellow-400">{statistics?.users?.pending || pendingUsers.length}</p>
            <p className="text-xs text-slate-500 mt-1">Waiting approval</p>
          </div>

          <div className="glass-premium rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-green-400" size={24} />
              <span className="text-slate-400 text-sm font-bold">ACTIVE</span>
            </div>
            <p className="text-4xl font-black text-green-400">{statistics?.users?.active || activeUsers.length}</p>
            <p className="text-xs text-slate-500 mt-1">
              {statistics?.users?.breakdown?.warriors || 0} Warriors · {statistics?.users?.breakdown?.admins || 0} Admins
            </p>
          </div>

          <div className="glass-premium rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Key className="text-blue-400" size={24} />
              <span className="text-slate-400 text-sm font-bold">CODES</span>
            </div>
            <p className="text-4xl font-black text-blue-400">{statistics?.codes?.active || invitationCodes.filter(c => c.is_active).length}</p>
            <p className="text-xs text-slate-500 mt-1">
              {statistics?.codes?.usage?.usageRate || 0}% usage rate
            </p>
          </div>

          <div className="glass-premium rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-amber-400" size={24} />
              <span className="text-slate-400 text-sm font-bold">GROWTH</span>
            </div>
            <p className="text-4xl font-black text-amber-400">+{statistics?.users?.growth?.last7Days || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Last 7 days</p>
          </div>
        </div>

        {/* Quick Actions - SUPER_ADMIN Only */}
        {currentUser?.role === 'SUPER_ADMIN' && (
          <div className="mb-8 glass-premium rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              Quick Actions (SUPER_ADMIN)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/admin-hq/quiz-grading')}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all group"
              >
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-all">
                  📝
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">Quiz Grading</p>
                  <p className="text-sm text-gray-400">Review & grade student essays</p>
                </div>
              </button>
              
              <button
                onClick={() => alert('Coming soon: More admin features')}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl hover:from-blue-500/30 hover:to-cyan-500/30 transition-all group opacity-50 cursor-not-allowed"
              >
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-all">
                  🔧
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">System Settings</p>
                  <p className="text-sm text-gray-400">Coming soon</p>
                </div>
              </button>
            </div>
          </div>
        )}

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
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 md:px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === 'audit'
                ? 'bg-purple-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {/* Search Box and Export */}
            <div className="flex gap-2 flex-col sm:flex-row">
              <div className="glass-premium rounded-xl p-4 flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search by name, email, or invitation code..."
                  value={searchPending}
                  onChange={(e) => setSearchPending(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                onClick={exportPendingUsersCSV}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                disabled={filteredPendingUsers.length === 0}
              >
                <Download size={18} /> Export CSV
              </button>
            </div>

            {filteredPendingUsers.length === 0 ? (
              <div className="glass-premium rounded-2xl p-12 text-center">
                <p className="text-slate-400">
                  {searchPending ? 'No users found matching your search' : 'Tidak ada pending users'}
                </p>
              </div>
            ) : (
              filteredPendingUsers.map((user) => (
                <div key={user.id} className="glass-premium rounded-2xl p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-black text-white mb-2">{user.name}</h3>
                      <div className="space-y-1 text-xs md:text-sm text-slate-400">
                        <p className="truncate">📧 {user.email}</p>
                        {user.whatsapp && <p>📱 WA: {user.whatsapp}</p>}
                        {user.telegram_id && <p>✈️ TG: {user.telegram_id}</p>}
                        <p>🔑 Code: <span className="text-amber-400 font-mono">{user.invitation_code}</span></p>
                        <p>🎖️ Role: <span className={`font-bold ${user.role === 'ADMIN' ? 'text-red-400' : 'text-blue-400'}`}>{user.role}</span></p>
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
                      {currentUser?.role === 'SUPER_ADMIN' && user.role !== 'ADMIN' && (
                        <button
                          onClick={() => handlePromoteToAdmin(user.email, user.name)}
                          className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                          ⬆️ PROMOTE
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'active' && (
          <div className="space-y-4">
            {/* Search Box and Export */}
            <div className="flex gap-2 flex-col sm:flex-row">
              <div className="glass-premium rounded-xl p-4 flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search by name, email, or role..."
                  value={searchActive}
                  onChange={(e) => setSearchActive(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                onClick={exportActiveUsersCSV}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                disabled={filteredActiveUsers.length === 0}
              >
                <Download size={18} /> Export CSV
              </button>
            </div>

            {filteredActiveUsers.length === 0 ? (
              <div className="glass-premium rounded-2xl p-12 text-center">
                <p className="text-slate-400">
                  {searchActive ? 'No users found matching your search' : 'No active users'}
                </p>
              </div>
            ) : (
              filteredActiveUsers.map((user) => (
                <div key={user.id} className="glass-premium rounded-2xl p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-black text-white mb-2">{user.name}</h3>
                      <div className="space-y-1 text-xs md:text-sm text-slate-400">
                        <p className="truncate">📧 {user.email}</p>
                        {user.whatsapp && <p>📱 WA: {user.whatsapp}</p>}
                        {user.telegram_id && <p>✈️ TG: {user.telegram_id}</p>}
                        <p>🎖️ Role: <span className={`font-bold ${user.role === 'ADMIN' ? 'text-red-400' : user.role === 'SUPER_ADMIN' ? 'text-purple-400' : 'text-blue-400'}`}>{user.role}</span></p>
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
                      {currentUser?.role === 'SUPER_ADMIN' && user.role === 'WARRIOR' && (
                        <button
                          onClick={() => handlePromoteToAdmin(user.email, user.name)}
                          className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                          ⬆️ PROMOTE
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'codes' && (
          <div className="space-y-4">
            <div className="flex gap-2 justify-end mb-4 flex-wrap">
              <button 
                onClick={handleBulkGenerate}
                className="px-4 md:px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold flex items-center gap-2 text-sm md:text-base transition-colors"
              >
                <Plus size={20} /> Bulk Generate (1-{currentUser?.role === 'SUPER_ADMIN' ? '100' : '50'})
              </button>
              <button 
                onClick={handleGenerateCode}
                className="px-4 md:px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 text-sm md:text-base transition-colors"
              >
                <Plus size={20} /> Generate Single Code
              </button>
            </div>

            {/* Search Box and Export */}
            <div className="flex gap-2 flex-col sm:flex-row">
              <div className="glass-premium rounded-xl p-4 flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search by code or description..."
                  value={searchCodes}
                  onChange={(e) => setSearchCodes(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                onClick={exportCodesCSV}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                disabled={filteredCodes.length === 0}
              >
                <Download size={18} /> Export CSV
              </button>
            </div>

            {filteredCodes.length === 0 ? (
              <div className="glass-premium rounded-2xl p-12 text-center">
                <p className="text-slate-400">
                  {searchCodes ? 'No codes found matching your search' : 'No invitation codes'}
                </p>
              </div>
            ) : (
              filteredCodes.map((code) => (
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
                    {currentUser?.role === 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleDeleteCode(code.code)}
                        className="px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center gap-2 transition-colors text-xs md:text-sm"
                      >
                        <XCircle size={16} /> DELETE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4">
            {auditLogs.length === 0 ? (
              <div className="glass-premium rounded-2xl p-12 text-center">
                <p className="text-slate-400">Belum ada audit logs</p>
              </div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="glass-premium rounded-2xl p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-lg font-bold text-xs md:text-sm ${
                          log.action.includes('approve') ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          log.action.includes('reject') ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          log.action.includes('suspend') ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          log.action.includes('register') ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}>
                          {log.action.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs md:text-sm text-slate-400">
                        <p>👤 Performed by: <span className="text-white font-mono">{log.performed_by}</span></p>
                        {log.target_user && <p>🎯 Target: <span className="text-amber-400 font-mono">{log.target_user}</span></p>}
                        <p>🕐 {new Date(log.timestamp).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}</p>
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                              📋 View metadata
                            </summary>
                            <pre className="mt-2 p-2 bg-slate-950/50 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
