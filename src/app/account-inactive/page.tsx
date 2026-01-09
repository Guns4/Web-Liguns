'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { UserX, Mail, Home, LogOut } from 'lucide-react'
import { motion } from 'motion/react'

export default function AccountInactivePage() {
    const { profile, signOut } = useAuth()

    const handleLogout = async () => {
        await signOut()
        window.location.href = '/'
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full"
            >
                {/* Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
                        <div className="relative bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-full">
                            <UserX className="w-16 h-16 text-white" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-3">
                        Akun Tidak Aktif
                    </h1>
                    <p className="text-gray-400 mb-4">
                        Akun Anda saat ini berstatus <span className="text-yellow-400 font-semibold">tidak aktif</span>.
                        Silakan hubungi administrator untuk mengaktifkan kembali akun Anda.
                    </p>
                </div>

                {/* Account Info */}
                {profile && (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Nama</span>
                                <span className="text-white text-sm font-medium">{profile.full_name}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Email</span>
                                <span className="text-white text-sm font-medium">{profile.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">Status</span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                    Inactive
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Information */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Hubungi Administrator
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                        Untuk mengaktifkan kembali akun Anda, silakan hubungi:
                    </p>
                    <div className="space-y-1 text-sm">
                        <p className="text-gray-300">
                            📧 Email: <a href="mailto:admin@liguns.com" className="text-blue-400 hover:underline">admin@liguns.com</a>
                        </p>
                        <p className="text-gray-300">
                            📱 WhatsApp: <a href="https://wa.me/6281234567890" className="text-blue-400 hover:underline">+62 812-3456-7890</a>
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3 px-4 rounded-lg border border-white/10 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        <span>Kembali ke Beranda</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-3 px-4 rounded-lg border border-red-500/20 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        Akun akan diaktifkan setelah verifikasi oleh tim administrator
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
