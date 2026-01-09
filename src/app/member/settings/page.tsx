'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Shield,
    Lock,
    Key,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Loader2,
    LogOut,
    User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function MemberSettingsPage() {
    const { profile, signOut } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'security'>('security');

    // Password change state
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const validatePassword = (): boolean => {
        setPasswordError(null);

        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordError('Semua field harus diisi');
            return false;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Password minimal 6 karakter');
            return false;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Konfirmasi password tidak cocok');
            return false;
        }

        return true;
    };

    const handleChangePassword = async () => {
        if (!validatePassword()) return;

        setIsChangingPassword(true);
        try {
            // Update password using Supabase Auth
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) throw error;

            // Show success toast
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-slide-in';
            toast.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="font-semibold">Password berhasil diubah! Silakan login kembali.</span>';
            document.body.appendChild(toast);

            // Wait 2 seconds then logout
            setTimeout(async () => {
                toast.remove();
                await signOut();
                router.push('/login');
            }, 2000);

        } catch (error: any) {
            console.error('Error changing password:', error);
            setPasswordError(error.message || 'Gagal mengubah password');

            // Show error toast
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2';
            toast.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg><span class="font-semibold">Gagal: ${error.message}</span>`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } finally {
            setIsChangingPassword(false);
        }
    };

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
            <div>
                <h1 className="text-4xl font-black text-white mb-2">
                    ⚙️ Pengaturan
                </h1>
                <p className="text-gray-400 text-lg">Kelola keamanan dan preferensi akun Anda</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('security')}
                    className={`px-6 py-3 font-semibold transition-all relative ${activeTab === 'security'
                        ? 'text-purple-400'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Keamanan
                    </div>
                    {activeTab === 'security' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                        />
                    )}
                </button>
            </div>

            {/* Security Tab Content */}
            {activeTab === 'security' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Change Password Card */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Lock className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Ubah Password</h2>
                                <p className="text-gray-400 text-sm">Perbarui password untuk keamanan akun Anda</p>
                            </div>
                        </div>

                        <div className="space-y-6 max-w-xl">
                            {/* New Password */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <Key className="w-4 h-4" />
                                    Password Baru
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => {
                                            setPasswordData({ ...passwordData, newPassword: e.target.value });
                                            setPasswordError(null);
                                        }}
                                        className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                                        placeholder="Minimal 6 karakter"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {passwordData.newPassword && (
                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                        {passwordData.newPassword.length >= 6 ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className="text-green-400">Panjang password sudah sesuai</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                                                <span className="text-yellow-400">
                                                    {6 - passwordData.newPassword.length} karakter lagi
                                                </span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <Lock className="w-4 h-4" />
                                    Konfirmasi Password Baru
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => {
                                            setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                                            setPasswordError(null);
                                        }}
                                        className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                                        placeholder="Ketik ulang password baru"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {passwordData.confirmPassword && (
                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                        {passwordData.newPassword === passwordData.confirmPassword ? (
                                            <>
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span className="text-green-400">Password cocok</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-4 h-4 text-red-400" />
                                                <span className="text-red-400">Password tidak cocok</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Error Message */}
                            {passwordError && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-red-400 text-sm font-medium">{passwordError}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                onClick={handleChangePassword}
                                disabled={isChangingPassword}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold px-6 py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-900/30"
                            >
                                {isChangingPassword ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Mengubah Password...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        <span>Ubah Password</span>
                                    </>
                                )}
                            </button>

                            {/* Info */}
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-300">
                                    <p className="font-semibold mb-1">Informasi Penting</p>
                                    <ul className="text-blue-300/80 space-y-1">
                                        <li>• Password harus minimal 6 karakter</li>
                                        <li>• Anda akan otomatis logout setelah password berhasil diubah</li>
                                        <li>• Gunakan password yang kuat dan unik</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Info Card */}
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Informasi Akun</h2>
                                <p className="text-gray-400 text-sm">Detail keamanan akun Anda</p>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-xl">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Email</p>
                                    <p className="text-white font-semibold">{profile.email}</p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Nama Lengkap</p>
                                    <p className="text-white font-semibold">{profile.full_name}</p>
                                </div>
                                <User className="w-5 h-5 text-purple-400" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Bergabung Sejak</p>
                                    <p className="text-white font-semibold">
                                        {new Date(profile.join_date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-purple-400" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
