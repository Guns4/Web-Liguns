'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { User, Phone, MapPin, Building2, Briefcase, ChevronRight, AlertCircle, CheckCircle, Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ProfileInsert } from '@/lib/database.types';

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

const positions = [
    'Ladies Karaoke (LC)',
    'Terapis Spa',
    'Hostess',
    'Waitress',
    'Admin/Staff',
    'Security'
];

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        nickname: '',
        phone: '',
        position: '',
        venue: ''
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.email || !formData.password || !formData.fullName || !formData.nickname || !formData.venue || !formData.position) {
            setError('Mohon lengkapi semua data wajib.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Format email tidak valid.');
            return;
        }

        // Password validation
        if (formData.password.length < 6) {
            setError('Password minimal 6 karakter.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Password dan konfirmasi password tidak cocok.');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        nickname: formData.nickname,
                    }
                }
            });

            if (signUpError) {
                // Handle specific errors
                if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
                    setError('Email sudah terdaftar. Silakan gunakan email lain atau login.');
                } else if (signUpError.message.includes('Password')) {
                    setError('Password terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol.');
                } else {
                    setError(signUpError.message);
                }
                return;
            }

            if (!authData.user) {
                setError('Gagal membuat akun. Silakan coba lagi.');
                return;
            }

            // 2. Create profile in database
            const profileData: ProfileInsert = {
                id: authData.user.id,
                email: formData.email,
                full_name: formData.fullName,
                role: 'talent' as 'talent', // Default role for new registration
                phone: formData.phone || null,
                // Store nickname, position, dan venue di bio untuk sementara
                bio: `Nickname: ${formData.nickname} | Posisi: ${formData.position} | Venue: ${formData.venue}`,
                status: 'interview' as 'interview', // Default status
            };

            const { error: profileError } = await supabase
                .from('profiles')
                .insert(profileData);

            if (profileError) {
                console.error('Error creating profile:', profileError);

                // Profile creation failed, but auth user was created
                setError('Akun berhasil dibuat, tetapi gagal menyimpan profil. Silakan hubungi admin.');
                return;
            }

            // 3. Success!
            setSuccess('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi. Mengalihkan ke halaman login...');

            // Redirect after delay
            setTimeout(() => {
                router.push('/login');
            }, 2500);

        } catch (err: any) {
            console.error('Registration error:', err);
            setError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black py-10">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg p-6 relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        <Image
                            src="/logo.png"
                            alt="Liguns Entertainment"
                            width={70}
                            height={70}
                            className="mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        Bergabung Tim Liguns
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">Isi formulir di bawah untuk mendaftar sebagai karyawan</p>
                </div>

                {/* Register Form */}
                <div className="glass p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <form onSubmit={handleRegister} className="space-y-5">
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
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-3 text-green-200 text-sm"
                            >
                                <CheckCircle className="w-4 h-4 shrink-0" />
                                <p>{success}</p>
                            </motion.div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Email *</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all font-medium"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Password *</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all font-medium"
                                        placeholder="Min. 6 karakter"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Konfirmasi Password *</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all font-medium"
                                        placeholder="Ulangi password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Nama Lengkap */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Nama Lengkap (Sesuai KTP) *</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all font-medium"
                                    placeholder="Contoh: Muachamad Guntur Murdiansyah"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Nama Panggilan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Nama Panggilan *</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.nickname}
                                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all font-medium"
                                        placeholder="Cth: Guntur"
                                    />
                                </div>
                            </div>

                            {/* Nomor HP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">No. WhatsApp</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all font-medium"
                                        placeholder="0812..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Posisi & Penempatan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Posisi / Role *</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                    <select
                                        required
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-[#111] text-gray-500">Pilih Posisi</option>
                                        {positions.map(p => (
                                            <option key={p} value={p} className="bg-[#111] text-white py-2">{p}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-500"></div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">Penempatan *</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-500 transition-colors" />
                                    <select
                                        required
                                        value={formData.venue}
                                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50 focus:bg-white/10 transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-[#111] text-gray-500">Pilih Venue</option>
                                        {venues.map(v => (
                                            <option key={v} value={v} className="bg-[#111] text-white py-2">{v}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-gray-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Text */}
                        <p className="text-xs text-gray-500 mt-2">
                            * Email akan digunakan untuk login dan verifikasi akun Anda
                        </p>

                        <button
                            type="submit"
                            disabled={isLoading || !!success}
                            className="w-full bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-gold-900/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : success ? (
                                <>
                                    <span>Berhasil Mendaftar</span>
                                    <CheckCircle className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    <span>Daftar Sekarang</span>
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Links */}
                <div className="text-center mt-8 space-y-4">
                    <p className="text-gray-400 text-sm">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
