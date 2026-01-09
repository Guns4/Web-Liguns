'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Users,
    Briefcase,
    DollarSign,
    TrendingUp,
    Calendar,
    UserCheck,
    Loader2,
    BarChart3,
    LineChart as LineChartIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface StatsData {
    totalEmployees: number;
    activeEmployees: number;
    totalApplications: number;
    pendingApplications: number;
}

interface AttendanceChartData {
    date: string;
    hadir: number;
}

interface ApplicationChartData {
    date: string;
    pelamar: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<StatsData>({
        totalEmployees: 0,
        activeEmployees: 0,
        totalApplications: 0,
        pendingApplications: 0
    });
    const [attendanceData, setAttendanceData] = useState<AttendanceChartData[]>([]);
    const [applicationData, setApplicationData] = useState<ApplicationChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setIsLoading(true);
        try {
            // Load stats
            await Promise.all([
                loadStats(),
                loadAttendanceChart(),
                loadApplicationChart()
            ]);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        // Total employees
        const { count: totalEmployees } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .in('role', ['talent', 'admin']);

        // Active employees
        const { count: activeEmployees } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active')
            .in('role', ['talent', 'admin']);

        // Total applications
        const { count: totalApplications } = await supabase
            .from('job_applications')
            .select('*', { count: 'exact', head: true });

        // Pending applications
        const { count: pendingApplications } = await supabase
            .from('job_applications')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        setStats({
            totalEmployees: totalEmployees || 0,
            activeEmployees: activeEmployees || 0,
            totalApplications: totalApplications || 0,
            pendingApplications: pendingApplications || 0
        });
    };

    const loadAttendanceChart = async () => {
        // Get last 7 days
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }

        const chartData: AttendanceChartData[] = [];

        for (const date of days) {
            const { count } = await supabase
                .from('attendance')
                .select('*', { count: 'exact', head: true })
                .eq('date', date)
                .eq('status', 'present');

            chartData.push({
                date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
                hadir: count || 0
            });
        }

        setAttendanceData(chartData);
    };

    const loadApplicationChart = async () => {
        // Get dates for this month so far
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const days = [];
        const currentDate = new Date(firstDayOfMonth);
        while (currentDate <= today) {
            days.push(new Date(currentDate).toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const chartData: ApplicationChartData[] = [];

        for (const date of days) {
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const { count } = await supabase
                .from('job_applications')
                .select('*', { count: 'exact', head: true })
                .gte('applied_at', date)
                .lt('applied_at', nextDate.toISOString().split('T')[0]);

            chartData.push({
                date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
                pelamar: count || 0
            });
        }

        setApplicationData(chartData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-gold-500" />
            </div>
        );
    }

    const statsCards = [
        {
            label: 'Total Karyawan',
            value: stats.totalEmployees,
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-500/20'
        },
        {
            label: 'Karyawan Aktif',
            value: stats.activeEmployees,
            icon: UserCheck,
            color: 'text-green-400',
            bg: 'bg-green-500/20'
        },
        {
            label: 'Total Pelamar',
            value: stats.totalApplications,
            icon: Briefcase,
            color: 'text-purple-400',
            bg: 'bg-purple-500/20'
        },
        {
            label: 'Menunggu Review',
            value: stats.pendingApplications,
            icon: TrendingUp,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/20'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2">
                    📊 Dashboard Admin
                </h1>
                <p className="text-gray-400 text-lg">Overview dan statistik sistem</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 hover:border-gold-500/40 transition-all shadow-xl"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2">{stat.value}</h3>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-8 rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 shadow-2xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Absensi Harian</h2>
                            <p className="text-gray-400 text-sm">7 hari terakhir</p>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={attendanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis
                                dataKey="date"
                                stroke="#888"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#888"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1a1a1a',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                            />
                            <Legend
                                wrapperStyle={{ color: '#888' }}
                            />
                            <Bar
                                dataKey="hadir"
                                fill="#22c55e"
                                radius={[8, 8, 0, 0]}
                                name="Jumlah Hadir"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Applications Line Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-8 rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 shadow-2xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <LineChartIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">Tren Pendaftaran</h2>
                            <p className="text-gray-400 text-sm">Pelamar baru bulan ini</p>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={applicationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis
                                dataKey="date"
                                stroke="#888"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#888"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1a1a1a',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend
                                wrapperStyle={{ color: '#888' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="pelamar"
                                stroke="#a855f7"
                                strokeWidth={3}
                                dot={{ fill: '#a855f7', r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Pelamar Baru"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.a
                    href="/admin/lowongan/applications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 hover:border-purple-500/60 transition-all group"
                >
                    <Briefcase className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Kelola Pelamar</h3>
                    <p className="text-gray-400 text-sm">Review dan proses lamaran kerja</p>
                </motion.a>

                <motion.a
                    href="/admin/karyawan"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 hover:border-green-500/60 transition-all group"
                >
                    <Users className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Data Karyawan</h3>
                    <p className="text-gray-400 text-sm">Lihat dan kelola data karyawan</p>
                </motion.a>

                <motion.a
                    href="/admin/produk"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 hover:border-yellow-500/60 transition-all group"
                >
                    <DollarSign className="w-8 h-8 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">Toko Internal</h3>
                    <p className="text-gray-400 text-sm">Kelola produk toko karyawan</p>
                </motion.a>
            </div>
        </div>
    );
}
