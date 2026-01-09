'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Briefcase,
    Calendar,
    FileText,
    ExternalLink,
    Loader2,
    User,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Filter
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface JobApplication {
    id: string;
    job_id: string;
    user_id: string;
    cover_letter: string | null;
    resume_url: string | null;
    status: string;
    admin_notes: string | null;
    applied_at: string;
    job: {
        title: string;
        location: string;
    };
    profile: {
        full_name: string;
        email: string;
        phone: string | null;
    };
}

const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    { value: 'reviewed', label: 'Reviewed', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { value: 'interview', label: 'Interview', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { value: 'accepted', label: 'Accepted', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
];

export default function JobApplicationsPage() {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('job_applications')
                .select(`
                    *,
                    jobs:job_id (
                        title,
                        location
                    ),
                    profiles:user_id (
                        full_name,
                        email,
                        phone
                    )
                `)
                .order('applied_at', { ascending: false });

            if (error) throw error;

            const formatted = data.map((item: any) => ({
                id: item.id,
                job_id: item.job_id,
                user_id: item.user_id,
                cover_letter: item.cover_letter,
                resume_url: item.resume_url,
                status: item.status,
                admin_notes: item.admin_notes,
                applied_at: item.applied_at,
                job: {
                    title: item.jobs?.title || 'Unknown Position',
                    location: item.jobs?.location || '-'
                },
                profile: {
                    full_name: item.profiles?.full_name || 'Unknown',
                    email: item.profiles?.email || '-',
                    phone: item.profiles?.phone || '-'
                }
            }));

            setApplications(formatted);
        } catch (error) {
            console.error('Error loading applications:', error);
            alert('Gagal memuat data pelamar');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (applicationId: string, userId: string, newStatus: string) => {
        if (!confirm(`Ubah status menjadi "${statusOptions.find(s => s.value === newStatus)?.label}"?`)) {
            return;
        }

        setIsUpdating(applicationId);
        try {
            // Update application status
            const { error: appError } = await supabase
                .from('job_applications')
                .update({
                    status: newStatus,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', applicationId);

            if (appError) throw appError;

            // If accepted, update user profile status to 'active'
            if (newStatus === 'accepted') {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ status: 'active' })
                    .eq('id', userId);

                if (profileError) throw profileError;

                alert('Status diubah menjadi "Accepted" dan pelamar diaktifkan sebagai karyawan! ✓');
            } else {
                alert('Status berhasil diupdate!');
            }

            loadApplications(); // Reload data
        } catch (error: any) {
            console.error('Error updating status:', error);
            alert('Gagal mengubah status: ' + error.message);
        } finally {
            setIsUpdating(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusItem = statusOptions.find(s => s.value === status);
        return statusItem || statusOptions[0];
    };

    const filteredApplications = applications.filter(app => {
        if (filterStatus === 'all') return true;
        return app.status === filterStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Manajemen Pelamar</h1>
                    <p className="text-gray-400">Review dan kelola aplikasi lamaran kerja</p>
                </div>

                {/* Filter Status */}
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                    >
                        <option value="all">Semua Status</option>
                        {statusOptions.map(status => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/30">
                    <p className="text-gray-400 text-sm mb-1">Total</p>
                    <p className="text-2xl font-black text-white">{applications.length}</p>
                </div>
                {statusOptions.map(status => {
                    const count = applications.filter(a => a.status === status.value).length;
                    return (
                        <div key={status.value} className={`p-4 rounded-xl border ${status.color}`}>
                            <p className="text-sm mb-1 opacity-80">{status.label}</p>
                            <p className="text-2xl font-black">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-gold-500" />
                </div>
            ) : (
                <div className="glass rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Pelamar</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Posisi</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Tanggal</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Resume</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.map((app) => {
                                    const statusBadge = getStatusBadge(app.status);
                                    return (
                                        <motion.tr
                                            key={app.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            {/* Pelamar */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">
                                                            {app.profile.full_name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white">{app.profile.full_name}</p>
                                                        <p className="text-sm text-gray-400">{app.profile.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Posisi */}
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white">{app.job.title}</p>
                                                    <p className="text-sm text-gray-400">{app.job.location}</p>
                                                </div>
                                            </td>

                                            {/* Tanggal */}
                                            <td className="px-6 py-4 text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                    {new Date(app.applied_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </td>

                                            {/* Resume */}
                                            <td className="px-6 py-4">
                                                {app.resume_url ? (
                                                    <a
                                                        href={app.resume_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm font-medium"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        Lihat CV
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">No resume</span>
                                                )}
                                            </td>

                                            {/* Status Dropdown */}
                                            <td className="px-6 py-4">
                                                {isUpdating === app.id ? (
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span className="text-sm">Updating...</span>
                                                    </div>
                                                ) : (
                                                    <select
                                                        value={app.status}
                                                        onChange={(e) => handleStatusChange(app.id, app.user_id, e.target.value)}
                                                        className={`px-3 py-2 rounded-lg text-sm font-semibold border cursor-pointer focus:outline-none ${statusBadge.color}`}
                                                    >
                                                        {statusOptions.map(status => (
                                                            <option key={status.value} value={status.value} className="bg-[#0a0a0a] text-white">
                                                                {status.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        alert(`Pelamar: ${app.profile.full_name}\n\nCover Letter:\n${app.cover_letter || 'Tidak ada cover letter'}\n\nPhone: ${app.profile.phone}`);
                                                    }}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Lihat detail"
                                                >
                                                    <Eye className="w-5 h-5 text-gray-400 hover:text-white" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredApplications.length === 0 && (
                        <div className="text-center py-12">
                            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">
                                {filterStatus === 'all'
                                    ? 'Belum ada pelamar'
                                    : `Tidak ada pelamar dengan status "${statusOptions.find(s => s.value === filterStatus)?.label}"`
                                }
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Info Box */}
            <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                    <p className="font-semibold mb-1">Informasi Penting</p>
                    <ul className="text-blue-300/80 space-y-1">
                        <li>• Status "Accepted" akan otomatis mengaktifkan pelamar sebagai karyawan (status 'active' di profiles)</li>
                        <li>• Review resume pelamar sebelum mengubah status</li>
                        <li>• Status tidak dapat dikembalikan setelah diubah</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
