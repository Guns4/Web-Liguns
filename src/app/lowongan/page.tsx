'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Search,
    Filter,
    MapPin,
    Clock,
    DollarSign,
    Users,
    ArrowRight,
    Star,
    Briefcase,
} from 'lucide-react';
import Link from 'next/link';

// Mock data - Nanti akan diganti dengan data dari Supabase
const jobListings = [
    {
        id: 1,
        title: 'Ladies Karaoke Premium',
        company: 'Starlight Entertainment',
        location: 'Jakarta Selatan',
        salary: 'Rp 6.000.000 - Rp 12.000.000',
        type: 'Full Time',
        category: 'karaoke',
        experience: 'Fresh Graduate',
        slots: 5,
        rating: 4.8,
        featured: true,
        description:
            'Dicari ladies karaoke dengan penampilan menarik dan kepribadian ramah untuk melayani tamu VIP.',
    },
    {
        id: 2,
        title: 'Terapis Spa Professional',
        company: 'Luxury Spa & Wellness',
        location: 'Jakarta Pusat',
        salary: 'Rp 5.000.000 - Rp 10.000.000',
        type: 'Full Time',
        category: 'spa',
        experience: '1-2 tahun',
        slots: 8,
        rating: 4.9,
        featured: true,
        description:
            'Membutuhkan terapis spa berpengalaman dengan sertifikat untuk spa eksklusif.',
    },
    {
        id: 3,
        title: 'Hostess Premium Club',
        company: 'Elite Night Club',
        location: 'Jakarta Barat',
        salary: 'Rp 7.000.000 - Rp 15.000.000',
        type: 'Full Time',
        category: 'hostess',
        experience: 'Fresh Graduate',
        slots: 3,
        rating: 4.7,
        featured: false,
        description:
            'Hostess untuk melayani tamu exclusive club dengan benefit menarik dan bonus performa.',
    },
    {
        id: 4,
        title: 'Entertainer Show',
        company: 'Grand Entertainment',
        location: 'Jakarta Utara',
        salary: 'Rp 5.500.000 - Rp 13.000.000',
        type: 'Part Time',
        category: 'entertainer',
        experience: 'Fresh Graduate',
        slots: 10,
        rating: 4.6,
        featured: false,
        description: 'Entertainer untuk acara dan event dengan jadwal fleksibel.',
    },
    {
        id: 5,
        title: 'Ladies Karaoke VIP',
        company: 'Diamond Karaoke Lounge',
        location: 'Tangerang',
        salary: 'Rp 6.500.000 - Rp 14.000.000',
        type: 'Full Time',
        category: 'karaoke',
        experience: 'Fresh Graduate',
        slots: 6,
        rating: 4.8,
        featured: true,
        description:
            'Kesempatan bergabung dengan karaoke lounge terkenal dengan benefit lengkap.',
    },
    {
        id: 6,
        title: 'Spa Therapist Senior',
        company: 'Serenity Spa Resort',
        location: 'Bekasi',
        salary: 'Rp 5.500.000 - Rp 11.000.000',
        type: 'Full Time',
        category: 'spa',
        experience: '2-3 tahun',
        slots: 4,
        rating: 4.9,
        featured: false,
        description: 'Spa therapist berpengalaman untuk resort spa terkemuka.',
    },
];

const categories = [
    { id: 'all', label: 'Semua Kategori', count: jobListings.length },
    {
        id: 'karaoke',
        label: 'Ladies Karaoke',
        count: jobListings.filter((j) => j.category === 'karaoke').length,
    },
    {
        id: 'spa',
        label: 'Terapis Spa',
        count: jobListings.filter((j) => j.category === 'spa').length,
    },
    {
        id: 'hostess',
        label: 'Hostess',
        count: jobListings.filter((j) => j.category === 'hostess').length,
    },
    {
        id: 'entertainer',
        label: 'Entertainer',
        count: jobListings.filter((j) => j.category === 'entertainer').length,
    },
];

