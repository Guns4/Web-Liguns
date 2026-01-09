'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ShoppingBag,
    X,
    Save,
    Loader2,
    Image as ImageIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface StoreItem {
    id: string;
    name: string;
    category: string;
    description: string | null;
    price: number;
    image_url: string | null;
    stock: number;
    is_active: boolean;
}

const categories = [
    { id: 'pulsa', name: 'Pulsa' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'makeup', name: 'Makeup' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'other', name: 'Other' },
];

// Format currency
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
};

export default function ProdukManagement() {
    const [products, setProducts] = useState<StoreItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'pulsa',
        description: '',
        price: 0,
        stock: 0,
        image_url: '',
        is_active: true
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('store_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setProducts(data as StoreItem[]);
        } catch (error) {
            console.error('Error loading products:', error);
            alert('Gagal memuat data produk');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter products
    const filteredProducts = products.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Open modal
    const openModal = (item?: StoreItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                category: item.category,
                description: item.description || '',
                price: Number(item.price),
                stock: item.stock,
                image_url: item.image_url || '',
                is_active: item.is_active
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                category: 'pulsa',
                description: '',
                price: 0,
                stock: 0,
                image_url: '',
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    // Save product
    const handleSave = async () => {
        if (!formData.name || formData.price <= 0) {
            alert('Nama dan harga produk harus diisi!');
            return;
        }

        setIsSaving(true);
        try {
            if (editingItem) {
                // Update existing product
                const { error } = await supabase
                    .from('store_items')
                    .update({
                        name: formData.name,
                        category: formData.category,
                        description: formData.description || null,
                        price: formData.price,
                        stock: formData.stock,
                        image_url: formData.image_url || null,
                        is_active: formData.is_active
                    })
                    .eq('id', editingItem.id);

                if (error) throw error;

                alert('Produk berhasil diupdate!');
            } else {
                // Insert new product
                const { error } = await supabase
                    .from('store_items')
                    .insert({
                        name: formData.name,
                        category: formData.category,
                        description: formData.description || null,
                        price: formData.price,
                        stock: formData.stock,
                        image_url: formData.image_url || null,
                        is_active: formData.is_active
                    });

                if (error) throw error;

                alert('Produk berhasil ditambahkan!');
            }

            setIsModalOpen(false);
            loadProducts(); // Reload products
        } catch (error: any) {
            console.error('Error saving product:', error);
            alert('Gagal menyimpan produk: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Delete product
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Yakin ingin menghapus produk "${name}"?`)) return;

        try {
            const { error } = await supabase
                .from('store_items')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Produk berhasil dihapus!');
            loadProducts(); // Reload products
        } catch (error: any) {
            console.error('Error deleting product:', error);
            alert('Gagal menghapus produk: ' + error.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Produk Toko</h1>
                    <p className="text-gray-400">Kelola semua produk di toko internal</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-3 rounded-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Produk
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                >
                    <option value="all">Semua Kategori</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-gold-500" />
                </div>
            ) : (
                <div className="glass rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Produk</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Kategori</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Harga</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Stok</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
                                    <th className="text-left px-6 py-4 text-gray-400 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        className="w-10 h-10 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center">
                                                        <ShoppingBag className="w-5 h-5 text-gold-500" />
                                                    </div>
                                                )}
                                                <p className="font-medium text-white">{item.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-white/5 rounded-full text-gray-300 text-sm capitalize">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gold-400 font-medium">
                                            {formatPrice(Number(item.price))}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">{item.stock}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.is_active
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {item.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">Tidak ada produk ditemukan</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#111111] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {editingItem ? 'Edit Produk' : 'Tambah Produk Baru'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Produk *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                    placeholder="Masukkan nama produk"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Kategori *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50 resize-none"
                                    rows={3}
                                    placeholder="Deskripsi produk (opsional)"
                                />
                            </div>

                            {/* Price & Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Harga (Rp) *</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Stok</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                    />
                                </div>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">URL Foto</label>
                                <input
                                    type="text"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.image_url && (
                                    <img
                                        src={formData.image_url}
                                        alt="Preview"
                                        className="mt-3 w-32 h-32 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500"
                                    />
                                    <span className="text-gray-300">Produk Aktif (tampil di toko member)</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={isSaving}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-4 py-3 rounded-xl transition-all disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Simpan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
