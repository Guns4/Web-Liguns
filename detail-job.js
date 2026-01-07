// ===============================================
// DETAIL JOB - DYNAMIC JOB LOADING
// ===============================================

// Job Data
const jobData = {
    'karaoke-lc': {
        id: 'karaoke-lc',
        title: 'LC Karaoke',
        category: 'Karaoke',
        location: 'Bandung',
        salary: 'Rp 400rb - 550rb',
        salaryPer: 'per voucher',
        type: 'Full-time',
        experience: 'Fresh Graduate Welcome',
        featured: true,
        description: 'Bergabunglah sebagai LC (Lady Companion) Karaoke di venue premium kami. Posisi ini cocok untuk Anda yang memiliki kepribadian menyenangkan dan suka berinteraksi dengan orang.',
        responsibilities: [
            'Menemani tamu karaoke dengan profesional',
            'Memberikan pelayanan terbaik kepada customer',
            'Menjaga penampilan dan attitude',
            'Mengikuti SOP yang berlaku'
        ],
        requirements: [
            'Wanita usia 18-30 tahun',
            'Berpenampilan menarik',
            'Tinggi min. 155 cm',
            'Komunikatif dan ramah',
            'Bersedia training',
            'Siap bekerja shift malam'
        ],
        benefits: [
            'Gaji bisa dibayar harian',
            'Mess gratis',
            'Make-up & hairstylist gratis',
            'Seragam disediakan',
            'Bonus pencapaian',
            'Lingkungan aman & supportive'
        ]
    },
    'spa-therapist': {
        id: 'spa-therapist',
        title: 'Spa Therapist',
        category: 'Spa & Wellness',
        location: 'Bandung',
        salary: 'Rp 400rb - 500rb',
        salaryPer: 'per voucher',
        type: 'Full-time',
        experience: 'Pengalaman diutamakan',
        featured: true,
        description: 'Kami mencari Spa Therapist yang terampil untuk memberikan layanan spa berkualitas tinggi. Training akan diberikan untuk teknik-teknik terbaru.',
        responsibilities: [
            'Memberikan layanan massage profesional',
            'Melakukan perawatan spa sesuai standar',
            'Menjaga kebersihan dan kenyamanan ruangan',
            'Memberikan konsultasi perawatan kepada klien'
        ],
        requirements: [
            'Wanita usia 18-35 tahun',
            'Memiliki sertifikat spa/massage lebih diutamakan',
            'Bersedia belajar teknik baru',
            'Ramah dan sabar',
            'Sehat jasmani dan rohani'
        ],
        benefits: [
            'Gaji kompetitif',
            'Training gratis',
            'Mess tersedia',
            'Bonus performance',
            'Jenjang karir jelas',
            'Lingkungan kerja nyaman'
        ]
    },
    'guest-relation': {
        id: 'guest-relation',
        title: 'Guest Relation Officer',
        category: 'Hospitality',
        location: 'Bandung',
        salary: 'Rp 350rb - 450rb',
        salaryPer: 'per voucher',
        type: 'Full-time',
        experience: 'Fresh Graduate Welcome',
        featured: false,
        description: 'Posisi Guest Relation Officer untuk menyambut dan melayani tamu dengan ramah. Cocok untuk Anda yang suka bertemu orang baru.',
        responsibilities: [
            'Menyambut tamu dengan ramah',
            'Menjelaskan layanan yang tersedia',
            'Menangani keluhan tamu',
            'Koordinasi dengan tim operasional'
        ],
        requirements: [
            'Wanita usia 18-28 tahun',
            'Penampilan menarik dan rapi',
            'Komunikasi baik',
            'Mampu bekerja dalam tim',
            'Bersedia kerja shift'
        ],
        benefits: [
            'Gaji menarik',
            'Tunjangan transport',
            'Mess gratis',
            'Training pengembangan diri',
            'Bonus bulanan'
        ]
    }
};

// Get job ID from URL
function getJobIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Render job detail
function renderJobDetail() {
    const jobId = getJobIdFromURL();
    const job = jobData[jobId];

    if (!job) {
        document.getElementById('jobDetailContainer').innerHTML = `
            <div class="job-not-found">
                <div class="not-found-icon">🔍</div>
                <h2>Lowongan Tidak Ditemukan</h2>
                <p>Maaf, lowongan yang Anda cari tidak tersedia atau sudah ditutup.</p>
                <a href="lowongan.html" class="cta-button">Lihat Lowongan Lain</a>
            </div>
        `;
        return;
    }

    // Update page title
    document.title = `${job.title} - Liguns Entertainment`;

    // Render the job detail
    const container = document.getElementById('jobDetailContainer');
    container.innerHTML = `
        <div class="job-detail-header">
            <div class="job-detail-badge-row">
                ${job.featured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
                <span class="badge badge-category">${job.category}</span>
            </div>
            <h1 class="job-detail-title">${job.title}</h1>
            <div class="job-detail-meta">
                <div class="meta-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${job.location}</span>
                </div>
                <div class="meta-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span>${job.type}</span>
                </div>
                <div class="meta-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${job.experience}</span>
                </div>
            </div>
            <div class="job-detail-salary">
                <span class="salary-amount">${job.salary}</span>
                <span class="salary-per">${job.salaryPer}</span>
            </div>
        </div>

        <div class="job-detail-content">
            <div class="job-detail-main">
                <section class="detail-section">
                    <h2>Deskripsi Pekerjaan</h2>
                    <p>${job.description}</p>
                </section>

                <section class="detail-section">
                    <h2>Tanggung Jawab</h2>
                    <ul class="detail-list">
                        ${job.responsibilities.map(item => `<li><span class="list-icon">✓</span>${item}</li>`).join('')}
                    </ul>
                </section>

                <section class="detail-section">
                    <h2>Persyaratan</h2>
                    <ul class="detail-list">
                        ${job.requirements.map(item => `<li><span class="list-icon">✓</span>${item}</li>`).join('')}
                    </ul>
                </section>

                <section class="detail-section">
                    <h2>Benefit & Fasilitas</h2>
                    <div class="benefits-grid">
                        ${job.benefits.map(item => `
                            <div class="benefit-item">
                                <span class="benefit-icon">✦</span>
                                <span>${item}</span>
                            </div>
                        `).join('')}
                    </div>
                </section>
            </div>

            <aside class="job-detail-sidebar">
                <div class="apply-card">
                    <h3>Tertarik dengan Posisi Ini?</h3>
                    <p>Lamar sekarang dan mulai karir premium Anda bersama kami!</p>
                    <a href="lamar.html?job=${job.id}" class="cta-button-large">
                        <span>Lamar Sekarang</span>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                    <a href="https://wa.me/6289669094929?text=Halo%20Liguns%20Entertainment,%20saya%20tertarik%20dengan%20posisi%20${encodeURIComponent(job.title)}" 
                       target="_blank" class="cta-button-whatsapp">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>Hubungi via WhatsApp</span>
                    </a>
                </div>

                <div class="share-card">
                    <h4>Bagikan Lowongan</h4>
                    <div class="share-buttons">
                        <button onclick="shareToWhatsApp()" class="share-btn" title="WhatsApp">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                        </button>
                        <button onclick="copyLink()" class="share-btn" title="Copy Link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    `;
}

// Share functions
function shareToWhatsApp() {
    const job = jobData[getJobIdFromURL()];
    if (!job) return;

    const text = `Lihat lowongan ${job.title} di Liguns Entertainment! ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link berhasil disalin!');
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', renderJobDetail);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { jobData };
}
