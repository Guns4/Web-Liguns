'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    MapPin,
    Briefcase,
    Eye,
    X,
    Save,
    Upload,
    Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';

// Sample lowongan data
const initialLowongan = [
    { id: 1, name: 'Venetian Havana', city: 'Bandung', position: 'Terapis Spa', featured: true, status: 'active', image: '' },
    { id: 2, name: 'Denver Club', city: 'Bandung', position: 'Ladies Karaoke', featured: false, status: 'active', image: '' },
    { id: 3, name: 'Denver Spa', city: 'Bandung', position: 'Terapis Spa', featured: false, status: 'active', image: '' },
    { id: 4, name: 'Vender Club', city: 'Bandung', position: 'Ladies Karaoke', featured: false, status: 'active', image: '' },
    { id: 5, name: '80 Spa', city: 'Bandung', position: 'Terapis Spa', featured: false, status: 'active', image: '' },
    { id: 6, name: 'Saga Vigour', city: 'Bandung', position: 'Terapis Spa', featured: false, status: 'inactive', image: '' },
    { id: 7, name: 'Sultan Spa', city: 'Bandung', position: 'Terapis Spa', featured: false, status: 'active', image: '' },
    { id: 8, name: 'LIV Club', city: 'Bandung', position: 'Ladies Karaoke', featured: false, status: 'active', image: '' },
    { id: 9, name: 'Heritage', city: 'Bandung', position: 'Terapis Spa • Ladies Karaoke', featured: false, status: 'active', image: '' },
];

const cities = ['Bandung', 'Jakarta', 'Surabaya', 'Yogyakarta'];
const positions = ['Terapis Spa', 'Ladies Karaoke', 'Terapis Spa • Ladies Karaoke'];

export default function LowonganManagement() {
    const [lowongan, setLowongan] = useState(initialLowongan);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<typeof initialLowongan[0] | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        city: 'Bandung',
        position: 'Terapis Spa',
        featured: false,
        status: 'active',
        image: ''
    });

    // Filter lowongan by search
    const filteredLowongan = lowongan.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Open modal for new/edit
    const openModal = (item?: typeof initialLowongan[0]) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                city: item.city,
                position: item.position,
                featured: item.featured,
                status: item.status,
                image: item.image || ''
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                city: 'Bandung',
                position: 'Terapis Spa',
                featured: false,
                status: 'active',
                image: ''
            });
        }
        setIsModalOpen(true);
    };

    // Handle Image Upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    // Save lowongan
    const handleSave = () => {
        if (!formData.name) return;

        if (editingItem) {
            // Update existing
            setLowongan(lowongan.map(item =>
                item.id === editingItem.id ? { ...item, ...formData } : item
            ));
        } else {
            // Add new
            const newItem = {
                id: Math.max(...lowongan.map(l => l.id)) + 1,
                ...formData
            };
            setLowongan([...lowongan, newItem]);
        }
        setIsModalOpen(false);
    };

    // Delete lowongan
    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus lowongan ini?')) {
            setLowongan(lowongan.filter(item => item.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Lowongan Kerja</h1>
                    <p className="text-gray-400">Kelola semua lowongan kerja di website</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-3 rounded-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Lowongan
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cari lowongan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50 transition-all"
                />
            </div>

            {/* Table */}
            <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left px-6 py-4 text-gray-400 font-medium">Nama Venue</th>
                                <th className="text-left px-6 py-4 text-gray-400 font-medium">Kota</th>
                                <th className="text-left px-6 py-4 text-gray-400 font-medium">Posisi</th>
                                <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
                                <th className="text-left px-6 py-4 text-gray-400 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLowongan.map((item) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Briefcase className="w-5 h-5 text-gold-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{item.name}</p>
                                                {item.featured && (
                                                    <span className="text-xs bg-gold-500 text-black px-2 py-0.5 rounded-full">Featured</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <MapPin className="w-4 h-4 text-gold-500" />
                                            {item.city}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{item.position}</td>
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
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Hapus"
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

                {filteredLowongan.length === 0 && (
                    <div className="text-center py-12">
                        <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">Tidak ada lowongan ditemukan</p>
                    </div>
                )}
            </div>

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
                                {editingItem ? 'Edit Lowongan' : 'Tambah Lowongan Baru'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Logo Perusahaan</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden relative">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="cursor-pointer inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-medium px-4 py-2 rounded-lg transition-all border border-white/10">
                                            <Upload className="w-4 h-4" />
                                            Upload Logo
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG, GIF (Max 2MB)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Venue</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                    placeholder="Masukkan nama venue"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Kota</label>
                                <select
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                >
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Position */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Posisi</label>
                                <select
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                >
                                    {positions.map(pos => (
                                        <option key={pos} value={pos}>{pos}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Featured & Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="w-5 h-5 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500"
                                        />
                                        <span className="text-gray-300">Featured</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.status === 'active'}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                                            className="w-5 h-5 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500"
                                        />
                                        <span className="text-gray-300">Aktif</span>
                                    </label>
                                </div>
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

