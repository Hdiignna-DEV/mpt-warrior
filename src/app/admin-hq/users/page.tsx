/**
 * Admin HQ - User Management Dashboard
 * View and manage all warriors in the system
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Search, 
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Shield,
  Swords,
  Crown,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { BadgeLevelDisplay } from '@/components/BadgeSystem';
import { UserRole, BadgeLevel } from '@/types';
import { toast } from '@/utils/toast';

interface UserListItem {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  warriorId: string;
  role: UserRole;
  status: 'active' | 'pending' | 'suspended';
  currentBadgeLevel: BadgeLevel;
  stats: {
    totalTrades: number;
    winRate: number;
  };
  disciplineScore: number;
  createdAt: string;
  lastLogin?: string;
}

export default function UserManagementPage() {
  const router = useRouter();
  const { loading } = useAuth();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [levelFilter, setLevelFilter] = useState<'ALL' | BadgeLevel>('ALL');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, roleFilter, levelFilter, users]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('mpt_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else if (response.status === 403) {
        toast.error('Access denied');
        router.push('/dashboard');
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error loading users');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.warriorId.toLowerCase().includes(query) ||
        user.displayName?.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Level filter
    if (levelFilter !== 'ALL') {
      filtered = filtered.filter(user => user.currentBadgeLevel === levelFilter);
    }

    setFilteredUsers(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
            <XCircle className="w-3 h-3" />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'ADMIN':
        return <Shield className="w-4 h-4 text-blue-400" />;
      default:
        return <Swords className="w-4 h-4 text-gray-400" />;
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
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">
              User Management
            </h1>
            <p className="text-gray-400 mt-1">
              Manage all warriors in the system
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-xs text-gray-400">Total Users</p>
            </div>
            <Users className="w-10 h-10 text-sky-400" />
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/30 border-slate-700/50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or Warrior ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="WARRIOR">Warrior</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as any)}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-sky-500 transition-colors"
              >
                <option value="ALL">All Levels</option>
                <option value="RECRUIT">Recruit</option>
                <option value="WARRIOR">Warrior</option>
                <option value="VETERAN">Veteran</option>
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <Filter className="w-4 h-4" />
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </Card>

        {/* Users Table */}
        <Card className="bg-slate-800/30 border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Warrior</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Role</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Level</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Stats</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Discipline</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-400">Joined</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id}
                    className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors"
                  >
                    {/* Warrior Info */}
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-white">
                          {user.displayName || user.name}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        <p className="text-xs font-mono text-amber-400 mt-0.5">
                          {user.warriorId}
                        </p>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className="text-sm text-gray-300">{user.role}</span>
                      </div>
                    </td>

                    {/* Badge Level */}
                    <td className="p-4">
                      <BadgeLevelDisplay level={user.currentBadgeLevel} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {getStatusBadge(user.status)}
                    </td>

                    {/* Stats */}
                    <td className="p-4">
                      <div className="text-sm">
                        <p className="text-white">{user.stats.totalTrades} trades</p>
                        <p className={`text-xs ${user.stats.winRate >= 70 ? 'text-emerald-400' : 'text-gray-400'}`}>
                          {user.stats.winRate}% win rate
                        </p>
                      </div>
                    </td>

                    {/* Discipline Score */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-400">
                          {user.disciplineScore}
                        </span>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="p-4">
                      <p className="text-sm text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin-hq/users/${user.id}`)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-sky-400" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin-hq/users/${user.id}/edit`)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4 text-amber-400" />
                        </button>
                        <button
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="More Actions"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No users found</p>
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}
