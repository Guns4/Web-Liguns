'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Clock,
    Calendar,
    DollarSign,
    Star,
    TrendingUp,
    CheckCircle,
    Coffee,
    Building2
} from 'lucide-react';

export default function MemberDashboard() {
    const [member, setMember] = useState<any>(null);
    const [isClockedIn, setIsClockedIn] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem('memberSession');
        if (session) {
            setMember(JSON.parse(session));
        }
    }, []);

    if (!member) return null;

    const stats = [
        { label: 'Total Jam Kerja', value: '32 Jam', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Komisi Bulan Ini', value: 'Rp 4.5jt', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
        { label: 'Rating Saya', value: '4.8', icon: Star, color: 'text-gold-400', bg: 'bg-gold-500/10' },
        { label: 'Booking Selesai', value: '12', icon: CheckCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ];

    const todaySchedule = [
        { time: '19:00 - 21:00', guest: 'Booking - Table 12', status: 'Upcoming' },
        { time: '22:00 - 00:00', guest: 'Booking - VIP Room 3', status: 'Pending' },
    ];

    return (
        <div className="space-y-10">
            {/* Welcome Section - Enhanced */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl lg:text-5xl font-black text-white">
                            Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500">{member.nickname}</span>!
                        </h1>
                        <span className="text-4xl animate-bounce">👋</span>
                    </div>
                    <p className="text-lg text-gray-400 font-medium">Siap untuk memberikan pelayanan terbaik hari ini?</p>
                </div>

                {/* Clock In/Out Button - Enhanced */}
                <motion.button
                    onClick={() => setIsClockedIn(!isClockedIn)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-4 px-8 py-5 rounded-2xl font-bold text-base transition-all shadow-2xl border-2 ${isClockedIn
                        ? 'bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20 shadow-red-900/20'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-green-900/30 border-green-400/50'
                        }`}
                >
                    <Clock className="w-6 h-6" />
                    {isClockedIn ? 'Clock Out (Selesai)' : 'Clock In (Mulai Shift)'}
                </motion.button>
            </div>

            {/* Stats Grid - Enhanced */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -5, scale: 1.03 }}
                            className="relative p-7 rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 hover:border-purple-500/40 transition-all group overflow-hidden shadow-xl"
                        >
                            {/* Background Gradient Glow */}
                            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full`} />

                            <div className="relative z-10 flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                    <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase">{stat.label}</p>
                                    <h3 className="text-3xl lg:text-4xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Schedule - Enhanced */}
                <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <Calendar className="w-6 h-6 text-purple-400" />
                            </div>
                            Jadwal Hari Ini
                        </h2>
                        <span className="text-sm text-gray-400 bg-white/5 px-5 py-2.5 rounded-xl font-semibold border border-white/10">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                    </div>

                    <div className="space-y-5">
                        {todaySchedule.map((schedule, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col sm:flex-row sm:items-center gap-5 p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group"
                            >
                                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 text-purple-300 font-bold text-sm min-w-[120px] text-center border border-purple-500/30 group-hover:scale-105 transition-transform">
                                    {schedule.time}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h4 className="font-bold text-lg text-white">{schedule.guest}</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Building2 className="w-4 h-4" />
                                        <span className="font-medium">{member.venue}</span>
                                    </div>
                                </div>
                                <span className={`px-5 py-2.5 rounded-xl text-sm font-bold ${schedule.status === 'Upcoming'
                                    ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                                    : 'bg-orange-500/10 text-orange-300 border border-orange-500/30'
                                    }`}>
                                    {schedule.status}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Performance Card - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 rounded-3xl bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-blue-900/30 border border-purple-500/30 relative overflow-hidden shadow-2xl shadow-purple-900/20"
                >
                    {/* Animated Background Blobs */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full animate-pulse delay-1000" />

                    <h2 className="text-2xl font-black text-white mb-8 relative z-10 flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                        Performa Mingguan
                    </h2>

                    <div className="space-y-8 relative z-10">
                        <div className="space-y-3">
                            <div className="flex justify-between text-base mb-3">
                                <span className="text-gray-200 font-bold">Kehadiran</span>
                                <span className="text-green-400 font-black text-lg">98%</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '98%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full shadow-lg shadow-green-500/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-base mb-3">
                                <span className="text-gray-200 font-bold">Target Tips</span>
                                <span className="text-purple-400 font-black text-lg">85%</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '85%' }}
                                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full shadow-lg shadow-purple-500/50"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/20 mt-6">
                            <div className="p-5 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30">
                                <p className="text-sm text-gray-200 italic font-medium leading-relaxed">
                                    "Pertahankan performa bagusmu, <span className="text-purple-300 font-bold">{member.nickname}</span>! Bonus menanti di akhir bulan."
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
