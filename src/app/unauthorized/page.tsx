'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'

export default function UnauthorizedPage() {
    const searchParams = useSearchParams()
    const reason = searchParams.get('reason')

    const getMessage = () => {
        switch (reason) {
            case 'admin_only':
                return {
                    title: 'Akses Ditolak',
                    description: 'Halaman ini hanya dapat diakses oleh Administrator. Anda tidak memiliki izin yang diperlukan.',
                    suggestion: 'Silakan hubungi administrator jika Anda memerlukan akses.'
                }
            default:
                return {
                    title: 'Tidak Diizinkan',
                    description: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
                    suggestion: 'Pastikan Anda sudah login dengan akun yang benar.'
                }
        }
    }

    const message = getMessage()

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
                        <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full"></div>
                        <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-full">
                            <ShieldAlert className="w-16 h-16 text-white" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-3">
                        {message.title}
                    </h1>
                    <p className="text-gray-400 mb-2">
                        {message.description}
                    </p>
                    <p className="text-sm text-gray-500">
                        {message.suggestion}
                    </p>
                </div>

                {/* Error Code */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Kode Error</span>
                        <span className="text-red-400 font-mono text-sm">403 - FORBIDDEN</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        href="/member"
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Home className="w-5 h-5" />
                        <span>Kembali ke Dashboard</span>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3 px-4 rounded-lg border border-white/10 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Kembali ke Halaman Sebelumnya</span>
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Butuh bantuan?{' '}
                        <Link href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">
                            Hubungi Support
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
