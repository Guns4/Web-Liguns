'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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

export default function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [member, setMember] = useState<any>(null);

    // Auth Check
    useEffect(() => {
        const checkAuth = () => {
            const session = localStorage.getItem('memberSession');
            if (!session) {
                router.push('/login');
            } else {
                setMember(JSON.parse(session));
            }
        };
        checkAuth();

        // Responsive Sidebar
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
    }, [router]);

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('memberSession');
            router.push('/login');
        }
    };

    const navItems = [
        { href: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/member/schedule', label: 'Jadwal Saya', icon: Calendar },
        { href: '/member/salary', label: 'Gaji & Komisi', icon: Wallet },
        { href: '/member/profile', label: 'Profil', icon: User },
    ];

    if (!member) return null; // Prevent flash of content

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 0 }}
                className={`fixed lg:relative z-40 h-screen bg-[#0a0a0a] border-r border-white/5 overflow-hidden flex flex-col ${isMobile && !isSidebarOpen ? 'hidden' : 'block'
                    }`}
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="whitespace-nowrap overflow-hidden">
                        <h1 className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Member Area
                        </h1>
                        <p className="text-xs text-gray-500">Employee Portal</p>
                    </div>
                </div>

                {/* User Info & Venue */}
                <div className="px-6 mb-6">
                    <div className="p-4 rounded-xl bg-purple-900/10 border border-purple-500/10">
                        <p className="text-xs text-gray-400 mb-1">Lokasi Kerja</p>
                        <p className="font-semibold text-purple-200 truncate">{member.venue}</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${isActive
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className="w-5 h-5 min-w-[20px]" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5 min-w-[20px]" />
                        <span className="font-medium whitespace-nowrap">Keluar</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Header Mobile Auth Toggle */}
                <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 -ml-2 text-gray-400 hover:text-white lg:hidden"
                    >
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">{member.nickname}</p>
                            <p className="text-xs text-gray-500">{member.position}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-900/30">
                            {member.nickname?.charAt(0) || 'U'}
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
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
                        className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
