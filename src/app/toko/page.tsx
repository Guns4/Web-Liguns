'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
    Search,
    ShoppingBag,
    Heart,
    Star,
    Filter,
    ChevronDown,
    Sparkles,
    Tag,
    Truck,
    Shield,
    Clock,
    Gift
} from 'lucide-react';

// Product Categories
const categories = [
    { id: 'all', name: 'Semua Produk', icon: '✨' },
    { id: 'skincare', name: 'Skincare', icon: '🧴' },
    { id: 'makeup', name: 'Makeup', icon: '💄' },
    { id: 'bodycare', name: 'Body Care', icon: '🛁' },
    { id: 'haircare', name: 'Hair Care', icon: '💇‍♀️' },
    { id: 'parfum', name: 'Parfum', icon: '🌸' },
    { id: 'aksesoris', name: 'Aksesoris', icon: '💍' },
    { id: 'fashion', name: 'Fashion', icon: '👗' }
];

// Sample Products
const products = [
    {
        id: 1,
        name: 'Luxury Face Serum',
        category: 'skincare',
        price: 250000,
        originalPrice: 350000,
        discount: 29,
        rating: 4.8,
        reviews: 156,
        image: '/products/serum.jpg',
        badge: 'Best Seller',
        isNew: false
    },
    {
        id: 2,
        name: 'Matte Lipstick Premium',
        category: 'makeup',
        price: 150000,
        originalPrice: null,
        discount: 0,
        rating: 4.9,
        reviews: 203,
        image: '/products/lipstick.jpg',
        badge: null,
        isNew: true
    },
    {
        id: 3,
        name: 'Body Lotion Whitening',
        category: 'bodycare',
        price: 125000,
        originalPrice: 175000,
        discount: 28,
        rating: 4.7,
        reviews: 89,
        image: '/products/lotion.jpg',
        badge: 'Promo',
        isNew: false
    },
    {
        id: 4,
        name: 'Hair Vitamin Keratin',
        category: 'haircare',
        price: 85000,
        originalPrice: null,
        discount: 0,
        rating: 4.6,
        reviews: 67,
        image: '/products/hairvit.jpg',
        badge: null,
        isNew: true
    },
    {
        id: 5,
        name: 'Eau de Parfum Elegant',
        category: 'parfum',
        price: 450000,
        originalPrice: 600000,
        discount: 25,
        rating: 4.9,
        reviews: 234,
        image: '/products/parfum.jpg',
        badge: 'Limited',
        isNew: false
    },
    {
        id: 6,
        name: 'Gold Necklace Set',
        category: 'aksesoris',
        price: 320000,
        originalPrice: null,
        discount: 0,
        rating: 4.8,
        reviews: 45,
        image: '/products/necklace.jpg',
        badge: null,
        isNew: true
    },
    {
        id: 7,
        name: 'Night Cream Anti-Aging',
        category: 'skincare',
        price: 280000,
        originalPrice: 380000,
        discount: 26,
        rating: 4.7,
        reviews: 178,
        image: '/products/cream.jpg',
        badge: 'Hot',
        isNew: false
    },
    {
        id: 8,
        name: 'Elegant Dress Collection',
        category: 'fashion',
        price: 550000,
        originalPrice: 750000,
        discount: 27,
        rating: 4.9,
        reviews: 112,
        image: '/products/dress.jpg',
        badge: 'Exclusive',
        isNew: false
    },
    {
        id: 9,
        name: 'Eyeshadow Palette Pro',
        category: 'makeup',
        price: 275000,
        originalPrice: null,
        discount: 0,
        rating: 4.8,
        reviews: 156,
        image: '/products/eyeshadow.jpg',
        badge: null,
        isNew: true
    },
    {
        id: 10,
        name: 'Rose Body Scrub',
        category: 'bodycare',
        price: 95000,
        originalPrice: 130000,
        discount: 27,
        rating: 4.6,
        reviews: 78,
        image: '/products/scrub.jpg',
        badge: 'Promo',
        isNew: false
    },
    {
        id: 11,
        name: 'Silk Hair Mask',
        category: 'haircare',
        price: 120000,
        originalPrice: null,
        discount: 0,
        rating: 4.7,
        reviews: 92,
        image: '/products/hairmask.jpg',
        badge: null,
        isNew: false
    },
    {
        id: 12,
        name: 'Pearl Earrings Luxury',
        category: 'aksesoris',
        price: 185000,
        originalPrice: 250000,
        discount: 26,
        rating: 4.9,
        reviews: 67,
        image: '/products/earrings.jpg',
        badge: 'Best Seller',
        isNew: false
    }
];

