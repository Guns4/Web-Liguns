'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
    Search,
    UserCheck,
    UserX,
    Users,
    Eye,
    Filter,
    Download,
    RefreshCw,
    Loader2,
    Calendar,
    DollarSign,
    TrendingUp,
    Award,
    CheckCircle,
    Trash2,
    AlertTriangle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TalentProfile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    status: 'active' | 'contract' | 'interview' | 'inactive';
    phone?: string;
    profile_photo?: string;
    join_date: string;
    created_at: string;
    bio?: string | null;
}

export default function KaryawanPage() {
    const [talents, setTalents] = useState<TalentProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Statistics
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        contract: 0,
        inactive: 0
    });

    useEffect(() => {
        loadTalents();
    }, []);

    const loadTalents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'talent')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const talentData = (data as TalentProfile[]) || [];
            setTalents(talentData);

            // Calculate stats
            setStats({
                total: talentData.length,
                active: talentData.filter(t => t.status === 'active').length,
                contract: talentData.filter(t => t.status === 'contract').length,
                inactive: talentData.filter(t => t.status === 'inactive').length
            });
        } catch (error) {
            console.error('Error loading talents:', error);
            alert('Gagal memuat data karyawan');
        } finally {
            setLoading(false);
        }
    };

    // Filter talents
    const filteredTalents = talents.filter(talent => {
        const matchesSearch = talent.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            talent.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || talent.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-400';
            case 'contract': return 'bg-blue-500/20 text-blue-400';
            case 'interview': return 'bg-yellow-500/20 text-yellow-400';
            case 'inactive': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Aktif';
            case 'contract': return 'Kontrak';
            case 'interview': return 'Interview';
            case 'inactive': return 'Nonaktif';
            default: return status;
        }
    };

    // Extract venue from bio field
    const getVenue = (bio?: string | null) => {
        if (!bio) return '-';
        const match = bio.match(/Venue:\s*([^\|]+)/);
        return match ? match[1].trim() : '-';
    };

    // Approve user (change status from interview to active)
    const handleApproveUser = async (userId: string, userName: string) => {
        if (!confirm(`Approve ${userName} untuk mengubah status menjadi Aktif?`)) {
            return;
        }

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ status: 'active' })
                .eq('id', userId);

            if (error) throw error;

            alert(`${userName} berhasil di-approve!`);
            loadTalents(); // Reload data
        } catch (error) {
            console.error('Error approving user:', error);
            alert('Gagal approve user. Silakan coba lagi.');
        }
    };

    // Delete user
    const handleDeleteUser = async (userId: string, userName: string) => {
        if (!confirm(`PERINGATAN: Hapus ${userName}?\n\nTindakan ini akan:\n- Menghapus user dari auth\n- Menghapus semua data terkait\n\nTidak dapat dibatalkan!`)) {
            return;
        }

        const doubleConfirm = prompt(`Ketik "HAPUS" untuk mengonfirmasi penghapusan ${userName}`);
        if (doubleConfirm !== 'HAPUS') {
            alert('Penghapusan dibatalkan');
            return;
        }

        try {
            // Delete profile (will cascade to related data based on FK constraints)
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

            if (error) throw error;

            alert(`${userName} berhasil dihapus`);
            loadTalents(); // Reload data
        } catch (error: any) {
            console.error('Error deleting user:', error);
            alert(`Gagal menghapus user: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Manajemen Karyawan</h1>
                    <p className="text-gray-400">Kelola data talent dan karyawan</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadTalents}
                        disabled={loading}
                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-4 py-3 rounded-xl transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-4 py-3 rounded-xl transition-all">
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Users className="w-8 h-8 text-gold-500" />
                        <span className="text-2xl font-bold text-white">{stats.total}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Total Karyawan</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <UserCheck className="w-8 h-8 text-green-500" />
                        <span className="text-2xl font-bold text-white">{stats.active}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Aktif</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Calendar className="w-8 h-8 text-blue-500" />
                        <span className="text-2xl font-bold text-white">{stats.contract}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Kontrak</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <UserX className="w-8 h-8 text-red-500" />
                        <span className="text-2xl font-bold text-white">{stats.inactive}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Nonaktif</p>
                </motion.div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau email karyawan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50 transition-all"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-all"
                >
                    <option value="all">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="contract">Kontrak</option>
                    <option value="interview">Interview</option>
                    <option value="inactive">Nonaktif</option>
                </select>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="glass rounded-xl p-12 text-center">
                    <Loader2 className="w-12 h-12 text-gold-500 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-400">Memuat data karyawan...</p>
                </div>
            ) : (
                <>
                    {/* Talents Table */}
                    <div className="glass rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">Karyawan</th>
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">Email</th>
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">Role</th>
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">Venue</th>
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">Bergabung</th>
                                        <th className="text-left px-6 py-4 text-gray-400 font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTalents.map((talent) => (
                                        <motion.tr
                                            key={talent.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center overflow-hidden">
                                                        {talent.profile_photo ? (
                                                            <img src={talent.profile_photo} alt={talent.full_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-gold-500 font-semibold">
                                                                {talent.full_name.charAt(0).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{talent.full_name}</p>
                                                        {talent.phone && (
                                                            <p className="text-xs text-gray-400">{talent.phone}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{talent.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-medium">
                                                    {talent.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(talent.status)}`}>
                                                    {getStatusLabel(talent.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {getVenue(talent.bio)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {new Date(talent.join_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {/* Approve button - only show if status is interview */}
                                                    {talent.status === 'interview' && (
                                                        <button
                                                            onClick={() => handleApproveUser(talent.id, talent.full_name)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-sm font-medium"
                                                            title="Approve menjadi Aktif"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                            <span>Approve</span>
                                                        </button>
                                                    )}

                                                    {/* Detail button */}
                                                    <Link
                                                        href={`/admin/karyawan/${talent.id}`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-sm"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>

                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => handleDeleteUser(talent.id, talent.full_name)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
                                                        title="Hapus User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredTalents.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400">Tidak ada karyawan ditemukan</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/admin/karyawan/attendance"
                    className="glass rounded-xl p-6 hover:border-gold-500/30 transition-all group"
                >
                    <Calendar className="w-8 h-8 text-gold-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-1">Presensi</h3>
                    <p className="text-sm text-gray-400">Kelola absensi karyawan</p>
                </Link>

                <Link
                    href="/admin/karyawan/payroll"
                    className="glass rounded-xl p-6 hover:border-gold-500/30 transition-all group"
                >
                    <DollarSign className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-1">Payroll</h3>
                    <p className="text-sm text-gray-400">Hitung gaji & bonus</p>
                </Link>

                <Link
                    href="/admin/karyawan/performance"
                    className="glass rounded-xl p-6 hover:border-gold-500/30 transition-all group"
                >
                    <Award className="w-8 h-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-1">Performance</h3>
                    <p className="text-sm text-gray-400">Ranking & evaluasi</p>
                </Link>
            </div>
        </div>
    );
}
