'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
    MapPin,
    Briefcase,
    Users,
    Calendar,
    DollarSign,
    ArrowLeft,
    Share2,
    Building2,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { getJobById, type Job } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJob();
    }, [params.id]);

    const loadJob = async () => {
        setLoading(true);
        try {
            const id = params.id as string;
            const data = await getJobById(id);

            if (!data) {
                notFound();
            }

            setJob(data);
        } catch (error) {
            console.error('Error loading job:', error);
            notFound();
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-gold-500 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-400 text-lg">Memuat detail lowongan...</p>
                </div>
            </main>
        );
    }

    if (!job) {
        return notFound();
    }

    // Parse facilities from JSONB
    const facilities = typeof job.facilities === 'object' && job.facilities !== null
        ? Object.entries(job.facilities as Record<string, any>)
            .filter(([_, value]) => value === true)
            .map(([key]) => key.replace(/_/g, ' '))
        : [];

    // Parse requirements and responsibilities (newline separated)
    const requirements = job.requirements?.split('\n').filter(r => r.trim()) || [];
    const responsibilities = job.responsibilities?.split('\n').filter(r => r.trim()) || [];

    return (
        <main className="min-h-screen pt-20 md:pt-24 pb-16 px-4 md:px-6 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-4 md:mb-6"
                >
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors text-sm md:text-base py-2"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Kembali ke Daftar Lowongan</span>
                        <span className="sm:hidden">Kembali</span>
                    </button>
                </motion.div>

                {/* Header Card with Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-gold rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-8"
                >
                    {/* Logo Section */}
                    <div className="bg-gradient-to-br from-gold-500/10 to-primary/5 p-4 md:p-8 border-b border-white/10">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                            {/* Logo */}
                            <div className="w-20 h-20 md:w-32 md:h-32 bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden border border-white/20 flex-shrink-0">
                                {job.logo_url ? (
                                    <img
                                        src={job.logo_url}
                                        alt={job.title}
                                        className="w-full h-full object-contain p-2 md:p-3"
                                    />
                                ) : (
                                    <Building2 className="w-12 h-12 md:w-16 md:h-16 text-gold-500/50" />
                                )}
                            </div>

                            {/* Title and Location */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-3 leading-tight">
                                    {job.title}
                                </h1>
                                <div className="flex flex-col sm:flex-row gap-2 md:gap-4 text-sm md:text-base text-gray-400">
                                    <div className="flex items-center gap-2 justify-center md:justify-start">
                                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gold-500" />
                                        <span>{job.city || job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-center md:justify-start">
                                        <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-gold-500" />
                                        <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-500 text-xs md:text-sm font-semibold">
                                            {job.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 p-4 md:p-6">
                        {/* Salary */}
                        {job.salary_display && (
                            <div className="glass p-3 md:p-4 rounded-lg md:rounded-xl">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <DollarSign className="w-5 h-5 text-gold-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-400">Gaji</p>
                                        <p className="font-semibold text-gold-500 text-sm md:text-base truncate">{job.salary_display}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Available Slots */}
                        <div className="glass p-3 md:p-4 rounded-lg md:rounded-xl">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Users className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-400">Slot Tersedia</p>
                                    <p className="font-semibold text-green-400 text-sm md:text-base">
                                        {job.slots_available - job.slots_filled} / {job.slots_available}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Deadline */}
                        {job.deadline && (
                            <div className="glass p-3 md:p-4 rounded-lg md:rounded-xl">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-5 h-5 text-red-400" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-400">Batas Waktu</p>
                                        <p className="font-semibold text-red-400 text-sm md:text-base">
                                            {new Date(job.deadline).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Job Description Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-xl md:rounded-2xl p-5 md:p-8 mb-4 md:mb-6"
                >
                    <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 md:mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 md:w-6 md:h-6" />
                        Deskripsi Pekerjaan
                    </h2>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {job.description}
                    </p>
                </motion.div>

                {/* Qualifications Section */}
                {requirements.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass rounded-xl md:rounded-2xl p-5 md:p-8 mb-4 md:mb-6"
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 md:mb-4">
                            Kualifikasi
                        </h2>
                        <ul className="space-y-2 md:space-y-3">
                            {requirements.map((req, index) => (
                                <li key={index} className="flex items-start gap-2 md:gap-3">
                                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm md:text-base">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Responsibilities Section */}
                {responsibilities.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="glass rounded-xl md:rounded-2xl p-5 md:p-8 mb-4 md:mb-6"
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 md:mb-4">
                            Tanggung Jawab
                        </h2>
                        <ul className="space-y-2 md:space-y-3">
                            {responsibilities.map((resp, index) => (
                                <li key={index} className="flex items-start gap-2 md:gap-3">
                                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm md:text-base">{resp}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Facilities Section */}
                {facilities.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass rounded-xl md:rounded-2xl p-5 md:p-8 mb-4 md:mb-6"
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-gold-500 mb-3 md:mb-4">
                            Fasilitas
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                            {facilities.map((facility, index) => (
                                <div key={index} className="flex items-center gap-2 md:gap-3 glass p-2.5 md:p-3 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-gold-500 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm md:text-base capitalize">{facility}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons - Fixed at bottom on mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:flex gap-3 md:gap-4"
                >
                    <Link
                        href="/register"
                        className="col-span-2 md:flex-1 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-black font-bold py-4 px-6 md:px-8 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-center text-sm md:text-base touch-manipulation"
                    >
                        Lamar Sekarang
                    </Link>
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: job.title,
                                    text: job.description,
                                    url: window.location.href
                                });
                            }
                        }}
                        className="col-span-2 md:col-span-1 glass hover:glass-gold active:bg-white/10 px-6 md:px-8 py-4 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm md:text-base touch-manipulation"
                    >
                        <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                        Bagikan
                    </button>
                </motion.div>
            </div>
        </main>
    );
}
