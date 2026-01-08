'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
    Mic2,
    GraduationCap,
    Smartphone,
    Award,
    Shield,
    Clock,
    Globe,
    DollarSign,
    BarChart3,
    Check,
    ArrowRight,
    MessageCircle,
    FileSearch,
    Cog,
    TrendingUp
} from 'lucide-react';

// Services Data
const services = [
    {
        icon: Mic2,
        title: 'Penyaluran Tenaga Kerja',
        description: 'Kami membantu menyalurkan tenaga kerja profesional dan berkualitas untuk ladies karaoke, terapis spa, dan sektor hiburan lainnya dengan standar keamanan tinggi.',
        link: '/lowongan',
        linkText: 'Lihat Peluang'
    },
    {
        icon: GraduationCap,
        title: 'Pelatihan Profesional',
        description: 'Program pelatihan komprehensif mencakup grooming, komunikasi, etika kerja, dan soft skills untuk meningkatkan kepercayaan diri dan profesionalisme talent.',
        link: '/register',
        linkText: 'Daftar Program'
    },
    {
        icon: Smartphone,
        title: 'Manajemen Sosial Media',
        description: 'Membantu membangun personal branding melalui pengelolaan konten profesional, strategi digital, dan exposure di media sosial yang efektif.',
        link: '/register',
        linkText: 'Lihat Detail'
    }
];

// Benefits Data
const benefits = [
    {
        icon: Award,
        number: 1,
        title: 'Profesional Bersertifikat',
        description: 'Tim kami terdiri dari profesional berpengalaman dan terlatih di industri hiburan dengan track record terbukti.'
    },
    {
        icon: Shield,
        number: 2,
        title: 'Keamanan Terjamin',
        description: 'Kami menjamin keamanan dan privasi semua klien dan talent dengan sistem keamanan berlapis yang ketat.'
    },
    {
        icon: Clock,
        number: 3,
        title: 'Support 24/7',
        description: 'Tim support responsif kami siap membantu Anda kapan saja melalui berbagai channel komunikasi modern.'
    },
    {
        icon: Globe,
        number: 4,
        title: 'Jaringan Luas',
        description: 'Akses ke jaringan partner venue premium dan klien di berbagai kota besar Indonesia yang strategis.'
    },
    {
        icon: DollarSign,
        number: 5,
        title: 'Harga Kompetitif',
        description: 'Paket layanan dengan harga terjangkau dan sistem pembayaran yang fleksibel sesuai kebutuhan Anda.'
    },
    {
        icon: BarChart3,
        number: 6,
        title: 'Hasil Terukur',
        description: 'Tracking progress real-time dan reporting transparan untuk setiap layanan yang digunakan secara detail.'
    }
];

// Process Steps Data
const processSteps = [
    {
        icon: MessageCircle,
        number: 1,
        title: 'Konsultasi Awal',
        description: 'Hubungi kami untuk diskusi tentang kebutuhan dan tujuan Anda. Gratis dan tanpa komitmen.'
    },
    {
        icon: FileSearch,
        number: 2,
        title: 'Assessment & Perencanaan',
        description: 'Kami melakukan analisis mendalam dan membuat rencana strategi khusus untuk Anda.'
    },
    {
        icon: Cog,
        number: 3,
        title: 'Implementasi Layanan',
        description: 'Eksekusi strategi dengan timeline dan milestone yang jelas dan terukur.'
    },
    {
        icon: TrendingUp,
        number: 4,
        title: 'Monitoring & Evaluasi',
        description: 'Tracking progress regular dan adjustments untuk hasil optimal sesuai target.'
    }
];

// Pricing Packages Data
const pricingPackages = [
    {
        badge: 'Basic',
        name: 'Paket Starter',
        description: 'Untuk yang baru memulai',
        price: 'Hubungi',
        featured: false,
        features: [
            'Konsultasi awal gratis',
            '1 layanan pilihan',
            'Support email',
            'Durasi 1 bulan'
        ]
    },
    {
        badge: 'Popular',
        name: 'Paket Profesional',
        description: 'Solusi lengkap untuk bisnis',
        price: 'Hubungi',
        featured: true,
        features: [
            'Semua di Paket Starter',
            '2-3 layanan pilihan',
            'Priority support',
            'Durasi 3 bulan',
            'Monthly reporting'
        ]
    },
    {
        badge: 'Premium',
        name: 'Paket Enterprise',
        description: 'Untuk kebutuhan khusus',
        price: 'Customized',
        featured: false,
        features: [
            'Semua di Paket Profesional',
            'Semua layanan unlimited',
            'Dedicated account manager',
            'Durasi custom',
            'Real-time dashboard'
        ]
    }
];