// Features
const features = [
    { icon: Truck, title: 'Gratis Ongkir', desc: 'Min. belanja Rp 200rb' },
    { icon: Shield, title: '100% Original', desc: 'Produk asli bergaransi' },
    { icon: Clock, title: 'Fast Delivery', desc: 'Pengiriman 1-3 hari' },
    { icon: Gift, title: 'Bonus Menarik', desc: 'Setiap pembelian' }
];

// Format currency
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
};

// Product Card Component
function ProductCard({ product }: { product: typeof products[0] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group glass rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all duration-300"
        >
            {/* Product Image */}
            <div className="relative h-56 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                {/* Placeholder - replace with actual images */}
                <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gold-500/50" />
                </div>

                {/* Badges */}
                {product.badge && (
                    <span className="absolute top-3 left-3 bg-gold-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                        {product.badge}
                    </span>
                )}
                {product.isNew && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        NEW
                    </span>
                )}
                {product.discount > 0 && !product.badge && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        -{product.discount}%
                    </span>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold-500/20">
                    <Heart className="w-5 h-5 text-white" />
                </button>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-2.5 rounded-lg transition-all transform translate-y-4 group-hover:translate-y-0">
                        Lihat Detail
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
                <h3 className="font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors line-clamp-2">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-300">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gold-400">
                        {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button className="w-full mt-4 py-2.5 bg-white/5 hover:bg-gold-500 text-white hover:text-black font-semibold rounded-lg transition-all border border-white/10 hover:border-gold-500 flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Tambah ke Keranjang
                </button>
            </div>
        </motion.div>
    );
}

export default function TokoPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular');

    // Filter and search products
    const filteredProducts = useMemo(() => {
        let result = products;

        // Filter by category
        if (activeCategory !== 'all') {
            result = result.filter(p => p.category === activeCategory);
        }

        // Filter by search
        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        if (sortBy === 'price-low') {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
            result = [...result].sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [activeCategory, searchQuery, sortBy]);

    return (
        <main className="min-h-screen">
            {/* ===== Hero Banner ===== */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gold-500/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4" />
                            Exclusive Beauty Store
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            Toko Online <span className="text-gold-gradient">Wanita</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Temukan koleksi produk kecantikan dan fashion eksklusif untuk wanita modern. Produk original dengan harga terbaik.
                        </p>
                    </motion.div>

                    {/* Features Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {features.map((feature, index) => (
                            <div key={index} className="glass p-4 rounded-xl flex items-center gap-3">
                                <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center">
                                    <feature.icon className="w-5 h-5 text-gold-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white text-sm">{feature.title}</p>
                                    <p className="text-gray-400 text-xs">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ===== Main Content ===== */}
            <section className="pb-20">
                <div className="container-custom">
                    {/* Search and Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row gap-4 mb-8"
                    >
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50 transition-all"
                            />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none w-full md:w-48 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50 transition-all cursor-pointer"
                            >
                                <option value="popular">Terpopuler</option>
                                <option value="rating">Rating Tertinggi</option>
                                <option value="price-low">Harga Terendah</option>
                                <option value="price-high">Harga Tertinggi</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </motion.div>

                    {/* Category Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex overflow-x-auto gap-3 mb-10 pb-2 scrollbar-hide"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                        ? 'bg-gold-500 text-black'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </motion.div>

                    {/* Products Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredProducts.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-xl mb-4">
                                Produk tidak ditemukan
                            </p>
                            <button
                                onClick={() => {
                                    setActiveCategory('all');
                                    setSearchQuery('');
                                }}
                                className="bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                Lihat Semua Produk
                            </button>
                        </motion.div>
                    )}

                    {/* Load More */}
                    {filteredProducts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mt-12"
                        >
                            <button className="glass px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all inline-flex items-center gap-2">
                                Lihat Lebih Banyak
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ===== Promo Banner ===== */}
            <section className="py-16">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-gold p-10 rounded-2xl text-center"
                    >
                        <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Tag className="w-4 h-4" />
                            Special Offer
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Diskon Hingga <span className="text-gold-gradient">50%</span> untuk Member
                        </h2>
                        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                            Daftar sebagai member Liguns dan dapatkan akses eksklusif ke promo, diskon, dan produk terbaru.
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
                        >
                            <Sparkles className="w-5 h-5" />
                            Daftar Member Sekarang
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
