'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    Briefcase,
    ShoppingBag,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';

// Sidebar menu items
const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Briefcase, label: 'Lowongan Kerja', href: '/admin/lowongan' },
    { icon: ShoppingBag, label: 'Produk Toko', href: '/admin/produk' },
    { icon: FileText, label: 'Konten Website', href: '/admin/konten' },
    { icon: Settings, label: 'Pengaturan', href: '/admin/settings' },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check login status
    useEffect(() => {
        const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
        setIsLoading(false);

        // If not logged in and not on login page, redirect
        if (!loggedIn && pathname !== '/admin') {
            router.push('/admin');
        }
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        router.push('/admin');
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
            </div>
        );
    }

    // If on login page, just render children
    if (pathname === '/admin') {
        return <>{children}</>;
    }

    // If not logged in, don't render anything (will redirect)
    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex">
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-[#111111] border-r border-white/10 transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-3">
                        <Image
                            src="/logo.png"
                            alt="Liguns"
                            width={40}
                            height={40}
                        />
                        {isSidebarOpen && (
                            <span className="font-bold text-white">Admin Panel</span>
                        )}
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-gold-500 text-black'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111111] border-b border-white/10 z-50 flex items-center justify-between px-4">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Liguns" width={32} height={32} />
                    <span className="font-bold text-white">Admin</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-white/5 rounded-lg"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Menu className="w-6 h-6 text-white" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/80 z-40" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute left-0 top-16 bottom-0 w-64 bg-[#111111] border-r border-white/10 p-4" onClick={e => e.stopPropagation()}>
                        <nav className="space-y-2">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                ? 'bg-gold-500 text-black'
                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} pt-16 lg:pt-0`}>
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
