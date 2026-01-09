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
    Building2,
    UserCheck,
    AlertCircle,
    LogIn,
    LogOut as LogOutIcon,
    History,
    Loader2,
    Trophy,
    Award,
    Medal,
    Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface AttendanceRecord {
    id: string;
    date: string;
    status: string;
    check_in_time: string | null;
    check_out_time: string | null;
}

interface GamificationData {
    rank_score: number;
    attendance_score: number;
    performance_score: number;
    customer_rating: number;
    total_vouchers: number;
    total_hours: number;
    rank_position: number | null;
    achievements: any;
}

interface TopPerformer {
    user_id: string;
    rank_score: number;
    rank_position: number;
    profile: {
        full_name: string;
        profile_photo: string | null;
    };
}

export default function MemberDashboard() {
    const { profile } = useAuth();
    const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
    const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
    const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
    const [isLoadingGamification, setIsLoadingGamification] = useState(true);

    useEffect(() => {
        if (profile?.id) {
            loadAttendanceData();
            loadGamificationData();
        }
    }, [profile?.id]);

    const loadAttendanceData = async () => {
        if (!profile?.id) return;

        setIsLoadingAttendance(true);
        try {
            const today = new Date().toISOString().split('T')[0];

            // Get today's attendance
            const { data: todayData } = await supabase
                .from('attendance')
                .select('*')
                .eq('user_id', profile.id)
                .eq('date', today)
                .single();

            setTodayAttendance(todayData);

            // Get last 14 days attendance history
            const fourteenDaysAgo = new Date();
            fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

            const { data: historyData } = await supabase
                .from('attendance')
                .select('*')
                .eq('user_id', profile.id)
                .gte('date', fourteenDaysAgo.toISOString().split('T')[0])
                .order('date', { ascending: false })
                .limit(14);

            setAttendanceHistory(historyData || []);
        } catch (error) {
            console.error('Error loading attendance:', error);
        } finally {
            setIsLoadingAttendance(false);
        }
    };

    const handleCheckIn = async () => {
        if (!profile?.id || todayAttendance) return;

        setIsProcessing(true);
        try {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

            const { data, error } = await supabase
                .from('attendance')
                .insert({
                    user_id: profile.id,
                    date: today,
                    check_in_time: currentTime,
                    status: 'present'
                })
                .select()
                .single();

            if (error) throw error;

            setTodayAttendance(data);
            alert('Check In berhasil! Selamat bekerja! 🎉');
            loadAttendanceData(); // Reload to update history
        } catch (error: any) {
            console.error('Error checking in:', error);
            alert('Gagal Check In: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCheckOut = async () => {
        if (!profile?.id || !todayAttendance || todayAttendance.check_out_time) return;

        setIsProcessing(true);
        try {
            const now = new Date();
            const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

            const { data, error } = await supabase
                .from('attendance')
                .update({ check_out_time: currentTime })
                .eq('id', todayAttendance.id)
                .select()
                .single();

            if (error) throw error;

            setTodayAttendance(data);
            alert('Check Out berhasil! Terima kasih atas kerja kerasnya hari ini! 👏');
            loadAttendanceData(); // Reload to update history
        } catch (error: any) {
            console.error('Error checking out:', error);
            alert('Gagal Check Out: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const loadGamificationData = async () => {
        if (!profile?.id) return;

        setIsLoadingGamification(true);
        try {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // 1-12
            const currentYear = currentDate.getFullYear();

            // Get current user's gamification data
            const { data: myData } = await supabase
                .from('gamification')
                .select('*')
                .eq('user_id', profile.id)
                .eq('month', currentMonth)
                .eq('year', currentYear)
                .single();

            setGamificationData(myData);

            // Get top 3 performers this month
            const { data: topData } = await supabase
                .from('gamification')
                .select(`
                    user_id,
                    rank_score,
                    rank_position,
                    profiles:user_id (
                        full_name,
                        profile_photo
                    )
                `)
                .eq('month', currentMonth)
                .eq('year', currentYear)
                .order('rank_score', { ascending: false })
                .limit(3);

            if (topData) {
                const formatted = topData.map((item: any) => ({
                    user_id: item.user_id,
                    rank_score: item.rank_score,
                    rank_position: item.rank_position,
                    profile: {
                        full_name: item.profiles?.full_name || 'Unknown',
                        profile_photo: item.profiles?.profile_photo || null
                    }
                }));
                setTopPerformers(formatted);
            }
        } catch (error) {
            console.error('Error loading gamification:', error);
        } finally {
            setIsLoadingGamification(false);
        }
    };

    // Extract nickname and venue from bio
    const getNickname = () => {
        if (!profile?.bio) return profile?.full_name?.split(' ')[0] || 'User';
        const match = profile.bio.match(/Nickname:\s*([^\|]+)/);
        return match ? match[1].trim() : profile.full_name?.split(' ')[0] || 'User';
    };

    const getVenue = () => {
        if (!profile?.bio) return 'No Venue';
        const match = profile.bio.match(/Venue:\s*([^\|]+)/);
        return match ? match[1].trim() : 'No Venue';
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'active': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' };
            case 'contract': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' };
            case 'interview': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' };
            case 'inactive': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' };
            default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' };
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case 'active': return 'Aktif';
            case 'contract': return 'Kontrak';
            case 'interview': return 'Interview';
            case 'inactive': return 'Nonaktif';
            default: return 'Unknown';
        }
    };

    const getRankBadge = (score: number) => {
        if (score >= 90) return { name: 'Diamond', color: 'from-cyan-400 to-blue-500', icon: Trophy, glow: 'shadow-cyan-500/50' };
        if (score >= 75) return { name: 'Platinum', color: 'from-gray-300 to-gray-500', icon: Trophy, glow: 'shadow-gray-400/50' };
        if (score >= 60) return { name: 'Gold', color: 'from-yellow-400 to-yellow-600', icon: Medal, glow: 'shadow-yellow-500/50' };
        if (score >= 40) return { name: 'Silver', color: 'from-gray-400 to-gray-600', icon: Medal, glow: 'shadow-gray-500/50' };
        return { name: 'Bronze', color: 'from-orange-600 to-orange-800', icon: Award, glow: 'shadow-orange-600/50' };
    };

    const getAttendanceStatusBadge = (status: string) => {
        switch (status) {
            case 'present': return { label: 'Hadir', color: 'bg-green-500/10 text-green-400 border-green-500/30' };
            case 'sick': return { label: 'Sakit', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' };
            case 'alpha': return { label: 'Alpha', color: 'bg-red-500/10 text-red-400 border-red-500/30' };
            case 'permit': return { label: 'Izin', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
            case 'leave': return { label: 'Cuti', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
            default: return { label: status, color: 'bg-gray-500/10 text-gray-400 border-gray-500/30' };
        }
    };

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const statusStyle = getStatusColor(profile.status);

    const stats = [
        { label: 'Total Jam Kerja', value: '32 Jam', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Komisi Bulan Ini', value: 'Rp 4.5jt', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
        { label: 'Rating Saya', value: '4.8', icon: Star, color: 'text-gold-400', bg: 'bg-gold-500/10' },
        { label: 'Hadir Bulan Ini', value: attendanceHistory.filter(a => a.status === 'present').length.toString(), icon: CheckCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
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
                            Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500">{getNickname()}</span>!
                        </h1>
                        <span className="text-4xl animate-bounce">👋</span>
                    </div>
                    <p className="text-lg text-gray-400 font-medium">Siap untuk memberikan pelayanan terbaik hari ini?</p>

                    {/* Status Badge */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                            <UserCheck className="w-4 h-4" />
                            <span>Status: {getStatusLabel(profile.status)}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-purple-500/10 text-purple-400 border border-purple-500/30">
                            <Building2 className="w-4 h-4" />
                            <span>{getVenue()}</span>
                        </div>
                    </div>
                </div>

                {/* Check In/Out Buttons - Enhanced */}
                <div className="flex gap-4">
                    {isLoadingAttendance ? (
                        <div className="flex items-center gap-2 px-8 py-5 rounded-2xl bg-white/5 border-2 border-white/10">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                            <span className="text-gray-400 font-semibold">Loading...</span>
                        </div>
                    ) : (
                        <>
                            {/* Check In Button */}
                            <motion.button
                                onClick={handleCheckIn}
                                disabled={!!todayAttendance || isProcessing}
                                whileHover={!todayAttendance ? { scale: 1.05 } : {}}
                                whileTap={!todayAttendance ? { scale: 0.95 } : {}}
                                className={`flex items-center gap-4 px-8 py-5 rounded-2xl font-bold text-base transition-all shadow-2xl border-2 ${todayAttendance
                                    ? 'bg-gray-500/10 text-gray-500 border-gray-500/30 cursor-not-allowed opacity-50'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-green-900/30 border-green-400/50'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-6 h-6" />
                                        <span>{todayAttendance ? '✓ Sudah Check In' : 'Check In'}</span>
                                    </>
                                )}
                            </motion.button>

                            {/* Check Out Button */}
                            {todayAttendance && (
                                <motion.button
                                    onClick={handleCheckOut}
                                    disabled={!!todayAttendance?.check_out_time || isProcessing}
                                    whileHover={!todayAttendance?.check_out_time ? { scale: 1.05 } : {}}
                                    whileTap={!todayAttendance?.check_out_time ? { scale: 0.95 } : {}}
                                    className={`flex items-center gap-4 px-8 py-5 rounded-2xl font-bold text-base transition-all shadow-2xl border-2 ${todayAttendance?.check_out_time
                                        ? 'bg-gray-500/10 text-gray-500 border-gray-500/30 cursor-not-allowed opacity-50'
                                        : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-red-900/30 border-red-400/50'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogOutIcon className="w-6 h-6" />
                                            <span>{todayAttendance?.check_out_time ? '✓ Sudah Check Out' : 'Check Out'}</span>
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Today's Attendance Info */}
            {todayAttendance && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-green-200 font-semibold mb-1">Absensi Hari Ini</p>
                            <p className="text-sm text-green-300/70">
                                Check In: <span className="font-bold">{todayAttendance.check_in_time?.slice(0, 5)}</span>
                                {todayAttendance.check_out_time && (
                                    <> • Check Out: <span className="font-bold">{todayAttendance.check_out_time?.slice(0, 5)}</span></>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 text-sm font-bold border border-green-500/40">
                        {getAttendanceStatusBadge(todayAttendance.status).label}
                    </div>
                </motion.div>
            )}

            {/* Account Status Warning (if interview or inactive) */}
            {(profile.status === 'interview' || profile.status === 'inactive') && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border flex items-start gap-3 ${profile.status === 'interview'
                        ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'
                        : 'bg-red-500/10 border-red-500/30 text-red-200'
                        }`}
                >
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold mb-1">
                            {profile.status === 'interview' ? 'Status Interview' : 'Akun Nonaktif'}
                        </p>
                        <p className="text-sm opacity-90">
                            {profile.status === 'interview'
                                ? 'Akun Anda masih dalam tahap interview. Tunggu approval dari admin untuk mengaktifkan akun Anda.'
                                : 'Akun Anda tidak aktif. Hubungi admin untuk informasi lebih lanjut.'
                            }
                        </p>
                    </div>
                </motion.div>
            )}

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

            {/* Gamification Widgets */}
            {!isLoadingGamification && gamificationData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Rank Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 p-8 shadow-2xl"
                    >
                        {(() => {
                            const rankBadge = getRankBadge(gamificationData.rank_score);
                            const RankIcon = rankBadge.icon;
                            return (
                                <>
                                    {/* Glow Effect */}
                                    <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${rankBadge.color} blur-3xl opacity-30 animate-pulse`} />

                                    <div className="relative z-10">
                                        {/* Badge Icon */}
                                        <div className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-br ${rankBadge.color} flex items-center justify-center mb-4 shadow-2xl ${rankBadge.glow}`}>
                                            <RankIcon className="w-12 h-12 text-white" />
                                        </div>

                                        {/* Rank Name */}
                                        <h3 className={`text-3xl font-black text-center mb-2 bg-gradient-to-br ${rankBadge.color} bg-clip-text text-transparent`}>
                                            {rankBadge.name}
                                        </h3>

                                        {/* Score */}
                                        <div className="text-center mb-4">
                                            <p className="text-gray-400 text-sm mb-1">Rank Score</p>
                                            <p className="text-4xl font-black text-white">{gamificationData.rank_score.toFixed(1)}</p>
                                        </div>

                                        {/* Position */}
                                        {gamificationData.rank_position && (
                                            <div className="text-center">
                                                <p className="text-gray-500 text-xs mb-1">Posisi</p>
                                                <p className="text-xl font-bold text-purple-400">#{gamificationData.rank_position}</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                    </motion.div>

                    {/* Progress Scores */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 p-8 shadow-2xl"
                    >
                        <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                            <Zap className="w-6 h-6 text-yellow-400" />
                            Skor Performa
                        </h3>

                        <div className="space-y-6">
                            {/* Attendance Score */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-300 font-semibold">Kehadiran</span>
                                    <span className="text-2xl font-black text-green-400">
                                        {gamificationData.attendance_score.toFixed(0)}%
                                    </span>
                                </div>
                                <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${gamificationData.attendance_score}%` }}
                                        transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full shadow-lg shadow-green-500/50"
                                    />
                                </div>
                            </div>

                            {/* Performance Score */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-300 font-semibold">Performa Kerja</span>
                                    <span className="text-2xl font-black text-purple-400">
                                        {gamificationData.performance_score.toFixed(0)}%
                                    </span>
                                </div>
                                <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${gamificationData.performance_score}%` }}
                                        transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full shadow-lg shadow-purple-500/50"
                                    />
                                </div>
                            </div>

                            {/* Customer Rating */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-300 font-semibold">Rating Customer</span>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        <span className="text-2xl font-black text-yellow-400">
                                            {gamificationData.customer_rating.toFixed(1)}
                                        </span>
                                        <span className="text-gray-500 text-sm">/5.0</span>
                                    </div>
                                </div>
                                <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(gamificationData.customer_rating / 5) * 100}%` }}
                                        transition={{ duration: 1.5, delay: 1.1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full shadow-lg shadow-yellow-500/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Top Performers Leaderboard */}
            {topPerformers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 p-8 shadow-2xl"
                >
                    <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-gold-400" />
                        Top Performers Bulan Ini
                    </h3>

                    <div className="space-y-4">
                        {topPerformers.map((performer, index) => {
                            const rankBadge = getRankBadge(performer.rank_score);
                            const isCurrentUser = performer.user_id === profile?.id;

                            return (
                                <motion.div
                                    key={performer.user_id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className={`flex items-center gap-4 p-4 rounded-xl ${isCurrentUser
                                            ? 'bg-purple-500/20 border-2 border-purple-500/50'
                                            : 'bg-white/5 border border-white/10'
                                        } hover:bg-white/10 transition-all`}
                                >
                                    {/* Rank Number */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                                                'bg-gradient-to-br from-orange-600 to-orange-800 text-white'
                                        } shadow-lg`}>
                                        {index + 1}
                                    </div>

                                    {/* Profile Photo */}
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                                        {performer.profile.profile_photo ? (
                                            <Image
                                                src={performer.profile.profile_photo}
                                                alt={performer.profile.full_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                {performer.profile.full_name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <p className="font-bold text-white">
                                            {performer.profile.full_name}
                                            {isCurrentUser && <span className="text-purple-400 text-xs ml-2">(Anda)</span>}
                                        </p>
                                        <p className="text-sm text-gray-400">{rankBadge.name} Rank</p>
                                    </div>

                                    {/* Score */}
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-white">{performer.rank_score.toFixed(1)}</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            <p className="text-xs text-gray-500">Score</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Attendance History - NEW */}
                <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <History className="w-6 h-6 text-blue-400" />
                            </div>
                            Riwayat Absensi (14 Hari)
                        </h2>
                    </div>

                    {isLoadingAttendance ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                        </div>
                    ) : attendanceHistory.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">Belum ada riwayat absensi</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left px-4 py-3 text-gray-400 font-medium text-sm">Tanggal</th>
                                        <th className="text-left px-4 py-3 text-gray-400 font-medium text-sm">Check In</th>
                                        <th className="text-left px-4 py-3 text-gray-400 font-medium text-sm">Check Out</th>
                                        <th className="text-left px-4 py-3 text-gray-400 font-medium text-sm">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceHistory.map((record, idx) => {
                                        const badge = getAttendanceStatusBadge(record.status);
                                        return (
                                            <motion.tr
                                                key={record.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="px-4 py-4 text-white font-medium">
                                                    {new Date(record.date).toLocaleDateString('id-ID', {
                                                        weekday: 'short',
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </td>
                                                <td className="px-4 py-4 text-green-400 font-mono text-sm">
                                                    {record.check_in_time ? record.check_in_time.slice(0, 5) : '-'}
                                                </td>
                                                <td className="px-4 py-4 text-red-400 font-mono text-sm">
                                                    {record.check_out_time ? record.check_out_time.slice(0, 5) : '-'}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${badge.color}`}>
                                                        {badge.label}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
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
                                    "Pertahankan performa bagusmu, <span className="text-purple-300 font-bold">{getNickname()}</span>! Bonus menanti di akhir bulan."
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
