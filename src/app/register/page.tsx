'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Upload,
    Check,
    Lock,
    Ruler,
    Weight,
    UserCircle,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Account Info
        email: '',
        password: '',
        confirmPassword: '',
        // Step 2: Personal Info
        fullName: '',
        phone: '',
        birthDate: '',
        address: '',
        // Step 3: Physical Info
        height: '',
        weight: '',
        emergencyContact: '',
        // Step 4: Photo
        photo: null as File | null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [photoPreview, setPhotoPreview] = useState<string>('');

    const totalSteps = 4;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, photo: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                if (!formData.email) newErrors.email = 'Email wajib diisi';
                else if (!/\S+@\S+\.\S+/.test(formData.email))
                    newErrors.email = 'Format email tidak valid';
                if (!formData.password) newErrors.password = 'Password wajib diisi';
                else if (formData.password.length < 6)
                    newErrors.password = 'Password minimal 6 karakter';
                if (formData.password !== formData.confirmPassword)
                    newErrors.confirmPassword = 'Password tidak cocok';
                break;

            case 2:
                if (!formData.fullName) newErrors.fullName = 'Nama lengkap wajib diisi';
                if (!formData.phone) newErrors.phone = 'Nomor telepon wajib diisi';
                if (!formData.birthDate)
                    newErrors.birthDate = 'Tanggal lahir wajib diisi';
                if (!formData.address) newErrors.address = 'Alamat wajib diisi';
                break;

            case 3:
                if (!formData.height) newErrors.height = 'Tinggi badan wajib diisi';
                else if (parseInt(formData.height) < 150 || parseInt(formData.height) > 200)
                    newErrors.height = 'Tinggi badan harus antara 150-200 cm';
                if (!formData.weight) newErrors.weight = 'Berat badan wajib diisi';
                else if (parseInt(formData.weight) < 40 || parseInt(formData.weight) > 100)
                    newErrors.weight = 'Berat badan harus antara 40-100 kg';
                if (!formData.emergencyContact)
                    newErrors.emergencyContact = 'Kontak darurat wajib diisi';
                break;

            case 4:
                if (!formData.photo) newErrors.photo = 'Foto wajib diupload';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // TODO: Implement Supabase registration
            console.log('Form submitted:', formData);
            alert(
                'Pendaftaran berhasil! (Akan terintegrasi dengan Supabase di tahap selanjutnya)'
            );
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="container-custom max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="heading-primary mb-4">Daftar Anggota Baru</h1>
                    <p className="text-gray-400 text-lg">
                        Bergabunglah dengan ribuan member sukses kami
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center relative flex-1">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${step < currentStep
                                            ? 'bg-green-500 text-white'
                                            : step === currentStep
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-white/10 text-gray-500'
                                            }`}
                                    >
                                        {step < currentStep ? (
                                            <Check className="w-6 h-6" />
                                        ) : (
                                            step
                                        )}
                                    </div>
                                    <span
                                        className={`text-sm mt-2 hidden sm:block ${step <= currentStep ? 'text-white' : 'text-gray-500'
                                            }`}
                                    >
                                        {step === 1 && 'Akun'}
                                        {step === 2 && 'Data Pribadi'}
                                        {step === 3 && 'Fisik'}
                                        {step === 4 && 'Foto'}
                                    </span>
                                </div>
                                {step < 4 && (
                                    <div
                                        className={`h-1 flex-1 mx-2 ${step < currentStep ? 'bg-green-500' : 'bg-white/10'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-8"
                >
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Account Info */}
                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Informasi Akun
                                </h2>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Email <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input-premium pl-12"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-1 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Password <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="input-premium pl-12"
                                            placeholder="Minimal 6 karakter"
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-red-400 text-sm mt-1 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Konfirmasi Password <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="input-premium pl-12"
                                            placeholder="Masukkan ulang password"
                                        />
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-400 text-sm mt-1 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Personal Info */}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Data Pribadi
                                </h2>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Nama Lengkap <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="input-premium pl-12"
                                            placeholder="Nama lengkap sesuai KTP"
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="text-red-400 text-sm mt-1 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.fullName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Nomor Telepon <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="input-premium pl-12"
                                            placeholder="08123456789"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="text-red-400 text-sm mt-1 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Tanggal Lahir <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleInputChange}
                                            className="input-premium pl-12"
                                        />
                                    </div>
                                    {errors.birthDate && (
                                        <p className="text-red-400 text-sm mt-1 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.birthDate}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Alamat Lengkap <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="input-premium pl-12"
                                            placeholder="Alamat lengkap sesuai KTP"
                                        />
                                    </div>
                                    {errors.address && (
                                        <p className="text-red-400 text-sm mt-1 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.address}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Physical Info */}
                        {currentStep === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Data Fisik
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 mb-2">
                                            Tinggi Badan (cm) <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="number"
                                                name="height"
                                                value={formData.height}
                                                onChange={handleInputChange}
                                                className="input-premium pl-12"
                                                placeholder="160"
                                                min="150"
                                                max="200"
                                            />
                                        </div>
                                        {errors.height && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.height}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 mb-2">
                                            Berat Badan (kg) <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <Weight className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="number"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleInputChange}
                                                className="input-premium pl-12"
                                                placeholder="50"
                                                min="40"
                                                max="100"
                                            />
                                        </div>
                                        {errors.weight && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.weight}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Kontak Darurat <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="emergencyContact"
                                            value={formData.emergencyContact}
                                            onChange={handleInputChange}
                                            className="input-premium pl-12"
                                            placeholder="Nomor keluarga yang dapat dihubungi"
                                        />
                                    </div>
                                    {errors.emergencyContact && (
                                        <p className="text-red-400 text-sm mt-1 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.emergencyContact}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Photo Upload */}
                        {currentStep === 4 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Upload Foto
                                </h2>

                                <div>
                                    <label className="block text-gray-300 mb-4">
                                        Foto Diri <span className="text-red-400">*</span>
                                    </label>
                                    <div
                                        className={`border-2 border-dashed rounded-2xl p-8 text-center ${photoPreview
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-white/20 bg-white/5 hover:border-primary-500 hover:bg-white/10'
                                            } transition-all`}
                                    >
                                        {photoPreview ? (
                                            <div className="space-y-4">
                                                <img
                                                    src={photoPreview}
                                                    alt="Preview"
                                                    className="w-48 h-48 object-cover rounded-xl mx-auto"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPhotoPreview('');
                                                        setFormData((prev) => ({ ...prev, photo: null }));
                                                    }}
                                                    className="btn-secondary text-sm"
                                                >
                                                    Ganti Foto
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer block">
                                                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                                <p className="text-white font-semibold mb-2">
                                                    Klik untuk upload foto
                                                </p>
                                                <p className="text-gray-400 text-sm mb-4">
                                                    Format: JPG, PNG (Maks. 5MB)
                                                </p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="hidden"
                                                />
                                                <span className="btn-secondary inline-block">
                                                    Pilih Foto
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                    {errors.photo && (
                                        <p className="text-red-400 text-sm mt-2 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.photo}
                                        </p>
                                    )}
                                    <p className="text-gray-400 text-sm mt-4">
                                        💡 Tips: Gunakan foto close-up dengan wajah terlihat jelas
                                        dan latar belakang yang rapi
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/10">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className={`btn-secondary flex items-center space-x-2 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Sebelumnya</span>
                            </button>

                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <span>Selanjutnya</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <Check className="w-5 h-5" />
                                    <span>Daftar Sekarang</span>
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>

                {/* Login Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-8"
                >
                    <p className="text-gray-400">
                        Sudah punya akun?{' '}
                        <Link
                            href="/login"
                            className="text-primary-400 hover:text-primary-300 font-semibold"
                        >
                            Masuk di sini
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
