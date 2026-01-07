// ===============================================
// LIGUNS ENTERTAINMENT - LOWONGAN FILTER JS
// ===============================================

document.addEventListener('DOMContentLoaded', function () {

    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lowonganGrid = document.getElementById('lowonganGrid');
    const noResults = document.getElementById('noResults');
    const lowonganCards = document.querySelectorAll('.lowongan-card');

    let activeFilter = 'all';

    // ===== FILTER BY CITY =====
    function filterCards() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        lowonganCards.forEach(card => {
            const cardCity = card.dataset.city || '';
            const cardName = card.dataset.name || '';
            const cardPosisi = card.querySelector('.card-posisi')?.textContent.toLowerCase() || '';

            // Check filter match
            const matchFilter = activeFilter === 'all' || cardCity === activeFilter;

            // Check search match
            const matchSearch = !searchTerm ||
                cardName.toLowerCase().includes(searchTerm) ||
                cardCity.includes(searchTerm) ||
                cardPosisi.includes(searchTerm);

            if (matchFilter && matchSearch) {
                card.style.display = '';
                card.style.animation = 'fadeIn 0.3s ease-out';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // ===== FILTER BUTTON CLICKS =====
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update filter
            activeFilter = this.dataset.filter;
            filterCards();
        });
    });

    // ===== SEARCH INPUT =====
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            filterCards();
        });

        // Clear search on escape
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                this.value = '';
                filterCards();
            }
        });
    }

    // ===== RESET FILTERS =====
    window.resetFilters = function () {
        // Reset search
        if (searchInput) {
            searchInput.value = '';
        }

        // Reset filter to all
        activeFilter = 'all';
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            }
        });

        filterCards();
    };

    // ===== CARD HOVER EFFECTS =====
    lowonganCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function () {
            this.style.zIndex = '';
        });
    });

    console.log('✦ Liguns Entertainment - Lowongan Filter Loaded');
});

// ===== FADE IN ANIMATION =====
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
`);
