'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Settings,
    Globe,
    Mail,
    Phone,
    MapPin,
    Save,
    User,
    Key
} from 'lucide-react';

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');

    const [siteSettings, setSiteSettings] = useState({
        siteName: 'Liguns Entertainment',
        tagline: 'Agency Profesional Bandung',
        email: 'info@liguns-entertain.com',
        phone: '+62 812-3456-7890',
        address: 'Jakarta, Indonesia',
        instagram: 'https://instagram.com/ligunsofficial',
        whatsapp: 'https://wa.me/6289669094929',
        tiktok: 'https://tiktok.com/@ligunsofficial'
    });

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSavedMessage('Pengaturan berhasil disimpan!');
        setTimeout(() => setSavedMessage(''), 3000);
    };

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Pengaturan</h1>
                <p className="text-gray-400">Kelola pengaturan website dan informasi kontak</p>
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

            {/* Site Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-xl"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-gold-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Informasi Website</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Nama Website</label>
                        <input
                            type="text"
                            value={siteSettings.siteName}
                            onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
                        <input
                            type="text"
                            value={siteSettings.tagline}
                            onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-6 rounded-xl"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-gold-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Informasi Kontak</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={siteSettings.email}
                            onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Telepon
                        </label>
                        <input
                            type="text"
                            value={siteSettings.phone}
                            onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Alamat
                        </label>
                        <input
                            type="text"
                            value={siteSettings.address}
                            onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 rounded-xl"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-gold-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Sosial Media</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Instagram URL</label>
                        <input
                            type="url"
                            value={siteSettings.instagram}
                            onChange={(e) => setSiteSettings({ ...siteSettings, instagram: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp URL</label>
                        <input
                            type="url"
                            value={siteSettings.whatsapp}
                            onChange={(e) => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">TikTok URL</label>
                        <input
                            type="url"
                            value={siteSettings.tiktok}
                            onChange={(e) => setSiteSettings({ ...siteSettings, tiktok: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500/50"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Admin Info (Read Only) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-6 rounded-xl"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Informasi Admin</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400">
                            <Key className="w-4 h-4" />
                            <span>Adminligunsituguntur</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Username tidak dapat diubah</p>
                    </div>
                </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-black font-semibold py-4 rounded-xl transition-all"
                >
                    {isSaving ? (
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Simpan Semua Pengaturan
                        </>
                    )}
                </button>
            </motion.div>
        </div>
    );
}
