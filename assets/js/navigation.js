// ===============================================
// LIGUNS ENTERTAINMENT - NAVIGATION JS
// ===============================================

document.addEventListener('DOMContentLoaded', function () {

    // ===== FADE IN SECTIONS ON SCROLL =====
    const fadeSections = document.querySelectorAll('.fade-section');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeSections.forEach(section => {
        fadeObserver.observe(section);
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.padding = '0.5rem 0';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.padding = '1rem 0';
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // ===== ACTIVE NAV LINK =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#navbar ul li a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // ===== PAGE TRANSITION ON LINK CLICK =====
    const pageLinks = document.querySelectorAll('a[href$=".html"]');

    pageLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip external links
            if (href.startsWith('http') || href.startsWith('//')) return;

            e.preventDefault();
            document.body.classList.add('fade-out');

            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });

    console.log('✦ Liguns Entertainment - Navigation Loaded');
});

// ===== FADE OUT ANIMATION =====
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .fade-out {
      animation: fadeOut 0.3s ease-out forwards;
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; transform: translateY(-10px); }
    }
  </style>
`);
