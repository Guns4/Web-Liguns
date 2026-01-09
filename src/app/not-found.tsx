'use client';

import { motion } from 'motion/react';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl"
            >
                {/* 404 Number */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <h1 className="text-[150px] md:text-[200px] font-black bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent leading-none mb-4">
                        404
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-1 w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                        <Search className="w-6 h-6 text-purple-400" />
                        <div className="h-1 w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                    </div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-gray-400 text-lg mb-2">
                        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                    </p>
                    <p className="text-gray-500">
                        Mungkin URL salah atau halaman sudah tidak tersedia lagi.
                    </p>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Kembali
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-purple-900/30 group"
                    >
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Halaman Utama
                    </Link>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Quick Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 pt-8 border-t border-white/10"
                >
                    <p className="text-gray-500 text-sm mb-4">Mungkin Anda mencari:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/member/dashboard"
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-all"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/member/profile"
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-all"
                        >
                            Profil
                        </Link>
                        <Link
                            href="/member/salary"
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-all"
                        >
                            Gaji
                        </Link>
                        <Link
                            href="/member/settings"
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-all"
                        >
                            Pengaturan
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
