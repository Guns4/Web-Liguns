// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Get all FAQ items
    const faqItems = document.querySelectorAll('.faq-sosial-item, .faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-sosial-question, .faq-question');

        if (question) {
            question.addEventListener('click', function () {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