export default function LayananPage() {
    return (
        <main className="min-h-screen">
            {/* ===== Hero Section ===== */}
            <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gold-500/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="container-custom relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Layanan <span className="text-gold-gradient">Profesional</span> Kami
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                            Berbagai solusi bisnis terpadu untuk mengembangkan karier dan personal branding di industri hiburan malam modern
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ===== Services Section ===== */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Layanan Unggulan <span className="text-gold-gradient">Liguns</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Kami menyediakan solusi profesional yang dirancang khusus untuk kebutuhan bisnis Anda
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-gold p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 group"
                            >
                                <div className="w-20 h-20 bg-gold-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-500/30 transition-colors">
                                    <service.icon className="w-10 h-10 text-gold-500" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-4">{service.title}</h3>
                                <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                                <Link
                                    href={service.link}
                                    className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold transition-colors"
                                >
                                    {service.linkText}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Benefits Section ===== */}
            <section className="py-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />
                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Keuntungan Menggunakan <span className="text-gold-gradient">Layanan Kami</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Bergabunglah dengan ribuan klien yang puas dengan layanan profesional kami
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass p-6 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gold-500/20 rounded-xl flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
                                            <benefit.icon className="w-7 h-7 text-gold-500" />
                                        </div>
                                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-gold-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                                            {benefit.number}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Process Section ===== */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Bagaimana Cara <span className="text-gold-gradient">Bekerja Dengan Kami</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Proses sederhana dan transparan untuk memulai perjalanan Anda bersama Liguns
                        </p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="flex flex-col md:flex-row items-center"
                            >
                                <div className="glass-gold p-6 rounded-xl text-center w-64 hover:scale-105 transition-all duration-300">
                                    <div className="w-12 h-12 bg-gold-500 text-black font-bold text-xl rounded-full flex items-center justify-center mx-auto mb-4">
                                        {step.number}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                                    <p className="text-gray-400 text-sm">{step.description}</p>
                                </div>
                                {index < processSteps.length - 1 && (
                                    <div className="hidden md:block text-gold-500 text-3xl mx-4">→</div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Pricing Section ===== */}
            <section className="py-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/5 to-transparent" />
                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Paket Layanan & <span className="text-gold-gradient">Harga</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Pilih paket yang sesuai dengan kebutuhan bisnis Anda
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingPackages.map((pkg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative rounded-2xl p-8 ${pkg.featured
                                        ? 'glass-gold border-2 border-gold-500/50 scale-105'
                                        : 'glass'
                                    }`}
                            >
                                <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${pkg.featured
                                        ? 'bg-gold-500 text-black'
                                        : 'bg-white/10 text-gray-300'
                                    }`}>
                                    {pkg.badge}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                                <p className="text-gray-400 mb-4">{pkg.description}</p>
                                <div className="text-3xl font-bold text-gold-400 mb-6">{pkg.price}</div>

                                <ul className="space-y-3 mb-8">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-300">
                                            <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/register"
                                    className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${pkg.featured
                                            ? 'bg-gold-500 hover:bg-gold-600 text-black'
                                            : 'bg-white/10 hover:bg-white/20 text-white'
                                        }`}
                                >
                                    {pkg.featured ? 'Pilih Paket' : 'Mulai Sekarang'}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-gray-400 mt-8"
                    >
                        💡 Semua paket mendapatkan diskon spesial dan penawaran custom. Hubungi tim sales kami untuk informasi lebih lanjut.
                    </motion.p>
                </div>
            </section>

            {/* ===== Final CTA Section ===== */}
            <section className="py-20">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-gold p-12 rounded-2xl text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Siap Memulai Perjalanan <span className="text-gold-gradient">Sukses</span> Anda?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            Hubungi tim kami hari ini untuk konsultasi gratis dan temukan solusi terbaik untuk kebutuhan Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
                            >
                                Hubungi Kami
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 glass px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
                            >
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
