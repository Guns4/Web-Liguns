'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
    Search,
    MapPin,
    Briefcase,
    Building2,
    Clock,
    Loader2
} from 'lucide-react';
import { getActiveVenues, type Venue } from '@/lib/venues';

// Placeholder cities (coming soon)
const placeholderCities = [
    { name: 'Jakarta', city: 'jakarta' },
    { name: 'Surabaya', city: 'surabaya' },
    { name: 'Yogyakarta', city: 'lainnya' }
];

// Filter buttons - we'll dynamically add available cities
const baseFilterOptions = [
    { label: 'Semua', value: 'all' },
];

export default function LowonganPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);

    // Load venues from database
    useEffect(() => {
        loadVenues();
    }, []);

    const loadVenues = async () => {
        setLoading(true);
        try {
            const data = await getActiveVenues();
            setVenues(data);
        } catch (error) {
            console.error('Error loading venues:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique cities from venues
    const filterOptions = useMemo(() => {
        const uniqueCities = Array.from(new Set(venues.map(v => v.city)));
        const cityOptions = uniqueCities.map(city => ({
            label: city,
            value: city.toLowerCase()
        }));

        return [
            ...baseFilterOptions,
            ...cityOptions,
            { label: 'Kota Lainnya', value: 'lainnya' }
        ];
    }, [venues]);

    // Filter and search venues
    const filteredVenues = useMemo(() => {
        return venues.filter(venue => {
            const matchesFilter = activeFilter === 'all' || venue.city.toLowerCase() === activeFilter;
            const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                venue.position.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [venues, searchQuery, activeFilter]);

    // Show placeholder cities based on filter
    const showPlaceholders = activeFilter === 'all' ||
        activeFilter === 'jakarta' ||
        activeFilter === 'surabaya' ||
        activeFilter === 'lainnya';

    const filteredPlaceholders = placeholderCities.filter(p => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'lainnya') return p.city === 'lainnya';
        return p.city === activeFilter;
    });

    const resetFilters = () => {
        setSearchQuery('');
        setActiveFilter('all');
    };

    const noResults = filteredVenues.length === 0 &&
        (activeFilter === 'bandung' || !showPlaceholders || filteredPlaceholders.length === 0);

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Lowongan Kerja <span className="text-gold-gradient">Tersedia</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Bergabunglah dengan tim profesional kami di berbagai kota di Indonesia
                    </p>
                </motion.div>

                {/* Search & Filter Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10"
                >
                    {/* Search Box */}
                    <div className="relative max-w-xl mx-auto mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari lowongan atau kota..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20 transition-all"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setActiveFilter(option.value)}
                                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${activeFilter === option.value
                                    ? 'bg-gold-500 text-black'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="glass rounded-xl p-16 text-center">
                        <Loader2 className="w-16 h-16 text-gold-500 mx-auto mb-4 animate-spin" />
                        <p className="text-gray-400 text-lg">Memuat lowongan kerja tersedia...</p>
                    </div>
                ) : (
                    <>
                        {/* Job Cards Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Actual Venues */}
                            {filteredVenues.map((venue, index) => (
                                <motion.div
                                    key={venue.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative glass rounded-xl overflow-hidden hover:border-gold-500/30 transition-all duration-300"
                                >
                                    {/* Featured Badge */}
                                    {venue.featured && (
                                        <div className="absolute top-3 left-3 z-10 bg-gold-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                                            Featured
                                        </div>
                                    )}

                                    {/* Card Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                                        {venue.image_url ? (
                                            <img src={venue.image_url} alt={venue.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center">
                                                <Building2 className="w-12 h-12 text-gold-500/50" />
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <Link
                                                href={`/lowongan/${venue.slug || venue.id}`}
                                                className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-2.5 rounded-lg transition-all transform translate-y-4 group-hover:translate-y-0"
                                            >
                                                Lihat Detail
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
                                            {venue.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                            <MapPin className="w-4 h-4 text-gold-500" />
                                            <span>Kota {venue.city}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                                            <Briefcase className="w-4 h-4 text-gold-500" />
                                            <span>{venue.position}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Placeholder Cities (Coming Soon) */}
                            {showPlaceholders && filteredPlaceholders.map((placeholder, index) => (
                                <motion.div
                                    key={placeholder.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (filteredVenues.length + index) * 0.05 }}
                                    className="relative glass rounded-xl overflow-hidden opacity-70"
                                >
                                    {/* Card Image Placeholder */}
                                    <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
                                        <span className="text-5xl mb-2">🏙️</span>
                                        <span className="bg-gold-500/20 text-gold-400 text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Segera Hadir
                                        </span>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            {placeholder.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                            <MapPin className="w-4 h-4 text-gold-500" />
                                            <span>Kota {placeholder.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Briefcase className="w-4 h-4" />
                                            <span>Posisi tersedia</span>
                                        </div>
                                        <p className="text-gray-500 text-xs mt-3">
                                            Lowongan kerja di {placeholder.name} akan segera tersedia
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* No Results Message */}
                        {noResults && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <p className="text-gray-400 text-xl mb-4">
                                    😔 Tidak ada lowongan yang sesuai dengan pencarian Anda
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-3 rounded-xl transition-all"
                                >
                                    Bersihkan Filter
                                </button>
                            </motion.div>
                        )}

                        {/* CTA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-16 glass-gold p-10 rounded-2xl text-center"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                Tidak menemukan posisi yang cocok?
                            </h2>
                            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                                Daftarkan diri Anda dan kami akan menghubungi ketika ada lowongan yang sesuai dengan profil Anda.
                            </p>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
                            >
                                Daftar Sekarang
                            </Link>
                        </motion.div>
                    </>
                )}
            </div>
        </main>
    );
}
