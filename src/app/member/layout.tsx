'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
    LayoutDashboard,
    Calendar,
    Wallet,
    User,
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { profile, signOut, isLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive Sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
                setIsMobile(true);
            } else {
                setIsSidebarOpen(true);
                setIsMobile(false);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            await signOut();
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

    const navItems = [
        { href: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/member/schedule', label: 'Jadwal Saya', icon: Calendar },
        { href: '/member/salary', label: 'Gaji & Komisi', icon: Wallet },
        { href: '/member/profile', label: 'Profil', icon: User },
    ];

    // Show loading or prevent flash
    if (isLoading || !profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#030303] via-[#050505] to-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#030303] via-[#050505] to-[#0a0a0a] text-white flex">
            {/* Sidebar Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 300 : 0 }}
                className={`fixed lg:relative z-40 h-screen backdrop-blur-2xl bg-gradient-to-b from-[#0f0f0f]/95 to-[#0a0a0a]/95 border-r border-white/10 overflow-hidden flex flex-col shadow-2xl ${isMobile && !isSidebarOpen ? 'hidden' : 'block'
                    }`}
            >
                {/* Logo Section - Enhanced */}
                <div className="p-8 flex items-center gap-4 border-b border-white/5">
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-2 backdrop-blur-sm border border-purple-500/20">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div className="whitespace-nowrap overflow-hidden">
                        <h1 className="font-bold text-xl bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent">
                            Member Area
                        </h1>
                        <p className="text-xs text-gray-400 font-medium tracking-wide">Employee Portal</p>
                    </div>
                </div>

                {/* User Info & Venue - Enhanced */}
                <div className="px-6 py-6">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/20 backdrop-blur-sm relative overflow-hidden group hover:border-purple-400/30 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 blur-2xl rounded-full group-hover:bg-purple-500/20 transition-all" />
                        <p className="text-xs text-purple-300/70 mb-2 font-semibold tracking-wider uppercase">Lokasi Kerja</p>
                        <p className="font-bold text-base text-purple-100 truncate relative z-10">{getVenue()}</p>
                    </div>
                </div>

                {/* Navigation - Enhanced */}
                <nav className="flex-1 px-5 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 whitespace-nowrap group relative overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-xl shadow-purple-900/50 scale-[1.02]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 hover:scale-[1.01]'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon className={`w-5 h-5 min-w-[20px] relative z-10 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-purple-300'} transition-colors`} />
                                <span className="font-semibold text-sm relative z-10">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button - Enhanced */}
                <div className="p-5 border-t border-white/10 bg-gradient-to-t from-[#0a0a0a] to-transparent">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-red-500/20 group"
                    >
                        <LogOut className="w-5 h-5 min-w-[20px] group-hover:rotate-12 transition-transform" />
                        <span className="font-semibold text-sm whitespace-nowrap">Keluar</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header - Enhanced */}
                <header className="h-20 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-2xl sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10 shadow-xl">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-3 -ml-2 text-gray-400 hover:text-white lg:hidden rounded-lg hover:bg-white/5 transition-all"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <div className="flex items-center gap-5 ml-auto">
                        {/* Notification Bell */}
                        <button className="relative p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all group">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>

                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white mb-0.5">{getNickname()}</p>
                                <p className="text-xs text-gray-400 font-medium capitalize">{profile.role}</p>
                            </div>
                            {profile.profile_photo ? (
                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xl shadow-purple-900/40 border-2 border-white/10 hover:scale-105 transition-transform cursor-pointer">
                                    <Image
                                        src={profile.profile_photo}
                                        alt={profile.full_name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-purple-900/40 border-2 border-white/10 hover:scale-105 transition-transform cursor-pointer">
                                    {getNickname().charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area - Enhanced */}
                <div className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/90 z-30 lg:hidden backdrop-blur-md"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
