// ===============================================
// FORM HANDLER - WHATSAPP INTEGRATION
// ===============================================

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('applicationForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const formData = {
            fullName: document.getElementById('fullName').value,
            age: document.getElementById('age').value,
            phone: document.getElementById('phone').value,
            weight: document.getElementById('weight').value,
            height: document.getElementById('height').value,
            address: document.getElementById('address').value,
            jobPosition: document.getElementById('jobPosition').value,
            experience: document.getElementById('experience').value,
            additionalInfo: document.getElementById('additionalInfo').value || 'Tidak ada informasi tambahan'
        };

        // Validate
        if (!formData.fullName || !formData.age || !formData.phone ||
            !formData.weight || !formData.height || !formData.address ||
            !formData.jobPosition) {
            alert('Mohon lengkapi semua data yang wajib diisi (*)');
            return;
        }

        // Check terms
        const termsChecked = document.getElementById('terms').checked;
        const privacyChecked = document.getElementById('privacy').checked;

        if (!termsChecked || !privacyChecked) {
            alert('Mohon setujui syarat dan ketentuan serta kebijakan privasi');
            return;
        }

        // Create WhatsApp message
        const message = `
🌟 *LAMARAN KERJA - LIGUNS ENTERTAINMENT*

📋 *DATA PRIBADI*
━━━━━━━━━━━━━━━━━━
👤 Nama Lengkap: ${formData.fullName}
📅 Usia: ${formData.age} tahun
📱 No. WhatsApp: ${formData.phone}
⚖️ Berat Badan: ${formData.weight} kg
📏 Tinggi Badan: ${formData.height} cm
📍 Alamat: ${formData.address}

💼 *POSISI & PENGALAMAN*
━━━━━━━━━━━━━━━━━━
🎯 Lowongan Diminati: ${formData.jobPosition}
💡 Pengalaman: ${formData.experience}

📝 *INFORMASI TAMBAHAN*
 ━━━━━━━━━━━━━━━━━━
${formData.additionalInfo}

📸 *FOTO PENDUKUNG*
━━━━━━━━━━━━━━━━━━
Foto Selfie: Akan dikirim via WA
Foto Full Body: Akan dikirim via WA

✅ Saya setuju dengan syarat dan ketentuan yang berlaku

═══════════════════════
Terima kasih telah melamar di Liguns Entertainment!
        `.trim();

        // Encode message for WhatsApp
        const encodedMessage = encodeURIComponent(message);

        // WhatsApp number
        const whatsappNumber = '6289669094929';

        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Show loading state (optional)
        const submitBtn = form.querySelector('.submit-button');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Memproses...</span>';
        submitBtn.disabled = true;

        // Wait a moment then open WhatsApp
        setTimeout(function () {
            // Open WhatsApp
            window.open(whatsappURL, '_blank');

            // Reset button
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;

            // Show success message
            alert('Data Anda akan dikirim via WhatsApp. Mohon kirimkan foto selfie dan foto full body setelah pesan terkirim. Terima kasih!');

            // Optional: Reset form after a delay
            setTimeout(function () {
                if (confirm('Apakah Anda ingin mengisi form baru?')) {
                    form.reset();
                }
            }, 2000);

        }, 500);
    });

    // Phone number formatting (optional)
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function (e) {
        // Remove non-numeric characters
        let value = e.target.value.replace(/\D/g, '');

        // Add 62 prefix for Indonesian numbers if starting with 0
        if (value.startsWith('0')) {
            value = '62' + value.substring(1);
        }

        e.target.value = value.substring(0, 15); // Limit length
    });

    // Age validation
    const ageInput = document.getElementById('age');
    ageInput.addEventListener('input', function (e) {
        const age = parseInt(e.target.value);

        if (age < 18) {
            e.target.setCustomValidity('Usia minimal 18 tahun');
        } else if (age > 35) {
            e.target.setCustomValidity('Usia maksimal 35 tahun');
        } else {
            e.target.setCustomValidity('');
        }
    });

    // Form field animations
    const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');

    formInputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');

            // Add filled class if has value
            if (this.value) {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
    });

    // Character counter for textarea (optional enhancement)
    const additionalInfoTextarea = document.getElementById('additionalInfo');
    if (additionalInfoTextarea) {
        const maxLength = 500;
        const counterDiv = document.createElement('div');
        counterDiv.className = 'char-counter';
        counterDiv.textContent = `0 / ${maxLength}`;
        additionalInfoTextarea.setAttribute('maxlength', maxLength);
        additionalInfoTextarea.parentElement.appendChild(counterDiv);

        additionalInfoTextarea.addEventListener('input', function () {
            const length = this.value.length;
            counterDiv.textContent = `${length} / ${maxLength}`;

            if (length > maxLength * 0.9) {
                counterDiv.style.color = 'var(--gold)';
            } else {
                counterDiv.style.color = 'var(--text-muted)';
            }
        });
    }
});

// ===============================================
// PHOTO UPLOAD INFO (VISUAL FEEDBACK)
// ===============================================

// Add visual feedback to upload placeholders
const uploadPlaceholders = document.querySelectorAll('.upload-placeholder');

uploadPlaceholders.forEach(placeholder => {
    placeholder.addEventListener('click', function () {
        alert('📸 Foto akan dikirim langsung via WhatsApp setelah Anda submit form ini. Pastikan foto sudah siap!');
    });

    // Add hover effect
    placeholder.style.cursor = 'pointer';
});
