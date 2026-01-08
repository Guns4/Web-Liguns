'use client';

import Link from 'next/link';
import {
    Sparkles,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        perusahaan: [
            { label: 'Tentang Kami', href: '/tentang' },
            { label: 'Layanan', href: '/layanan' },
            { label: 'Karir', href: '/karir' },
            { label: 'Blog', href: '/blog' },
        ],
        lowongan: [
            { label: 'Ladies Karaoke', href: '/lowongan?kategori=karaoke' },
            { label: 'Terapis Spa', href: '/lowongan?kategori=spa' },
            { label: 'Hostess', href: '/lowongan?kategori=hostess' },
            { label: 'Entertainer', href: '/lowongan?kategori=entertainer' },
        ],
        bantuan: [
            { label: 'FAQ', href: '/faq' },
            { label: 'Syarat & Ketentuan', href: '/terms' },
            { label: 'Kebijakan Privasi', href: '/privacy' },
            { label: 'Hubungi Kami', href: '/contact' },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
    ];

    return (
        <footer className="footer-premium">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center space-x-3 mb-6 group">
                            <div className="relative">
                                <Sparkles className="w-10 h-10 text-primary-500 group-hover:text-primary-400 transition-colors" />
                                <div className="absolute inset-0 bg-primary-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                            </div>
                            <span className="text-2xl font-bold gradient-text">
                                Liguns Entertain
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Platform terpercaya yang menghubungkan pencari kerja dengan
                            perusahaan hiburan malam terkemuka di Indonesia. Wujudkan karir
                            impian Anda bersama kami.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-gray-400">
                                <Mail className="w-5 h-5 text-primary-500" />
                                <span>info@liguns-entertain.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <Phone className="w-5 h-5 text-primary-500" />
                                <span>+62 812-3456-7890</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-primary-500" />
                                <span>Jakarta, Indonesia</span>
                            </div>
                        </div>
                    </div>

                    {/* Perusahaan Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">
                            Perusahaan
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.perusahaan.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary-400 transition-colors inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Lowongan Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">
                            Lowongan
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.lowongan.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary-400 transition-colors inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Bantuan Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-6">Bantuan</h3>
                        <ul className="space-y-3">
                            {footerLinks.bantuan.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-primary-400 transition-colors inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Social Media & Copyright */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Social Media */}
                        <div className="flex items-center space-x-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 flex items-center justify-center glass-card hover:bg-primary-500/20 transition-all group"
                                >
                                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
                                </motion.a>
                            ))}
                        </div>

                        {/* Copyright */}
                        <div className="text-gray-400 text-sm text-center md:text-right">
                            <p>
                                © {currentYear}{' '}
                                <span className="text-primary-400 font-semibold">
                                    Liguns Entertain
                                </span>
                                . All rights reserved.
                            </p>
                            <p className="mt-1">
                                Crafted with{' '}
                                <span className="text-red-500 animate-pulse">❤️</span> for your
                                success
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
