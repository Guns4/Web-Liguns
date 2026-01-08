'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Mail,
    Phone,
    MapPin,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
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
        ],
        bantuan: [
            { label: 'FAQ', href: '/faq' },
            { label: 'Syarat & Ketentuan', href: '/terms' },
            { label: 'Kebijakan Privasi', href: '/privacy' },
            { label: 'Hubungi Kami', href: '/contact' },
        ],
    };

    const socialLinks = [
        { icon: '/icon-instagram.png', href: 'https://instagram.com/ligunsofficial', label: 'Instagram' },
        { icon: '/icon-whatsapp.png', href: 'https://wa.me/6281234567890', label: 'WhatsApp' },
        { icon: '/icon-tiktok.png', href: 'https://tiktok.com/@ligunsofficial', label: 'TikTok' },
    ];

    return (
        <footer className="footer-premium">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section - Logo, Contact, Social */}
                    <div>
                        <Link href="/" className="inline-block mb-4 group">
                            <Image
                                src="/logo.png"
                                alt="Liguns Entertainment"
                                width={50}
                                height={50}
                                className="group-hover:scale-105 transition-transform duration-300"
                            />
                        </Link>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <Mail className="w-4 h-4 text-gold-500" />
                                <span>info@liguns-entertain.com</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <Phone className="w-4 h-4 text-gold-500" />
                                <span>+62 812-3456-7890</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <MapPin className="w-4 h-4 text-gold-500" />
                                <span>Bandung, Indonesia</span>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="flex items-center space-x-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="block"
                                >
                                    <Image
                                        src={social.icon}
                                        alt={social.label}
                                        width={28}
                                        height={28}
                                        className="hover:opacity-80 transition-opacity"
                                    />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Perusahaan Links */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-4">Perusahaan</h3>
                        <ul className="space-y-2">
                            {footerLinks.perusahaan.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-gold-400 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Lowongan Links */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-4">Lowongan</h3>
                        <ul className="space-y-2">
                            {footerLinks.lowongan.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-gold-400 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Bantuan Links */}
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-4">Bantuan</h3>
                        <ul className="space-y-2">
                            {footerLinks.bantuan.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-gold-400 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright - Centered */}
                <div className="mt-10 pt-6 border-t border-white/10">
                    <p className="text-gray-400 text-sm text-center">
                        © 2026 Liguns Entertainment. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
