'use client';

import { motion } from 'motion/react';
import {
    Target,
    Compass,
    Shield,
    Sparkles,
    Users,
    Globe,
    Award,
    TrendingUp,
    Code,
    Palette
} from 'lucide-react';

// Misi items
const misiItems = [
    'Menyediakan lingkungan yang aman, modern, dan berkualitas bagi talent untuk berkembang secara profesional di industri hiburan.',
    'Membangun personal branding yang kuat dan elegan melalui pendekatan strategis yang berorientasi pada citra dan nilai jangka panjang.',
    'Menghadirkan layanan content creation dan management profesional untuk memastikan komunikasi brand yang konsisten, efektif, dan bernilai tinggi.',
    'Mengembangkan website, aplikasi, dan solusi digital terpadu guna mendukung branding, promosi, dan peningkatan efisiensi operasional bisnis.',
    'Menciptakan jaringan kemitraan yang luas dan berkelanjutan demi membuka kesempatan karier dan pertumbuhan bagi talent.',
    'Menjaga standar kualitas layanan yang tinggi melalui pelatihan profesional, evaluasi berkelanjutan, dan inovasi berbasis kebutuhan pasar.',
    'Membangun citra positif industri hiburan malam di Indonesia.'
];

// Layanan pendukung
const layananPendukung = [
    {
        icon: Palette,
        title: 'Personal Branding',
        description: 'Pengembangan personal branding yang kuat, elegan, dan berorientasi pada peningkatan citra profesional perusahaan maupun individu.'
    },
    {
        icon: Sparkles,
        title: 'Content Creation & Management',
        description: 'Layanan content creation dan content management yang dikelola secara strategis untuk memastikan konsistensi brand dan efektivitas komunikasi.'
    },
    {
        icon: Code,
        title: 'Solusi Digital',
        description: 'Pengembangan website, aplikasi, dan solusi digital terintegrasi sebagai sarana modern untuk mendukung branding dan transformasi digital bisnis.'
    }
];

export default function TentangPage() {
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
                            Tentang <span className="text-gold-gradient">Liguns Entertainment</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                            Agency profesional berbasis di Kota Bandung untuk industri hiburan malam
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ===== About Section ===== */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Siapa <span className="text-gold-gradient">Kami?</span>
                            </h2>

                            <p className="text-gray-300 leading-relaxed">
                                <strong className="text-white">Liguns Entertainment</strong> adalah agency profesional berbasis di Kota Bandung yang berfokus pada{' '}
                                <strong className="text-gold-400">penyaluran dan pengembangan karier wanita muda</strong> di industri hiburan malam seperti karaoke dan terapis spa.
                            </p>

                            <p className="text-gray-300 leading-relaxed">
                                Kami menghadirkan wadah yang <strong className="text-gold-400">aman, modern, dan elegan</strong> bagi para talent untuk berkembang dengan gaya dan tujuan.
                                Dengan sistem pelatihan profesional serta jaringan luas, kami membantu talent mencapai kesuksesan berkelanjutan.
                            </p>

                            <p className="text-gray-400">
                                Selain itu, kami juga menyediakan layanan pendukung yang dirancang untuk memperkuat identitas dan daya saing talent maupun mitra bisnis:
                            </p>
                        </motion.div>

                        {/* Visual/Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="glass-gold p-6 rounded-xl text-center">
                                <Users className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                                <div className="text-3xl font-bold text-white mb-1">500+</div>
                                <div className="text-gray-400 text-sm">Talent Aktif</div>
                            </div>
                            <div className="glass-gold p-6 rounded-xl text-center">
                                <Globe className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                                <div className="text-3xl font-bold text-white mb-1">10+</div>
                                <div className="text-gray-400 text-sm">Kota Partner</div>
                            </div>
                            <div className="glass-gold p-6 rounded-xl text-center">
                                <Award className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                                <div className="text-3xl font-bold text-white mb-1">50+</div>
                                <div className="text-gray-400 text-sm">Venue Premium</div>
                            </div>
                            <div className="glass-gold p-6 rounded-xl text-center">
                                <TrendingUp className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                                <div className="text-3xl font-bold text-white mb-1">5+</div>
                                <div className="text-gray-400 text-sm">Tahun Pengalaman</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== Layanan Pendukung Section ===== */}
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
                            Layanan <span className="text-gold-gradient">Pendukung</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {layananPendukung.map((layanan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass p-8 rounded-2xl text-center hover:scale-105 transition-all duration-300 group"
                            >
                                <div className="w-16 h-16 bg-gold-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-500/30 transition-colors">
                                    <layanan.icon className="w-8 h-8 text-gold-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{layanan.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{layanan.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== Visi & Misi Section ===== */}
            <section className="py-20">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Visi */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-gold p-10 rounded-2xl"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gold-500/20 rounded-xl flex items-center justify-center">
                                    <Target className="w-7 h-7 text-gold-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Visi</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                Menjadi agency profesional terdepan yang menghadirkan ekosistem pengembangan talent dan layanan digital modern yang elegan, aman, serta berstandar tinggi, guna menciptakan nilai dan reputasi berkelanjutan bagi talent maupun mitra bisnis.
                            </p>
                        </motion.div>

                        {/* Misi */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="glass p-10 rounded-2xl"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gold-500/20 rounded-xl flex items-center justify-center">
                                    <Compass className="w-7 h-7 text-gold-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Misi</h2>
                            </div>
                            <ul className="space-y-4">
                                {misiItems.map((misi, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-start gap-3"
                                    >
                                        <Shield className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300 text-sm leading-relaxed">{misi}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Bergabunglah Bersama <span className="text-gold-gradient">Kami</span>
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            Wujudkan karier profesional Anda di industri hiburan bersama Liguns Entertainment
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/register"
                                className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
                            >
                                Gabung Sekarang
                            </a>
                            <a
                                href="/lowongan"
                                className="inline-flex items-center justify-center gap-2 glass px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
                            >
                                Lihat Lowongan
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
