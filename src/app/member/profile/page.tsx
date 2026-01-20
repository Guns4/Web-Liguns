'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    Edit,
    Save,
    X,
    UserCheck,
    Building2,
    Ruler,
    Weight as WeightIcon,
    GraduationCap,
    Users,
    Cake
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import AvatarUpload from '@/components/AvatarUpload';

export default function MemberProfilePage() {
    const { profile, refreshProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        address: '',
        bio: '',
        height: '',
        weight: '',
        gender: '',
        date_of_birth: '',
        education: '',
        experience: ''
    });

    const handleEdit = () => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                address: profile.address || '',
                bio: profile.bio || '',
                height: profile.height?.toString() || '',
                weight: profile.weight?.toString() || '',
                gender: profile.gender || '',
                date_of_birth: profile.date_of_birth || '',
                education: profile.education || '',
                experience: profile.experience || ''
            });
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        if (!profile?.id) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                    address: formData.address,
                    bio: formData.bio,
                    height: formData.height ? parseFloat(formData.height.toString()) : null,
                    weight: formData.weight ? parseFloat(formData.weight.toString()) : null,
                    gender: (formData.gender === 'male' || formData.gender === 'female') ? formData.gender : null,
                    date_of_birth: formData.date_of_birth || null,
                    education: formData.education,
                    experience: formData.experience,
                    updated_at: new Date().toISOString()
                })
                .eq('id', profile.id);

            if (error) throw error;

            // Show success toast
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-slide-in';
            toast.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="font-semibold">Profil berhasil diupdate!</span>';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);

            // Refresh profile in AuthContext
            if (refreshProfile) {
                await refreshProfile();
            }

            setIsEditing(false);
        } catch (error: any) {
            console.error('Error updating profile:', error);

            // Show error toast
            const toast = document.createElement('div');
            toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2';
            toast.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg><span class="font-semibold">Gagal update: ${error.message}</span>`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUploadSuccess = async (newPhotoUrl: string) => {
        // Refresh profile to get updated photo
        if (refreshProfile) {
            await refreshProfile();
        }
    };

    const getNickname = () => {
        if (!profile?.bio) return profile?.full_name?.split(' ')[0] || 'User';
        const match = profile.bio.match(/Nickname:\s*([^\|]+)/);
        return match ? match[1].trim() : profile.full_name?.split(' ')[0] || 'User';
    };

    const getVenue = () => {
        if (!profile?.bio) return 'No Venue';
        const match = profile.bio.match(/Venue:\s*([^\|]+)/);
        return match ? match[1].trim() : 'No Venue';
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'active': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' };
            case 'contract': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' };
            case 'interview': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' };
            case 'inactive': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' };
            default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30' };
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case 'active': return 'Aktif';
            case 'contract': return 'Kontrak';
            case 'interview': return 'Interview';
            case 'inactive': return 'Nonaktif';
            default: return 'Unknown';
        }
    };

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    const statusStyle = getStatusColor(profile.status);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2">
                    👤 Profil Saya
                </h1>
                <p className="text-gray-400 text-lg">Kelola informasi pribadi Anda</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Avatar & Basic Info */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 shadow-2xl"
                    >
                        {/* Avatar Upload */}
                        <div className="mb-8">
                            <AvatarUpload
                                currentPhotoUrl={profile.profile_photo}
                                userId={profile.id}
                                onUploadSuccess={handleAvatarUploadSuccess}
                                size="xl"
                            />
                        </div>

                        {/* Name & Role */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black text-white mb-2">{getNickname()}</h2>
                            <p className="text-gray-400 mb-4">{profile.full_name}</p>
                            <div className="flex items-center justify-center gap-3 flex-wrap">
                                <span className={`px-4 py-2 rounded-xl font-semibold text-sm ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                                    {getStatusLabel(profile.status)}
                                </span>
                                <span className="px-4 py-2 rounded-xl font-semibold text-sm bg-purple-500/10 text-purple-400 border border-purple-500/30 capitalize">
                                    {profile.role}
                                </span>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                <Building2 className="w-5 h-5 text-purple-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">Venue</p>
                                    <p className="text-sm text-white font-semibold">{getVenue()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                <Calendar className="w-5 h-5 text-purple-400" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">Bergabung</p>
                                    <p className="text-sm text-white font-semibold">
                                        {new Date(profile.join_date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Detailed Info */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-8 rounded-3xl bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border border-white/10 shadow-2xl"
                    >
                        {/* Header with Edit Button */}
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-white">Informasi Detail</h3>
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center gap-2 px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all font-semibold"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profil
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-semibold disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all font-semibold disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <User className="w-4 h-4" />
                                    Nama Lengkap
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                ) : (
                                    <p className="text-white font-semibold text-lg">{profile.full_name || '-'}</p>
                                )}
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </label>
                                <div className="relative">
                                    <p className="text-white font-semibold text-lg">{profile.email}</p>
                                    <p className="text-gray-500 text-xs mt-1">Email tidak dapat diubah</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <Phone className="w-4 h-4" />
                                    No. Telepon
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                ) : (
                                    <p className="text-white font-semibold text-lg">{profile.phone || '-'}</p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <Cake className="w-4 h-4" />
                                    Tanggal Lahir
                                </label>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                ) : (
                                    <p className="text-white font-semibold text-lg">
                                        {profile.date_of_birth
                                            ? new Date(profile.date_of_birth).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                            : '-'
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <Users className="w-4 h-4" />
                                    Jenis Kelamin
                                </label>
                                {isEditing ? (
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                                    >
                                        <option value="">Pilih</option>
                                        <option value="male">Laki-laki</option>
                                        <option value="female">Perempuan</option>
                                    </select>
                                ) : (
                                    <p className="text-white font-semibold text-lg capitalize">
                                        {profile.gender === 'male' ? 'Laki-laki' : profile.gender === 'female' ? 'Perempuan' : '-'}
                                    </p>
                                )}
                            </div>

                            {/* Height */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <Ruler className="w-4 h-4" />
                                    Tinggi Badan (cm)
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.height}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                                        placeholder="165.5"
                                    />
                                ) : (
                                    <p className="text-white font-semibold text-lg">
                                        {profile.height ? `${profile.height} cm` : '-'}
                                    </p>
                                )}
                            </div>

                            {/* Weight */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <WeightIcon className="w-4 h-4" />
                                    Berat Badan (kg)
                                </label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                                        placeholder="55.5"
                                    />
                                ) : (
                                    <p className="text-white font-semibold text-lg">
                                        {profile.weight ? `${profile.weight} kg` : '-'}
                                    </p>
                                )}
                            </div>

                            {/* Education */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <GraduationCap className="w-4 h-4" />
                                    Pendidikan
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.education}
                                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50"
                                        placeholder="S1 Manajemen"
                                    />
                                ) : (
                                    <p className="text-white font-semibold text-lg">{profile.education || '-'}</p>
                                )}
                            </div>

                            {/* Address (Full width) */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <MapPin className="w-4 h-4" />
                                    Alamat
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 resize-none"
                                        rows={3}
                                        placeholder="Alamat lengkap"
                                    />
                                ) : (
                                    <p className="text-white font-semibold text-lg">{profile.address || '-'}</p>
                                )}
                            </div>

                            {/* Experience (Full width) */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <Briefcase className="w-4 h-4" />
                                    Pengalaman Kerja
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 resize-none"
                                        rows={4}
                                        placeholder="Contoh: Bartender di XYZ (2020-2022)"
                                    />
                                ) : (
                                    <p className="text-white font-semibold text-lg whitespace-pre-wrap">{profile.experience || '-'}</p>
                                )}
                            </div>

                            {/* Bio (Full width) */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                                    <User className="w-4 h-4" />
                                    Bio / Keterangan
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 resize-none"
                                        rows={4}
                                        placeholder="Nickname: John | Posisi: LC | Venue: Venetian Havana"
                                    />
                                ) : (
                                    <p className="text-white font-semibold text-lg whitespace-pre-wrap">{profile.bio || '-'}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-2">
                                    Format: Nickname: [nama] | Posisi: [posisi] | Venue: [venue]
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
