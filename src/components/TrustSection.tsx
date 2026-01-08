'use client';

import { motion } from 'framer-motion';
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
        <section className="py-20 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4"
                    >
                        <Award className="w-4 h-4 text-gold-500" />
                        <span className="text-sm text-muted-foreground">Kenapa Pilih Kami?</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                    >
                        Fasilitas <span className="text-gold-gradient">Premium</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto"
                    >
                        Kami berkomitmen memberikan yang terbaik untuk setiap talent yang bergabung
                    </motion.p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className={`glass h-full p-6 rounded-xl hover:scale-105 transition-all duration-300 border ${benefit.borderColor} hover:${benefit.bgColor}`}>
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-lg ${benefit.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-gold-500 transition-colors">
                                    {benefit.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground">
                                    {benefit.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <div className="glass-gold inline-block p-8 rounded-2xl">
                        <p className="text-lg text-muted-foreground mb-4">
                            Tertarik bergabung dengan kami?
                        </p>
                        <a
                            href="/lowongan"
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-gold-500/50"
                        >
                            <span>Mulai Karir Sekarang</span>
                            <Award className="w-5 h-5" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
