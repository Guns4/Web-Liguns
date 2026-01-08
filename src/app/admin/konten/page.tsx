'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
    FileText,
    Edit,
    Save,
    Eye,
    X,
    Home,
    Briefcase,
    Sparkles,
    Info
} from 'lucide-react';

// Content sections
const contentSections = [
    {
        id: 'beranda',
        title: 'Halaman Beranda',
        icon: Home,
        description: 'Kelola konten hero, tagline, dan deskripsi halaman utama',
        fields: [
            { key: 'heroTitle', label: 'Judul Hero', type: 'text', value: 'Membangun Karier Profesional di Industri Hiburan Malam' },
            { key: 'heroDesc', label: 'Deskripsi', type: 'textarea', value: 'Liguns Entertainment adalah agency profesional berbasis di Kota Bandung yang menghadirkan wadah aman, modern, dan elegan untuk penyaluran dan pengembangan karier wanita muda di karaoke dan Terapis Spa.' },
            { key: 'ctaButton', label: 'Teks Tombol CTA', type: 'text', value: 'Gabung Sekarang' },
        ]
    },
    {
        id: 'layanan',
        title: 'Halaman Layanan',
        icon: Sparkles,
        description: 'Kelola judul dan deskripsi layanan yang ditawarkan',
        fields: [
            { key: 'layananTitle', label: 'Judul Halaman', type: 'text', value: 'Layanan Profesional Kami' },
            { key: 'layananDesc', label: 'Deskripsi', type: 'textarea', value: 'Berbagai solusi bisnis terpadu untuk mengembangkan karier dan personal branding di industri hiburan malam modern' },
        ]
    },
    {
        id: 'tentang',
        title: 'Halaman Tentang',
        icon: Info,
        description: 'Kelola konten halaman tentang perusahaan, visi, dan misi',
        fields: [
            { key: 'aboutTitle', label: 'Judul Halaman', type: 'text', value: 'Tentang Liguns Entertainment' },
            { key: 'visi', label: 'Visi', type: 'textarea', value: 'Menjadi agency profesional terdepan yang menghadirkan ekosistem pengembangan talent dan layanan digital modern yang elegan, aman, serta berstandar tinggi.' },
        ]
    },
    {
        id: 'lowongan',
        title: 'Halaman Lowongan',
        icon: Briefcase,
        description: 'Kelola judul dan deskripsi halaman lowongan kerja',
        fields: [
            { key: 'lowonganTitle', label: 'Judul Halaman', type: 'text', value: 'Lowongan Kerja Tersedia' },
            { key: 'lowonganDesc', label: 'Deskripsi', type: 'textarea', value: 'Bergabunglah dengan tim profesional kami di berbagai kota di Indonesia' },
        ]
    },
];

export default function KontenManagement() {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [editData, setEditData] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');

    // Open section for editing
    const openSection = (section: typeof contentSections[0]) => {
        const data: Record<string, string> = {};
        section.fields.forEach(field => {
            data[field.key] = field.value;
        });
        setEditData(data);
        setActiveSection(section.id);
    };

    // Save changes
    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSavedMessage('Perubahan berhasil disimpan!');
        setTimeout(() => setSavedMessage(''), 3000);
        setActiveSection(null);
    };

    const currentSection = contentSections.find(s => s.id === activeSection);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Konten Website</h1>
                <p className="text-gray-400">Kelola konten dan teks di seluruh halaman website</p>
            </div>

            {/* Success Message */}
            {savedMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/20 text-green-400 px-4 py-3 rounded-xl"
                >
                    {savedMessage}
                </motion.div>
            )}

            {/* Content Sections Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                {contentSections.map((section) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass p-6 rounded-xl hover:border-gold-500/30 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center">
                                <section.icon className="w-6 h-6 text-gold-500" />
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={`/${section.id === 'beranda' ? '' : section.id}`}
                                    target="_blank"
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Preview"
                                >
                                    <Eye className="w-4 h-4 text-gray-400" />
                                </a>
                                <button
                                    onClick={() => openSection(section)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{section.title}</h3>
                        <p className="text-gray-400 text-sm">{section.description}</p>
                        <div className="mt-4 text-xs text-gray-500">
                            {section.fields.length} field dapat diedit
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Edit Modal */}
            {activeSection && currentSection && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#111111] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                                    <currentSection.icon className="w-5 h-5 text-gold-500" />
                                </div>
                                <h2 className="text-xl font-bold text-white">{currentSection.title}</h2>
                            </div>
                            <button
                                onClick={() => setActiveSection(null)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {currentSection.fields.map((field) => (
                                <div key={field.key}>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        {field.label}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={editData[field.key] || ''}
                                            onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50 resize-none"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={editData[field.key] || ''}
                                            onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setActiveSection(null)}
                                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-black font-semibold px-4 py-3 rounded-xl transition-all"
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Simpan Perubahan
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
