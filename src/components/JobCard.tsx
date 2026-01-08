'use client';

import { motion } from 'framer-motion';
import { MapPin, DollarSign, Users, ArrowRight, Briefcase } from 'lucide-react';
import Link from 'next/link';
import type { Job } from '@/lib/supabase';

interface JobCardProps {
    job: Job;
    index?: number;
}

const categoryIcons: Record<string, any> = {
    'LC': Briefcase,
    'Spa': Users,
    'Model': Users,
    'Entertainer': Users,
    'Other': Briefcase,
};

const categoryColors: Record<string, string> = {
    'LC': 'bg-gold-500/20 text-gold-500 border-gold-500/30',
    'Spa': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Model': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Entertainer': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Other': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function JobCard({ job, index = 0 }: JobCardProps) {
    const CategoryIcon = categoryIcons[job.category] || Briefcase;
    const categoryColor = categoryColors[job.category] || categoryColors['Other'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <Link href={`/jobs/${job.id}`}>
                <div className="glass-gold h-full rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/20">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gold-500/10 to-primary/5">
                        {job.image_url ? (
                            <img
                                src={job.image_url}
                                alt={job.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <CategoryIcon className="w-16 h-16 text-gold-500/30" />
                            </div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute top-3 right-3">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${categoryColor}`}>
                                <CategoryIcon className="w-3 h-3" />
                                {job.category}
                            </span>
                        </div>

                        {/* Slots Badge */}
                        {job.slots_available > 0 && (
                            <div className="absolute top-3 left-3">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-green-500/20 text-green-400 border border-green-500/30">
                                    <Users className="w-3 h-3" />
                                    {job.slots_available - job.slots_filled} Slot
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-gold-500 transition-colors line-clamp-2">
                            {job.title}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-muted-foreground mb-3">
                            <MapPin className="w-4 h-4 text-gold-500" />
                            <span className="text-sm">{job.city || job.location}</span>
                        </div>

                        {/* Salary */}
                        {job.salary_display && (
                            <div className="glass px-3 py-2 rounded-lg mb-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-gold-500" />
                                    <span className="text-sm font-semibold text-gold-500">
                                        {job.salary_display}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Description Preview */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {job.description}
                        </p>

                        {/* Facilities */}
                        {job.facilities && typeof job.facilities === 'object' && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {Object.entries(job.facilities as Record<string, any>)
                                    .filter(([_, value]) => value === true)
                                    .slice(0, 3)
                                    .map(([key]) => (
                                        <span
                                            key={key}
                                            className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                                        >
                                            {key.replace(/_/g, ' ')}
                                        </span>
                                    ))}
                            </div>
                        )}

                        {/* CTA Button */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="text-sm text-muted-foreground">
                                {job.is_active ? 'Aktif' : 'Ditutup'}
                            </span>
                            <div className="flex items-center gap-2 text-gold-500 font-semibold group-hover:gap-3 transition-all">
                                <span className="text-sm">Lihat Detail</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
