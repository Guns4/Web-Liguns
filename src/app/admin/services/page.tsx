'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Save,
    X,
    Loader2,
    RefreshCw,
    Star,
    DollarSign,
    Eye
} from 'lucide-react';
import {
    getAllServices,
    createService,
    updateService,
    deleteService,
    generateSlug,
    type Service
} from '@/lib/cms';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        short_description: '',
        icon: 'Users',
        is_featured: false,
        is_active: true,
        price_display: '',
        cta_text: 'Pelajari Lebih Lanjut',
        cta_url: ''
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        setLoading(true);
        try {
            const data = await getAllServices();
            setServices(data);
        } catch (error) {
            console.error('Error loading services:', error);
            alert('Gagal memuat data layanan');
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (service?: Service) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                slug: service.slug,
                description: service.description || '',
                short_description: service.short_description || '',
                icon: service.icon || 'Users',
                is_featured: service.is_featured,
                is_active: service.is_active,
                price_display: service.price_display || '',
                cta_text: service.cta_text,
                cta_url: service.cta_url || ''
            });
        } else {
            setEditingService(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                short_description: '',
                icon: 'Users',
                is_featured: false,
                is_active: true,
                price_display: '',
                cta_text: 'Pelajari Lebih Lanjut',
                cta_url: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name) {
            alert('Nama layanan harus diisi');
            return;
        }

        setSaving(true);
        try {
            const slug = formData.slug || generateSlug(formData.name);
            const serviceData = { ...formData, slug };

            if (editingService) {
                const updated = await updateService(editingService.id, serviceData);
                if (updated) {
                    await loadServices();
                    setIsModalOpen(false);
                } else {
                    alert('Gagal update layanan');
                }
            } else {
                const created = await createService(serviceData);
                if (created) {
                    await loadServices();
                    setIsModalOpen(false);
                } else {
                    alert('Gagal menambahkan layanan');
                }
            }
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Terjadi kesalahan saat menyimpan');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus layanan ini?')) return;

        try {
            const success = await deleteService(id);
            if (success) {
                await loadServices();
            } else {
                alert('Gagal menghapus layanan');
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Terjadi kesalahan saat menghapus');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Layanan/Services</h1>
                    <p className="text-gray-400">Kelola layanan yang ditawarkan</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadServices}
                        disabled={loading}
                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-4 py-3 rounded-xl transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-6 py-3 rounded-xl transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Layanan
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cari layanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-gold-500/50 transition-all"
                />
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="glass rounded-xl p-12 text-center">
                    <Loader2 className="w-12 h-12 text-gold-500 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-400">Memuat data layanan...</p>
                </div>
            ) : (
                <>
                    {/* Services Grid */}
                    <div className="grid gap-6">
                        {filteredServices.map((service) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass rounded-xl p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{service.name}</h3>
                                            {service.is_featured && (
                                                <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
                                            )}
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${service.is_active
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {service.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-2">Slug: {service.slug}</p>
                                        {service.short_description && (
                                            <p className="text-gray-300 mb-3">{service.short_description}</p>
                                        )}
                                        {service.price_display && (
                                            <div className="flex items-center gap-2 text-gold-500">
                                                <DollarSign className="w-4 h-4" />
                                                <span className="font-medium">{service.price_display}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openModal(service)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredServices.length === 0 && (
                        <div className="text-center py-12 glass rounded-xl">
                            <Eye className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">Tidak ada layanan ditemukan</p>
                        </div>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#111111] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={saving}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Layanan *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                    placeholder="Contoh: Penyaluran Tenaga Kerja"
                                    disabled={saving}
                                />
                            </div>

                            {/* Short Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Singkat</label>
                                <textarea
                                    value={formData.short_description}
                                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                    placeholder="Deskripsi singkat untuk card..."
                                    disabled={saving}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Lengkap</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                    placeholder="Deskripsi detail layanan..."
                                    disabled={saving}
                                />
                            </div>

                            {/* Price Display */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tampilan Harga</label>
                                <input
                                    type="text"
                                    value={formData.price_display}
                                    onChange={(e) => setFormData({ ...formData, price_display: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                    placeholder="Mulai dari Rp 5.000.000"
                                    disabled={saving}
                                />
                            </div>

                            {/* CTA */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Teks CTA</label>
                                    <input
                                        type="text"
                                        value={formData.cta_text}
                                        onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                        disabled={saving}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">URL CTA</label>
                                    <input
                                        type="text"
                                        value={formData.cta_url}
                                        onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                        placeholder="/layanan/detail"
                                        disabled={saving}
                                    />
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="flex gap-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500"
                                        disabled={saving}
                                    />
                                    <span className="text-gray-300">Featured</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-gold-500 focus:ring-gold-500"
                                        disabled={saving}
                                    />
                                    <span className="text-gray-300">Aktif</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={saving}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold px-4 py-3 rounded-xl transition-all disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Simpan
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
