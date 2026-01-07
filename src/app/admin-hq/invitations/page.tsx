/**
 * Admin HQ - Invitation Control Panel
 * Generate and manage invitation codes (ADMIN/SUPER_ADMIN)
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Ticket,
  Plus,
  Download,
  Copy,
  CheckCircle,
  XCircle,
  Calendar,
  Users as UsersIcon
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { showToast } from '@/utils/toast';

interface InvitationCode {
  id: string;
  code: string;
  createdBy?: string;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  role: 'ADMIN' | 'WARRIOR';
  createdAt: string;
  description?: string;
}

export default function InvitationControlPage() {
  const router = useRouter();
  const { loading } = useAuth();
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Generation form
  const [bulkCount, setBulkCount] = useState(1);
  const [targetRole, setTargetRole] = useState<'WARRIOR' | 'ADMIN'>('WARRIOR');
  const [maxUses, setMaxUses] = useState(1);
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    try {
      const token = localStorage.getItem('mpt_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/admin/invitations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCodes(data.codes);
      } else if (response.status === 403) {
        showToast('Access denied', 'error');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error loading codes:', error);
      showToast('Error loading invitation codes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCodes = async () => {
    try {
      setIsGenerating(true);
      const token = localStorage.getItem('mpt_token');

      const response = await fetch('/api/admin/invitations/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          count: bulkCount,
          role: targetRole,
          maxUses,
          description: description || undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        showToast(`Generated ${data.codes.length} invitation codes`, 'success');
        loadCodes();
        
        // Reset form
        setBulkCount(1);
        setDescription('');
      } else {
        showToast('Failed to generate codes', 'error');
      }
    } catch (error) {
      console.error('Error generating codes:', error);
      showToast('Error generating codes', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast('Code copied!', 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Code', 'Role', 'Max Uses', 'Used', 'Status', 'Created', 'Description'].join(','),
      ...codes.map(code => [
        code.code,
        code.role,
        code.maxUses,
        code.usedCount,
        code.isActive ? 'Active' : 'Inactive',
        new Date(code.createdAt).toLocaleDateString('id-ID'),
        code.description || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invitation-codes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleCodeStatus = async (codeId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('mpt_token');
      
      const response = await fetch(`/api/admin/invitations/${codeId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      });

      if (response.ok) {
        showToast(`Code ${!currentStatus ? 'activated' : 'deactivated'}`, 'success');
        loadCodes();
      } else {
        showToast('Failed to update code status', 'error');
      }
    } catch (error) {
      console.error('Error toggling code:', error);
      showToast('Error updating code', 'error');
    }
  };

  const activeCodesCount = codes.filter(c => c.isActive).length;
  const totalUses = codes.reduce((sum, c) => sum + c.usedCount, 0);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">
              Invitation Control
            </h1>
            <p className="text-gray-400 mt-1">
              Generate and manage invitation codes
            </p>
          </div>

          <button
            onClick={exportToCSV}
            disabled={codes.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 border-blue-700/30 p-6">
            <div className="flex items-center gap-3">
              <Ticket className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total Codes</p>
                <p className="text-3xl font-black text-blue-400">{codes.length}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-950/20 border-emerald-700/30 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-sm text-gray-400">Active Codes</p>
                <p className="text-3xl font-black text-emerald-400">{activeCodesCount}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border-purple-700/30 p-6">
            <div className="flex items-center gap-3">
              <UsersIcon className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Total Uses</p>
                <p className="text-3xl font-black text-purple-400">{totalUses}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Generation Form */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Plus className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-bold text-white">Generate New Codes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Bulk Count */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={bulkCount}
                onChange={(e) => setBulkCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as 'WARRIOR' | 'ADMIN')}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
              >
                <option value="WARRIOR">Warrior</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Max Uses */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Max Uses
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                value={maxUses}
                onChange={(e) => setMaxUses(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={generateCodes}
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Batch for January 2026"
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </Card>

        {/* Codes List */}
        <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Code</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Role</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Usage</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Created</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Description</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => (
                  <tr 
                    key={code.id}
                    className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors"
                  >
                    {/* Code */}
                    <td className="p-4">
                      <code className="text-sm font-mono text-sky-400">
                        {code.code}
                      </code>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span className={`text-sm ${code.role === 'ADMIN' ? 'text-amber-400' : 'text-blue-400'}`}>
                        {code.role}
                      </span>
                    </td>

                    {/* Usage */}
                    <td className="p-4">
                      <span className="text-sm text-white">
                        {code.usedCount} / {code.maxUses}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {code.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="p-4">
                      <span className="text-sm text-gray-400">
                        {new Date(code.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="p-4">
                      <span className="text-sm text-gray-400">
                        {code.description || '-'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyCode(code.code)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Copy Code"
                        >
                          {copiedCode === code.code ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-sky-400" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleCodeStatus(code.id, code.isActive)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title={code.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {code.isActive ? (
                            <XCircle className="w-4 h-4 text-red-400" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {codes.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No invitation codes generated yet</p>
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}
