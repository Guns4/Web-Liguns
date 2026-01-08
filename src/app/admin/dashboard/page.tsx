'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
    Briefcase,
    ShoppingBag,
    Users,
    Eye,
    TrendingUp,
    Plus,
    ArrowRight,
    Package,
    FileText
} from 'lucide-react';

// Stats data
const stats = [
    { label: 'Total Lowongan', value: '12', icon: Briefcase, color: 'bg-blue-500/20 text-blue-400' },
    { label: 'Produk Toko', value: '48', icon: ShoppingBag, color: 'bg-green-500/20 text-green-400' },
    { label: 'Pengunjung Hari Ini', value: '234', icon: Eye, color: 'bg-purple-500/20 text-purple-400' },
    { label: 'Total Member', value: '156', icon: Users, color: 'bg-gold-500/20 text-gold-400' },
];

// Quick actions
const quickActions = [
    { label: 'Tambah Lowongan', href: '/admin/lowongan?action=new', icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Tambah Produk', href: '/admin/produk?action=new', icon: Package, color: 'bg-green-500' },
    { label: 'Edit Konten', href: '/admin/konten', icon: FileText, color: 'bg-purple-500' },
];

// Recent activities
const recentActivities = [
    { action: 'Lowongan baru ditambahkan', item: 'Venetian Havana', time: '2 jam lalu' },
    { action: 'Produk diperbarui', item: 'Luxury Face Serum', time: '5 jam lalu' },
    { action: 'Member baru bergabung', item: 'user@email.com', time: '1 hari lalu' },
    { action: 'Lowongan diedit', item: 'Denver Club', time: '2 hari lalu' },
];

export default function AdminDashboard() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('adminUsername');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">
                    Selamat datang kembali, <span className="text-gold-400">{username || 'Admin'}</span>
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass p-6 rounded-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-6 rounded-xl"
            >
                <h2 className="text-xl font-semibold text-white mb-4">Aksi Cepat</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            href={action.href}
                            className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                        >
                            <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                                <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-white">{action.label}</p>
                            </div>
                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass p-6 rounded-xl"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-white">Aktivitas Terbaru</h2>
                        <Link href="/admin/aktivitas" className="text-gold-400 hover:text-gold-300 text-sm flex items-center gap-1">
                            Lihat Semua <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                                <div className="w-2 h-2 bg-gold-500 rounded-full" />
                                <div className="flex-1">
                                    <p className="text-white text-sm">{activity.action}</p>
                                    <p className="text-gray-400 text-xs">{activity.item}</p>
                                </div>
                                <span className="text-gray-500 text-xs">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass p-6 rounded-xl"
                >
                    <h2 className="text-xl font-semibold text-white mb-4">Menu Manajemen</h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/lowongan"
                            className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-5 h-5 text-blue-400" />
                                <span className="text-white">Kelola Lowongan Kerja</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </Link>
                        <Link
                            href="/admin/produk"
                            className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-green-400" />
                                <span className="text-white">Kelola Produk Toko</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </Link>
                        <Link
                            href="/admin/konten"
                            className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-purple-400" />
                                <span className="text-white">Kelola Konten Website</span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
