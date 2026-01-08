'use client';

import { motion } from 'motion/react';
import { Home, Sparkles, Shield, Banknote, Award, Users, Clock, Heart } from 'lucide-react';

const benefits = [
    {
        icon: Home,
        title: 'Mess Gratis',
        description: 'Tempat tinggal nyaman dan aman untuk semua talent aktif',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
    },
    {
        icon: Sparkles,
        title: 'Make-up Artist',
        description: 'Tim profesional siap bantu tampilan terbaik setiap hari',
        color: 'text-pink-400',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/30',
    },
    {
        icon: Shield,
        title: 'Keamanan 24/7',
        description: 'Security terlatih menjaga keamanan talent setiap saat',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
    },
    {
        icon: Banknote,
        title: 'Gaji Harian',
        description: 'Sistem voucher harian yang transparan dan kompetitif',
        color: 'text-gold-500',
        bgColor: 'bg-gold-500/10',
        borderColor: 'border-gold-500/30',
    },
    {
        icon: Award,
        title: 'Program Bonus',
        description: 'Reward bulanan untuk talent dengan performa terbaik',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
    },
    {
        icon: Users,
        title: 'Komunitas Solid',
        description: 'Bergabung dengan ratusan talent profesional se-Indonesia',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/30',
    },
    {
        icon: Clock,
        title: 'Jadwal Fleksibel',
        description: 'Atur jadwal kerja sesuai dengan kebutuhan pribadi',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
    },
    {
        icon: Heart,
        title: 'Asuransi Kesehatan',
        description: 'Perlindungan kesehatan untuk talent dan keluarga',
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30',
    },
];

export default function TrustSection() {
    return (
        <section className="py-24 lg:py-32 relative overflow-hidden">
            {/* Enhanced Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.08),transparent_50%)]" />

            <div className="relative z-10 container mx-auto px-6 sm:px-8 lg:px-12">
                {/* Header - Enhanced */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full mb-6 border border-gold-500/20"
                    >
                        <Award className="w-5 h-5 text-gold-500" />
                        <span className="text-sm font-semibold text-muted-foreground tracking-wide">Kenapa Pilih Kami?</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6"
                    >
                        Fasilitas <span className="text-gold-gradient">Premium</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed"
                    >
                        Kami berkomitmen memberikan yang terbaik untuk setiap talent yang bergabung
                    </motion.p>
                </div>

                {/* Benefits Grid - Enhanced */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group"
                        >
                            <div className={`glass h-full p-8 rounded-2xl transition-all duration-500 border-2 ${benefit.borderColor} hover:border-opacity-60 hover:shadow-2xl hover:shadow-${benefit.color}/20 relative overflow-hidden`}>
                                {/* Hover Glow Effect */}
                                <div className={`absolute top-0 right-0 w-32 h-32 ${benefit.bgColor} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full`} />

                                {/* Icon - Enhanced */}
                                <div className={`w-16 h-16 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10 border ${benefit.borderColor}`}>
                                    <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                                </div>

                                {/* Title - Enhanced */}
                                <h3 className="text-xl font-black text-foreground mb-3 group-hover:text-gold-500 transition-colors relative z-10">
                                    {benefit.title}
                                </h3>

                                {/* Description - Enhanced */}
                                <p className="text-base text-muted-foreground leading-relaxed relative z-10 font-medium">
                                    {benefit.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-24"
                >
                    <div className="glass-gold inline-block p-10 rounded-3xl border-2 border-gold-500/30 shadow-2xl shadow-gold-500/20 relative overflow-hidden group">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 via-gold-400/5 to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <p className="text-xl text-muted-foreground mb-6 font-semibold relative z-10">
                            Tertarik bergabung dengan kami?
                        </p>
                        <motion.a
                            href="/lowongan"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-gold-500/50 transition-all duration-300 relative z-10 border-2 border-gold-500/30"
                        >
                            <span>Mulai Karir Sekarang</span>
                            <Award className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
