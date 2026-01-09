'use client';

import { useState } from 'react';
import { Camera, Loader2, User, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface AvatarUploadProps {
    currentPhotoUrl?: string | null;
    userId: string;
    onUploadSuccess: (newPhotoUrl: string) => void;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function AvatarUpload({
    currentPhotoUrl,
    userId,
    onUploadSuccess,
    size = 'lg'
}: AvatarUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
    const [error, setError] = useState<string | null>(null);

    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32',
        xl: 'w-40 h-40'
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Format file harus JPG, PNG, atau WebP');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setError('Ukuran file maksimal 5MB');
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile in database
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_photo: publicUrl })
                .eq('id', userId);

            if (updateError) throw updateError;

            // Update preview and notify parent
            setPreviewUrl(publicUrl);
            onUploadSuccess(publicUrl);

            // Delete old avatar if exists
            if (currentPhotoUrl && currentPhotoUrl.includes('supabase')) {
                const oldPath = currentPhotoUrl.split('/avatars/')[1];
                if (oldPath) {
                    await supabase.storage
                        .from('avatars')
                        .remove([`avatars/${oldPath}`]);
                }
            }

        } catch (error: any) {
            console.error('Upload error:', error);
            setError(error.message || 'Gagal upload foto');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemovePhoto = async () => {
        if (!confirm('Hapus foto profil?')) return;

        setIsUploading(true);
        try {
            // Update database to null
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ profile_photo: null })
                .eq('id', userId);

            if (updateError) throw updateError;

            // Delete from storage if exists
            if (currentPhotoUrl && currentPhotoUrl.includes('supabase')) {
                const path = currentPhotoUrl.split('/avatars/')[1];
                if (path) {
                    await supabase.storage
                        .from('avatars')
                        .remove([`avatars/${path}`]);
                }
            }

            setPreviewUrl(null);
            onUploadSuccess('');

        } catch (error: any) {
            console.error('Remove error:', error);
            setError(error.message || 'Gagal hapus foto');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar Display */}
            <div className="relative group">
                <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white/10 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative`}>
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <User className="w-1/2 h-1/2 text-white" />
                    )}

                    {/* Loading Overlay */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>

                {/* Upload Button Overlay */}
                {!isUploading && (
                    <label className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </label>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl cursor-pointer transition-all font-semibold text-sm disabled:opacity-50">
                    <Upload className="w-4 h-4" />
                    <span>{previewUrl ? 'Ganti Foto' : 'Upload Foto'}</span>
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                    />
                </label>

                {previewUrl && (
                    <button
                        onClick={handleRemovePhoto}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all font-semibold text-sm disabled:opacity-50"
                    >
                        <X className="w-4 h-4" />
                        Hapus
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Info Text */}
            <p className="text-gray-500 text-xs text-center">
                JPG, PNG, atau WebP. Max 5MB
            </p>
        </div>
    );
}
