'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
    Shield,
    Rocket,
    Handshake,
    Lightbulb,
    Star,
    Lock,
    MessageCircle,
    Trophy,
    ChevronDown,
    ArrowRight,
    Briefcase,
    Users
} from 'lucide-react';

// FAQ Data
const faqData = [
    {
        question: 'Apakah Liguns hanya untuk wanita?',
        answer: 'Saat ini, fokus utama kami adalah penyaluran dan pengembangan karier wanita di industri hiburan malam. Namun, kami terbuka untuk kolaborasi dan peluang lain di masa depan.'
    },
    {
        question: 'Bagaimana cara mendaftar menjadi talent?',
        answer: 'Klik tombol "Gabung Sekarang" di halaman utama atau kunjungi halaman Gabung. Isi formulir dan tim kami akan menghubungi Anda untuk proses selanjutnya.'
    },
    {
        question: 'Apakah data saya aman dan privasi terjaga?',
        answer: 'Kami sangat menjaga privasi dan keamanan data seluruh talent dan partner. Data Anda tidak akan dibagikan tanpa izin.'
    },
    {
        question: 'Apakah ada biaya pendaftaran?',
        answer: 'Tidak ada biaya pendaftaran untuk menjadi talent di Liguns. Semua proses gratis dan transparan.'
    }
];

// Why Choose Us Data
const whyChooseData = [
    {
        icon: Shield,
        title: 'Keamanan & Kenyamanan',
        description: 'Lingkungan kerja yang aman, support system solid, dan privasi terjaga untuk semua talent.'
    },
    {
        icon: Rocket,
        title: 'Pengembangan Karier',
        description: 'Pelatihan, mentoring, dan peluang naik level karier di industri hiburan malam.'
    },
    {
        icon: Handshake,
        title: 'Jaringan Luas',
        description: 'Koneksi ke banyak venue ternama dan peluang kerja di berbagai kota besar Indonesia.'
    },
    {
        icon: Lightbulb,
        title: 'Personal Branding',
        description: 'Bantuan membangun citra profesional dan exposure di media sosial.'
    }
];

// Trust Badges Data
const trustBadges = [
    { icon: Star, label: 'Reputasi Terbukti' },
    { icon: Lock, label: 'Privasi Terjaga' },
    { icon: MessageCircle, label: 'Support 24/7' },
    { icon: Trophy, label: 'Partner Venue Premium' }
];

// FAQ Item Component
function FAQItem({ question, answer, isOpen, onClick }: {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-semibold text-white pr-4">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-gold-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="p-5 pt-0 text-gray-400">
                    {answer}
                </div>
            </motion.div>
        </div>
    );
}

export default function HomePage() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    return (
        <main className="min-h-screen">
            {/* ===== Hero Section ===== */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                {/* Animated Background Shapes */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute top-40 right-20 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gold-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                <div className="container-custom relative z-10 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Hero Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left"
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                Membangun Karier{' '}
                                <span className="text-gold-gradient">Profesional</span> di Industri Hiburan Malam
                            </h1>
                            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                                Liguns Entertainment adalah agency profesional berbasis di Kota Bandung yang
                                menghadirkan wadah aman, modern, dan elegan untuk penyaluran dan pengembangan
                                karier wanita muda di karaoke dan Terapis Spa. Kami juga menyediakan layanan
                                social media management & content creation.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gold-500/30"
                                >
                                    <Users className="w-5 h-5" />
                                    Gabung Sekarang
                                </Link>
                                <Link
                                    href="/lowongan"
                                    className="inline-flex items-center justify-center gap-2 glass px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                                >
                                    <Briefcase className="w-5 h-5" />
                                    Lihat Lowongan
                                </Link>
                            </div>
                        </motion.div>

                        {/* Hero Visual - Logo with glow effect */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="hidden lg:flex items-center justify-center"
                        >
                            <div className="relative">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gold-500/20 blur-[80px] rounded-full scale-150" />
                                <Image
                                    src="/logo.png"
                                    alt="Liguns Entertainment"
                                    width={400}
                                    height={400}
                                    className="relative z-10 drop-shadow-2xl"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== Why Choose Us Section ===== */}
            <section className="py-20 relative">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Kenapa Pilih <span className="text-gold-gradient">Liguns?</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Kami berkomitmen memberikan yang terbaik untuk setiap talent yang bergabung
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyChooseData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-gold p-6 rounded-xl hover:scale-105 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-gold-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold-500/30 transition-colors">
                                    <item.icon className="w-7 h-7 text-gold-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Trust Badges Section ===== */}
            <section className="py-16 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />
                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Dipercaya oleh Banyak <span className="text-gold-gradient">Talent & Venue</span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {trustBadges.map((badge, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass p-6 rounded-xl text-center hover:bg-white/10 transition-all duration-300"
                            >
                                <badge.icon className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                                <p className="font-medium text-white">{badge.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA Section ===== */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-gold p-12 rounded-2xl text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Temukan Peluang & Bangun{' '}
                            <span className="text-gold-gradient">Kariermu</span> Bersama Liguns
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/lowongan"
                                className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
                            >
                                <Briefcase className="w-5 h-5" />
                                Cari Lowongan
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-2 glass px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                            >
                                <Users className="w-5 h-5" />
                                Gabung Talent
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== FAQ Section ===== */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Pertanyaan yang Sering <span className="text-gold-gradient">Diajukan</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Temukan jawaban atas pertanyaan umum tentang Liguns Entertainment
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqData.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <FAQItem
                                    question={faq.question}
                                    answer={faq.answer}
                                    isOpen={openFAQ === index}
                                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Final CTA ===== */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-transparent to-gold-500/10" />
                <div className="container-custom relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-xl text-gray-400 mb-6">
                            Siap memulai perjalanan karier Anda?
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gold-500/40 text-lg"
                        >
                            <span>Daftar Sekarang</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
