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
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Halo, <span className="text-purple-400">{member.nickname}</span>! 👋
                    </h1>
                    <p className="text-gray-400">Siap untuk memberikan pelayanan terbaik hari ini?</p>
                </div>

                {/* Clock In/Out Button */}
                <button
                    onClick={() => setIsClockedIn(!isClockedIn)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${isClockedIn
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-green-900/20'
                        }`}
                >
                    <Clock className="w-5 h-5" />
                    {isClockedIn ? 'Clock Out (Selesai)' : 'Clock In (Mulai Shift)'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-5 rounded-2xl bg-[#0F0F0F] border border-white/5 hover:border-purple-500/30 transition-all group"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0F0F0F] border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            Jadwal Hari Ini
                        </h2>
                        <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {todaySchedule.map((schedule, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors">
                                <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 font-bold text-sm min-w-[100px] text-center border border-purple-500/20">
                                    {schedule.time}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-white">{schedule.guest}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                        <Building2 className="w-3 h-3" />
                                        <span>{member.venue}</span>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${schedule.status === 'Upcoming'
                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                    }`}>
                                    {schedule.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full" />

                    <h2 className="text-lg font-bold text-white mb-4 relative z-10 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        Performa Mingguan
                    </h2>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-300">Kehadiran</span>
                                <span className="text-green-400 font-bold">98%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '98%' }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-green-500 rounded-full"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-300">Target Tips</span>
                                <span className="text-purple-400 font-bold">85%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '85%' }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    className="h-full bg-purple-500 rounded-full"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 mt-4">
                            <p className="text-sm text-gray-400 italic">
                                "Pertahankan performa bagusmu, {member.nickname}! Bonus menanti di akhir bulan."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
