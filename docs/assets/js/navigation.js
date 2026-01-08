// ===================================
// NAVIGATION & PAGE ENHANCEMENTS
// ===================================

document.addEventListener('DOMContentLoaded', function () {

    // ===== Smooth Page Load Animation =====
    document.body.classList.add('loaded');

    // ===== Intersection Observer for Fade-in Animations =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-section elements
    document.querySelectorAll('.fade-section').forEach(section => {
        observer.observe(section);
    });

    // ===== Mobile Menu Toggle (if needed) =====
    const navbar = document.getElementById('navbar');
    const menuToggle = document.querySelector('.menu-toggle');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', function () {
            navbar.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
                navbar.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== Scroll-triggered Animations =====
    let scrollPosition = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', function () {
        scrollPosition = window.scrollY;

        // Add shadow to header on scroll
        if (header) {
            if (scrollPosition > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // ===== Number Counter Animation for Metrics =====
    const animateCounters = () => {
        const counters = document.querySelectorAll('.metric-number');

        counters.forEach(counter => {
            const target = counter.textContent;
            const isPercentage = target.includes('%');
            const isPlus = target.includes('+');
            const numValue = parseFloat(target.replace(/[^0-9.]/g, ''));

            if (!isNaN(numValue)) {
                let current = 0;
                const increment = numValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numValue) {
                        current = numValue;
                        clearInterval(timer);
                    }

                    let displayValue = Math.floor(current);
                    if (target.includes('M')) {
                        displayValue = (current).toFixed(1) + 'M';
                    } else if (target.includes('K')) {
                        displayValue = (current).toFixed(0) + 'K';
                    } else if (isPercentage) {
                        displayValue = Math.floor(current) + '%';
                    } else if (isPlus) {
                        displayValue = Math.floor(current) + '+';
                    }

                    counter.textContent = displayValue;
                }, 20);
            }
        });
    };

    // Trigger counter animation when metrics section is visible
    const metricsSection = document.querySelector('.success-metrics-section');
    if (metricsSection) {
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    metricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        metricsObserver.observe(metricsSection);
    }

    // ===== Testimonial Card Hover Effect =====
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== Portfolio Card Hover Effect =====
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // ===== Back to Top Button (Optional) =====
    const createBackToTop = () => {
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Kembali ke atas');
        document.body.appendChild(button);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // Uncomment to enable back to top button
    // createBackToTop();

    // ===== Form Validation (if forms exist) =====
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');

                    // Remove error class on input
                    input.addEventListener('input', function () {
                        this.classList.remove('error');
                    });
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Mohon lengkapi semua field yang diperlukan.');
            }
        });
    });

    // ===== Lazy Loading Images (if needed) =====
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ===== Console Message =====
    console.log('%c✨ Liguns Entertainment - Manajemen Sosial Media ✨',
        'font-size: 20px; font-weight: bold; color: #667eea; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);');
    console.log('%cHalaman website telah dimuat dengan sukses!',
        'font-size: 14px; color: #764ba2;');
});

// ===== Page Visibility API - Pause animations when tab is not active =====
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // Pause expensive animations when tab is not visible
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});

// ===== Performance Monitoring (Optional) =====
window.addEventListener('load', function () {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

        if (pageLoadTime > 0) {
            console.log(`⚡ Page loaded in ${(pageLoadTime / 1000).toFixed(2)} seconds`);
        }
    }
});
