'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
    Calendar,
    ArrowUpCircle,
    ArrowDownCircle,
    Loader2,
    FileText,
    Download
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface FinancialRecord {
    id: string;
    type: string;
    amount: number;
    description: string | null;
    date: string;
    period_month: number;
    period_year: number;
}

interface MonthlySummary {
    totalIncome: number;
    totalDeduction: number;
    netSalary: number;
    transactions: FinancialRecord[];
}

export default function SalaryPage() {
    const { profile } = useAuth();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [summary, setSummary] = useState<MonthlySummary>({
        totalIncome: 0,
        totalDeduction: 0,
        netSalary: 0,
        transactions: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (profile?.id) {
            loadFinancialData();
        }
    }, [profile?.id, selectedMonth, selectedYear]);

    const loadFinancialData = async () => {
        if (!profile?.id) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('financial_records')
                .select('*')
                .eq('user_id', profile.id)
                .eq('period_month', selectedMonth)
                .eq('period_year', selectedYear)
                .order('date', { ascending: false });

            if (error) throw error;

            const records = data as FinancialRecord[];

            // Categorize income and deductions
            const incomeTypes = ['voucher_income', 'bonus'];
            const deductionTypes = ['deduction_loan', 'deduction_saving', 'deduction_health', 'deduction_store'];

            const totalIncome = records
                .filter(r => incomeTypes.includes(r.type))
                .reduce((sum, r) => sum + Number(r.amount), 0);

            const totalDeduction = records
                .filter(r => deductionTypes.includes(r.type))
                .reduce((sum, r) => sum + Number(r.amount), 0);

            const netSalary = totalIncome - totalDeduction;

            setSummary({
                totalIncome,
                totalDeduction,
                netSalary,
                transactions: records
            });
        } catch (error) {
            console.error('Error loading financial data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatRupiah = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getTransactionTypeLabel = (type: string): string => {
        const labels: { [key: string]: string } = {
            'voucher_income': 'Pendapatan Voucher',
            'bonus': 'Bonus',
            'deduction_loan': 'Potongan Kasbon',
            'deduction_saving': 'Potongan Tabungan',
            'deduction_health': 'Potongan Kesehatan',
            'deduction_store': 'Potongan Toko',
            'adjustment': 'Penyesuaian'
        };
        return labels[type] || type;
    };

    const isIncome = (type: string): boolean => {
        return ['voucher_income', 'bonus'].includes(type);
    };

    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">
                        💰 Gaji & Komisi
                    </h1>
                    <p className="text-gray-400 text-lg">Rincian pendapatan dan potongan Anda</p>
                </div>

                {/* Month & Year Selector */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                        <Calendar className="w-5 h-5 text-purple-400" />
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="bg-transparent text-white font-semibold outline-none cursor-pointer"
                        >
                            {months.map((month, idx) => (
                                <option key={idx} value={idx + 1} className="bg-[#0a0a0a] text-white">
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-transparent text-white font-semibold outline-none cursor-pointer"
                        >
                            {years.map((year) => (
                                <option key={year} value={year} className="bg-[#0a0a0a] text-white">
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Income */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative p-8 rounded-3xl bg-gradient-to-br from-green-900/30 via-green-800/20 to-emerald-900/30 border border-green-500/30 overflow-hidden shadow-2xl shadow-green-900/20"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 blur-3xl rounded-full" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/40">
                                        <ArrowUpCircle className="w-8 h-8 text-green-400" />
                                    </div>
                                    <TrendingUp className="w-6 h-6 text-green-400" />
                                </div>
                                <p className="text-sm text-green-300/70 mb-2 font-semibold uppercase tracking-wider">Total Pendapatan</p>
                                <h3 className="text-3xl lg:text-4xl font-black text-white mb-1">
                                    {formatRupiah(summary.totalIncome)}
                                </h3>
                            </div>
                        </motion.div>

                        {/* Total Deduction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative p-8 rounded-3xl bg-gradient-to-br from-red-900/30 via-red-800/20 to-rose-900/30 border border-red-500/30 overflow-hidden shadow-2xl shadow-red-900/20"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-3xl rounded-full" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40">
                                        <ArrowDownCircle className="w-8 h-8 text-red-400" />
                                    </div>
                                    <TrendingDown className="w-6 h-6 text-red-400" />
                                </div>
                                <p className="text-sm text-red-300/70 mb-2 font-semibold uppercase tracking-wider">Total Potongan</p>
                                <h3 className="text-3xl lg:text-4xl font-black text-white mb-1">
                                    {formatRupiah(summary.totalDeduction)}
                                </h3>
                            </div>
                        </motion.div>

                        {/* Net Salary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-blue-900/30 border border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-900/20"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/40">
                                        <Wallet className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <DollarSign className="w-6 h-6 text-purple-400" />
                                </div>
                                <p className="text-sm text-purple-300/70 mb-2 font-semibold uppercase tracking-wider">Gaji Bersih</p>
                                <h3 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400">
                                    {formatRupiah(summary.netSalary)}
                                </h3>
                            </div>
                        </motion.div>
                    </div>

                    {/* Transactions Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-8 rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <FileText className="w-6 h-6 text-blue-400" />
                                </div>
                                Riwayat Transaksi
                            </h2>
                            <button className="flex items-center gap-2 px-5 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl transition-all border border-purple-500/30 font-semibold">
                                <Download className="w-5 h-5" />
                                <span>Export</span>
                            </button>
                        </div>

                        {summary.transactions.length === 0 ? (
                            <div className="text-center py-16">
                                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 text-lg">Tidak ada transaksi di periode ini</p>
                                <p className="text-gray-500 text-sm mt-2">Pilih bulan dan tahun lain untuk melihat riwayat</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm uppercase">Tanggal</th>
                                            <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm uppercase">Tipe Transaksi</th>
                                            <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm uppercase">Keterangan</th>
                                            <th className="text-right px-6 py-4 text-gray-400 font-semibold text-sm uppercase">Nominal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summary.transactions.map((transaction, idx) => {
                                            const income = isIncome(transaction.type);
                                            return (
                                                <motion.tr
                                                    key={transaction.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="px-6 py-5 text-gray-300 font-medium">
                                                        {new Date(transaction.date).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            {income ? (
                                                                <ArrowUpCircle className="w-5 h-5 text-green-400" />
                                                            ) : (
                                                                <ArrowDownCircle className="w-5 h-5 text-red-400" />
                                                            )}
                                                            <span className={`font-semibold ${income ? 'text-green-300' : 'text-red-300'}`}>
                                                                {getTransactionTypeLabel(transaction.type)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-gray-400">
                                                        {transaction.description || '-'}
                                                    </td>
                                                    <td className={`px-6 py-5 text-right font-bold font-mono text-lg ${income ? 'text-green-400' : 'text-red-400'
                                                        }`}>
                                                        {income ? '+' : '-'} {formatRupiah(Number(transaction.amount))}
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="border-t-2 border-white/20">
                                        <tr>
                                            <td colSpan={3} className="px-6 py-6 text-right text-white font-bold text-lg">
                                                Total Bersih:
                                            </td>
                                            <td className={`px-6 py-6 text-right font-black text-2xl font-mono ${summary.netSalary >= 0 ? 'text-purple-400' : 'text-red-400'
                                                }`}>
                                                {formatRupiah(summary.netSalary)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </motion.div>

                    {/* Info Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-4"
                    >
                        <div className="p-3 rounded-lg bg-blue-500/20">
                            <FileText className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-blue-200 font-bold mb-2">Informasi Penting</h3>
                            <ul className="text-blue-300/80 text-sm space-y-1 leading-relaxed">
                                <li>• Gaji akan dibayarkan setiap tanggal 5 bulan berikutnya</li>
                                <li>• Voucher income dihitung berdasarkan voucher yang Anda kumpulkan</li>
                                <li>• Potongan kasbon akan otomatis dipotong dari gaji bulanan</li>
                                <li>• Jika ada perbedaan data, hubungi admin atau HRD</li>
                            </ul>
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
}
