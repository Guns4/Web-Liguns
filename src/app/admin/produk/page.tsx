'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ShoppingBag,
    Star,
    X,
    Save,
    Tag
} from 'lucide-react';

// Sample product data
const initialProducts = [
    { id: 1, name: 'Luxury Face Serum', category: 'skincare', price: 250000, stock: 50, status: 'active' },
    { id: 2, name: 'Matte Lipstick Premium', category: 'makeup', price: 150000, stock: 100, status: 'active' },
    { id: 3, name: 'Body Lotion Whitening', category: 'bodycare', price: 125000, stock: 75, status: 'active' },
    { id: 4, name: 'Hair Vitamin Keratin', category: 'haircare', price: 85000, stock: 60, status: 'active' },
    { id: 5, name: 'Eau de Parfum Elegant', category: 'parfum', price: 450000, stock: 30, status: 'active' },
    { id: 6, name: 'Gold Necklace Set', category: 'aksesoris', price: 320000, stock: 20, status: 'active' },
    { id: 7, name: 'Night Cream Anti-Aging', category: 'skincare', price: 280000, stock: 45, status: 'inactive' },
    { id: 8, name: 'Elegant Dress Collection', category: 'fashion', price: 550000, stock: 15, status: 'active' },
];

const categories = [
    { id: 'skincare', name: 'Skincare' },
    { id: 'makeup', name: 'Makeup' },
    { id: 'bodycare', name: 'Body Care' },
    { id: 'haircare', name: 'Hair Care' },
    { id: 'parfum', name: 'Parfum' },
    { id: 'aksesoris', name: 'Aksesoris' },
    { id: 'fashion', name: 'Fashion' },
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
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<typeof initialProducts[0] | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'skincare',
        price: 0,
        stock: 0,
        status: 'active'
    });

    // Filter products
    const filteredProducts = products.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Open modal
    const openModal = (item?: typeof initialProducts[0]) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                category: item.category,
                price: item.price,
                stock: item.stock,
                status: item.status
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                category: 'skincare',
                price: 0,
                stock: 0,
                status: 'active'
            });
        }
        setIsModalOpen(true);
    };

    // Save product
    const handleSave = () => {
        if (!formData.name || formData.price <= 0) return;

        if (editingItem) {
            setProducts(products.map(item =>
                item.id === editingItem.id ? { ...item, ...formData } : item
            ));
        } else {
            const newItem = {
                id: Math.max(...products.map(p => p.id)) + 1,
                ...formData
            };
            setProducts([...products, newItem]);
        }
        setIsModalOpen(false);
    };

    // Delete product
    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            setProducts(products.filter(item => item.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Produk Toko</h1>
                    <p className="text-gray-400">Kelola semua produk di toko online</p>
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
                                            <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center">
                                                <ShoppingBag className="w-5 h-5 text-gold-500" />
                                            </div>
                                            <p className="font-medium text-white">{item.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-white/5 rounded-full text-gray-300 text-sm capitalize">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gold-400 font-medium">
                                        {formatPrice(item.price)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{item.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'active'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {item.status === 'active' ? 'Aktif' : 'Nonaktif'}
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
                                                onClick={() => handleDelete(item.id)}
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#111111] rounded-2xl p-6 w-full max-w-lg"
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Produk</label>
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
                                <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
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

                            {/* Price & Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Harga (Rp)</label>
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

                            {/* Status */}
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.status === 'active'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500"
                                    />
                                    <span className="text-gray-300">Produk Aktif</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-4 py-3 rounded-xl transition-all"
                            >
                                <Save className="w-4 h-4" />
                                Simpan
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