export default function LowonganPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');

    // Filter jobs based on search and filters
    const filteredJobs = jobListings.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === 'all' || job.category === selectedCategory;
        const matchesLocation =
            selectedLocation === 'all' || job.location.includes(selectedLocation);

        return matchesSearch && matchesCategory && matchesLocation;
    });

    // Sort to show featured first
    const sortedJobs = [...filteredJobs].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
    });

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="heading-primary mb-4">Lowongan Kerja Tersedia</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Temukan pekerjaan impian Anda dengan gaji kompetitif dan benefit
                        menarik
                    </p>
                </motion.div>

                {/* Search & Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="glass-card p-6 mb-12"
                >
                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari pekerjaan atau perusahaan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-premium pl-12"
                            />
                        </div>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="input-premium md:w-64"
                        >
                            <option value="all">Semua Lokasi</option>
                            <option value="Jakarta Selatan">Jakarta Selatan</option>
                            <option value="Jakarta Pusat">Jakarta Pusat</option>
                            <option value="Jakarta Barat">Jakarta Barat</option>
                            <option value="Jakarta Utara">Jakarta Utara</option>
                            <option value="Tangerang">Tangerang</option>
                            <option value="Bekasi">Bekasi</option>
                        </select>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category.id
                                    ? 'bg-primary-500 text-white shadow-lg'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                            >
                                {category.label}
                                <span className="ml-2 text-sm opacity-75">
                                    ({category.count})
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-400">
                        Menampilkan <span className="text-white font-semibold">{sortedJobs.length}</span> lowongan
                    </p>
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                        <Filter className="w-5 h-5" />
                        <span>Urutkan</span>
                    </button>
                </div>

                {/* Job Listings */}
                <div className="space-y-6">
                    {sortedJobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`glass-card-hover p-6 ${job.featured ? 'border-2 border-primary-500/50' : ''
                                }`}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                {/* Job Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            {job.featured && (
                                                <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-semibold rounded-full mb-2">
                                                    ⭐ Featured
                                                </span>
                                            )}
                                            <h3 className="text-2xl font-bold text-white mb-2 hover:text-primary-400 transition-colors">
                                                <Link href={`/lowongan/${job.id}`}>{job.title}</Link>
                                            </h3>
                                            <p className="text-primary-400 font-semibold mb-3">
                                                {job.company}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 mb-4 line-clamp-2">
                                        {job.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center space-x-2 text-gray-400">
                                            <MapPin className="w-4 h-4 text-primary-400" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-400">
                                            <Clock className="w-4 h-4 text-primary-400" />
                                            <span>{job.type}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-400">
                                            <Briefcase className="w-4 h-4 text-primary-400" />
                                            <span>{job.experience}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-400">
                                            <Users className="w-4 h-4 text-primary-400" />
                                            <span>{job.slots} posisi tersedia</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-400">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span>{job.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Salary & CTA */}
                                <div className="lg:text-right space-y-4">
                                    <div>
                                        <div className="flex items-center lg:justify-end space-x-2 mb-2">
                                            <DollarSign className="w-5 h-5 text-green-400" />
                                            <span className="text-gray-400 text-sm">
                                                Gaji per bulan:
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-green-400">
                                            {job.salary}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/lowongan/${job.id}`}
                                        className="btn-primary inline-flex items-center space-x-2 w-full lg:w-auto justify-center"
                                    >
                                        <span>Lihat Detail</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {sortedJobs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Tidak ada lowongan ditemukan
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Coba ubah filter atau kata kunci pencarian Anda
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                                setSelectedLocation('all');
                            }}
                            className="btn-secondary"
                        >
                            Reset Filter
                        </button>
                    </motion.div>
                )}

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-8 text-center mt-16"
                >
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Tidak Menemukan Lowongan yang Cocok?
                    </h3>
                    <p className="text-gray-400 mb-6">
                        Daftarkan diri Anda dan kami akan mencarikan pekerjaan terbaik untuk
                        Anda
                    </p>
                    <Link href="/register" className="btn-primary">
                        Daftar Sekarang
                        <ArrowRight className="inline-block ml-2 w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
