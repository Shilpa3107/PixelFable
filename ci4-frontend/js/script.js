
// Mock Data (matches React component)
const heroImages = [
    "assets/hero1.jpg",
    "assets/hero2.jpg",
    "assets/hero3-optimized.webp"
];

const featuredPresets = [
    {
        name: "Cinematic",
        image: "assets/cinematic-INTOTHEWOODSPOST01.jpg",
        description: "Inspired by Hollywood films. Deep contrast and desaturated shadows create mood and emotion."
    },
    {
        name: "Teal & Orange",
        image: "assets/teal&orangeKeralaPost01.jpg",
        description: "Popular stylized look with warm skin tones and cool shadows. Perfect for travel vlogs and YouTube."
    },
    {
        name: "Vintage / Retro",
        image: "assets/vintageRetro.jpg",
        description: "Faded blacks, grainy texture and sepia tones for a nostalgic, retro vibe."
    },
    {
        name: "Dark & Moody",
        image: "assets/darkPABLOPOST01.jpg",
        description: "Desaturated, deep blacks, and cool shadows. Emphasizes emotion and artistic drama."
    },
    {
        name: "Film Look / Analog",
        image: "assets/filmMOTOMADNESSPOST01.jpg",
        description: "Emulates analog film. Slight grain, rich colors, balanced highlights."
    },
    {
        name: "Nature Vibes",
        image: "assets/THENATUREOFLOVEPOST01.jpg",
        description: "Inspired by the beauty of the outdoors. Lush greens, natural tones, and vibrant landscapes."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    renderPresets();
    initMobileMenu();
    updateNavbarCartCount(); // Initialize cart count on load
});

/**
 * Helper to update navbar cart count across all pages
 */
function updateNavbarCartCount() {
    const data = localStorage.getItem('pixelfable_cart');
    const cart = data ? JSON.parse(data) : [];
    const countEl = document.querySelector('.cart-count');
    if (countEl) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        countEl.textContent = totalItems;
    }
}

function initHeroSlider() {
    const container = document.getElementById('hero-bg-container');
    const dotsContainer = document.getElementById('hero-slider-dots');
    let currentIndex = 0;
    let interval;

    // 1. Inject Images
    heroImages.forEach((src, idx) => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('hero-bg-img');
        if (idx === 0) img.classList.add('active');
        img.alt = `Hero Background ${idx + 1}`;
        container.insertBefore(img, container.firstChild); // Insert before overlays

        // Dots
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    const images = document.querySelectorAll('.hero-bg-img');
    const dots = document.querySelectorAll('.dot');

    function showSlide(index) {
        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        images[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    function nextSlide() {
        let newIndex = (currentIndex + 1) % heroImages.length;
        showSlide(newIndex);
    }

    function prevSlide() {
        let newIndex = (currentIndex - 1 + heroImages.length) % heroImages.length;
        showSlide(newIndex);
    }

    function goToSlide(index) {
        resetInterval();
        showSlide(index);
    }

    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 5000);
    }

    // Controls
    document.querySelector('.slider-arrow.next').addEventListener('click', () => {
        resetInterval();
        nextSlide();
    });

    document.querySelector('.slider-arrow.prev').addEventListener('click', () => {
        resetInterval();
        prevSlide();
    });

    // Auto Play
    interval = setInterval(nextSlide, 5000);
}

function renderPresets() {
    const grid = document.getElementById('presets-grid');

    featuredPresets.forEach(preset => {
        const card = document.createElement('a');
        card.href = 'presets.html';
        card.classList.add('preset-card');

        card.innerHTML = `
            <div class="card-img-container">
                <img src="${preset.image}" alt="${preset.name}" class="card-img" loading="lazy">
                <div class="card-badge">Featured</div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${preset.name}</h3>
                <p class="card-desc">${preset.description}</p>
            </div>
        `;

        grid.appendChild(card);
    });
}

function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const links = document.querySelector('.nav-links');

    if (btn) {
        btn.addEventListener('click', () => {
            // Simple toggle for now, in a real app would toggle class on nav container
            links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
            links.style.flexDirection = 'column';
            links.style.position = 'absolute';
            links.style.top = '80px';
            links.style.left = '0';
            links.style.width = '100%';
            links.style.background = 'black';
            links.style.padding = '2rem';
        });
    }
}
