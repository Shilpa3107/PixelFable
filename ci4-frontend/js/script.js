
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
    checkAuth(); // Check user login status
});

/**
 * Authentication Check
 * Shows user name in header if logged in
 */
function checkAuth() {
    const userStr = localStorage.getItem('pf_user');
    console.log('--- PF Auth Check ---');
    console.log('User string from storage:', userStr);

    if (!userStr) {
        console.log('No user logged in.');
        return;
    }

    try {
        const user = JSON.parse(userStr);
        if (!user || (!user.name && !user.email)) return;

        const displayName = user.name ? user.name.split(' ')[0] : user.email.split('@')[0];
        console.log('Display name:', displayName);

        // Update Desktop Header
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            // Remove existing user info to avoid duplicates
            const existing = navActions.querySelector('.user-nav-info');
            if (existing) existing.remove();

            // Hide/Remove ALL login buttons in the navbar
            const loginBtns = document.querySelectorAll('.login-btn, a[href*="login.html"]');
            loginBtns.forEach(btn => {
                if (navActions.contains(btn)) {
                    btn.style.display = 'none'; // Hide instead of remove to be safe
                }
            });

            // Create User Display
            const userDiv = document.createElement('div');
            userDiv.className = 'user-nav-info';
            userDiv.style.cssText = 'display:flex; align-items:center; gap:0.75rem; margin-left:1rem;';
            userDiv.innerHTML = `
                <span style="color:white; font-weight:600; font-size:0.85rem;">Hi, ${displayName}</span>
                <button class="logout-btn" style="background:transparent; color:#ff4d4d; border:1px solid #ff4d4d; border-radius:4px; padding:0.3rem 0.6rem; font-size:0.75rem; cursor:pointer; transition:all 0.3s;">Logout</button>
            `;

            const btn = userDiv.querySelector('.logout-btn');
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
            btn.addEventListener('mouseover', () => { btn.style.background = '#ff4d4d'; btn.style.color = 'white'; });
            btn.addEventListener('mouseout', () => { btn.style.background = 'transparent'; btn.style.color = '#ff4d4d'; });

            navActions.appendChild(userDiv);
            console.log('Desktop header updated.');
        }
    } catch (err) {
        console.error('Auth check error:', err);
    }
}

// Ensure it runs after all scripts and styles are loaded
window.addEventListener('load', checkAuth);

function logout() {
    localStorage.removeItem('pf_user');
    localStorage.removeItem('pf_token');
    // Also clear cart if you want, but usually session stays
    window.location.reload();
}

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

    if (!container || !dotsContainer) return;

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
    if (!grid) return;

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
    const actions = document.querySelector('.nav-actions');

    if (btn && links) {
        btn.addEventListener('click', () => {
            const isVisible = links.style.display === 'flex';

            [links, actions].forEach(el => {
                if (!el) return;
                el.style.display = isVisible ? 'none' : 'flex';
                el.style.flexDirection = 'column';
                el.style.position = 'absolute';
                el.style.top = (80 + (el === actions ? links.offsetHeight : 0)) + 'px';
                el.style.left = '0';
                el.style.width = '100%';
                el.style.background = 'black';
                el.style.padding = '1rem 2rem';
                el.style.zIndex = '999';
            });

            if (actions) actions.style.top = (80 + links.offsetHeight) + 'px';
        });
    }
}
