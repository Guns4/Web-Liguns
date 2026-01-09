'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ShoppingBag,
    Search,
    Filter,
    ShoppingCart,
    X,
    Loader2,
    AlertCircle,
    Package,
    CheckCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface StoreItem {
    id: string;
    name: string;
    category: string;
    description: string | null;
    price: number;
    image_url: string | null;
    stock: number;
}

const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'pulsa', name: 'Pulsa' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'makeup', name: 'Makeup' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'other', name: 'Lainnya' },
];

const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export default function MemberStorePage() {
    const { profile } = useAuth();
    const [products, setProducts] = useState<StoreItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<StoreItem | null>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('store_items')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setProducts(data as StoreItem[]);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleBuyClick = (product: StoreItem) => {
        setSelectedProduct(product);
        setQuantity(1);
    };

    const handlePurchase = async () => {
        if (!profile?.id || !selectedProduct) return;

        if (selectedProduct.stock < quantity) {
            alert('Stok tidak mencukupi!');
            return;
        }

        setIsPurchasing(true);
        try {
            const totalPrice = Number(selectedProduct.price) * quantity;

            // Insert purchase record
            const { error: purchaseError } = await supabase
                .from('store_purchases')
                .insert({
                    user_id: profile.id,
                    item_id: selectedProduct.id,
                    quantity: quantity,
                    unit_price: selectedProduct.price,
                    total_price: totalPrice,
                    status: 'pending'
                });

            if (purchaseError) throw purchaseError;

            // Reduce stock
            const { error: stockError } = await supabase
                .from('store_items')
                .update({ stock: selectedProduct.stock - quantity })
                .eq('id', selectedProduct.id);

            if (stockError) throw stockError;

            alert(`Berhasil membeli ${selectedProduct.name}!\n\nTotal: ${formatRupiah(totalPrice)}\n\nPesanan Anda sedang diproses. Potongan akan diterapkan di gaji bulan ini.`);

            setSelectedProduct(null);
            loadProducts(); // Reload to update stock
        } catch (error: any) {
            console.error('Error purchasing:', error);
            alert('Gagal melakukan pembelian: ' + error.message);
        } finally {
            setIsPurchasing(false);
        }
    };

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2">
                    🛍️ Toko Internal
                </h1>
                <p className="text-gray-400 text-lg">Belanja produk dengan potongan gaji</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Info Box */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3"
            >
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                    <p className="font-semibold mb-1">Informasi Pembayaran</p>
                    <p className="text-blue-300/80">
                        Pembelian akan dipotong dari gaji bulan ini. Status pesanan dapat dilihat di admin. Pastikan stok tersedia sebelum membeli.
                    </p>
                </div>
            </motion.div>

            {/* Products Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Tidak ada produk ditemukan</p>
                    <p className="text-gray-500 text-sm mt-2">Coba ubah filter atau kata kunci pencarian</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20"
                        >
                            {/* Product Image */}
                            <div className="relative h-48 bg-white/5 overflow-hidden">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ShoppingBag className="w-16 h-16 text-gray-600" />
                                    </div>
                                )}

                                {/* Stock Badge */}
                                {product.stock === 0 ? (
                                    <div className="absolute top-3 right-3 px-3 py-1 bg-red-500/90 text-white text-xs font-bold rounded-lg">
                                        Habis
                                    </div>
                                ) : product.stock < 10 ? (
                                    <div className="absolute top-3 right-3 px-3 py-1 bg-orange-500/90 text-white text-xs font-bold rounded-lg">
                                        Stok: {product.stock}
                                    </div>
                                ) : null}

                                {/* Category Badge */}
                                <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-lg capitalize">
                                    {product.category}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-5">
                                <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                                    {product.name}
                                </h3>

                                {product.description && (
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between mt-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Harga</p>
                                        <p className="text-xl font-black text-purple-400">
                                            {formatRupiah(Number(product.price))}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleBuyClick(product)}
                                        disabled={product.stock === 0}
                                        className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${product.stock === 0
                                                ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                                                : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-900/30 hover:scale-105'
                                            }`}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Beli
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Purchase Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/20 rounded-3xl p-8 w-full max-w-md"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-white">Konfirmasi Pembelian</h2>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    disabled={isPurchasing}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="mb-6">
                                {selectedProduct.image_url && (
                                    <img
                                        src={selectedProduct.image_url}
                                        alt={selectedProduct.name}
                                        className="w-full h-40 object-cover rounded-xl mb-4"
                                    />
                                )}
                                <h3 className="text-xl font-bold text-white mb-2">{selectedProduct.name}</h3>
                                <p className="text-purple-400 text-2xl font-black mb-4">
                                    {formatRupiah(Number(selectedProduct.price))}
                                </p>
                                {selectedProduct.description && (
                                    <p className="text-gray-400 text-sm">
                                        {selectedProduct.description}
                                    </p>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-3">Jumlah</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={isPurchasing}
                                        className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(selectedProduct.stock, parseInt(e.target.value) || 1)))}
                                        disabled={isPurchasing}
                                        className="flex-1 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl py-3 text-white focus:outline-none focus:border-purple-500/50"
                                        min="1"
                                        max={selectedProduct.stock}
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                                        disabled={isPurchasing}
                                        className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-gray-500 text-sm mt-2">Stok tersedia: {selectedProduct.stock}</p>
                            </div>

                            {/* Total */}
                            <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                                <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                                    <span>Harga satuan:</span>
                                    <span>{formatRupiah(Number(selectedProduct.price))}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                                    <span>Jumlah:</span>
                                    <span>{quantity}x</span>
                                </div>
                                <div className="border-t border-white/10 my-3"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-white font-bold">Total:</span>
                                    <span className="text-2xl font-black text-purple-400">
                                        {formatRupiah(Number(selectedProduct.price) * quantity)}
                                    </span>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                                <p className="text-orange-300 text-sm">
                                    Pembelian ini akan dipotong dari gaji bulan ini. Pastikan saldo gaji Anda mencukupi.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    disabled={isPurchasing}
                                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handlePurchase}
                                    disabled={isPurchasing}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white font-bold px-6 py-4 rounded-xl transition-all disabled:opacity-50 shadow-xl shadow-purple-900/30"
                                >
                                    {isPurchasing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Memproses...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Konfirmasi Beli</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
