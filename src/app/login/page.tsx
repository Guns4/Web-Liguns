'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { User, MapPin, Building2, ChevronRight, AlertCircle } from 'lucide-react';

const venues = [
    'Venetian Havana',
    'Denver Club',
    'Denver Spa',
    'Vender Club',
    '80 Spa',
    'Saga Vigour',
    'Sultan Spa',
    'LIV Club',
    'Heritage'
];

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        realName: '',
        nickname: '',
        venue: ''
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const membersStr = localStorage.getItem('members');
            const members = membersStr ? JSON.parse(membersStr) : [];

            // 1. Nama Asli (Partial Match, Case Insensitive)
            // 2. Nama Panggilan (Exact Match, Case Insensitive)
            // 3. Penempatan (Exact Match)

            const foundMember = members.find((m: any) =>
                m.fullName.toLowerCase().includes(formData.realName.toLowerCase()) &&
                m.nickname.toLowerCase() === formData.nickname.toLowerCase() &&
                m.venue === formData.venue
            );

            // For Demo/Testing purposes, create a mock user if the exact demo credentials are used
            // This is just to allow the user to login immediately without registering if they want to try it
            const isDemoUser =
                formData.realName.toLowerCase().includes('guntur') &&
                formData.nickname.toLowerCase() === 'gun' &&
                formData.venue === 'Venetian Havana';

            if (foundMember || isDemoUser) {
                const userSession = foundMember || {
                    id: 999,
                    fullName: 'Muachamad Guntur Murdiansyah',
                    nickname: 'Gun',
                    venue: 'Venetian Havana',
                    position: 'Manager',
                    role: 'member'
                };

                localStorage.setItem('memberSession', JSON.stringify(userSession));
                router.push('/member/dashboard');
            } else {
                setError('Data tidak ditemukan. Pastikan nama, nama panggilan, dan penempatan benar.');
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block group">
                        <Image
                            src="/logo.png"
                            alt="Liguns Entertainment"
                            width={80}
                            height={80}
                            className="mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gold-200 to-gold-500 bg-clip-text text-transparent">
                        Member Access
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">Masuk untuk mengakses dashboard karyawan</p>
                </div>

                {/* Login Form */}
                <div className="glass p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-200 text-sm"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p>{error}</p>
                            </motion.div>
                        )}

                        {/* Nama Asli */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Nama Asli</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.realName}
                                    onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all font-medium"
                                    placeholder="Contoh: Muachamad Guntur"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5 ml-1">Cukup masukkan bagian nama yang unik (minimal 3 huruf)</p>
                        </div>

                        {/* Nama Panggilan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Nama Panggilan</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.nickname}
                                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all font-medium"
                                    placeholder="Contoh: Guntur"
                                />
                            </div>
                        </div>

                        {/* Penempatan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Penempatan (Venue)</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                <select
                                    required
                                    value={formData.venue}
                                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all font-medium appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-[#111] text-gray-500">Pilih Lokasi Kerja</option>
                                    {venues.map(v => (
                                        <option key={v} value={v} className="bg-[#111] text-white py-2">{v}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-500"></div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-gold-900/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Masuk Sekarang</span>
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Links */}
                <div className="text-center mt-8 space-y-4">
                    <p className="text-gray-400 text-sm">
                        Belum terdaftar sebagai karyawan?{' '}
                        <Link href="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                            Daftar di sini
                        </Link>
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                        <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
                        <Link href="/bantuan" className="hover:text-white transition-colors">Bantuan</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
