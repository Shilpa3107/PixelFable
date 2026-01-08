// Backend API Base URL
const API_BASE = 'http://localhost/pixelFable-main/ci4-backend/public/index.php/api';

let currentPreset = null;
let currentImageIndex = 0;
let images = [];

document.addEventListener('DOMContentLoaded', () => {
    // Get preset ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const presetId = urlParams.get('id');

    if (presetId) {
        fetchPresetDetails(presetId);
    } else {
        showError('No preset ID provided');
    }

    // Setup event listeners
    setupImageNavigation();
    setupAddToCart();
});

async function fetchPresetDetails(id) {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const detailsContent = document.getElementById('details-content');

    try {
        loadingState.style.display = 'block';
        errorState.style.display = 'none';
        detailsContent.style.display = 'none';

        const response = await fetch(`${API_BASE}/presets/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        const preset = json.data;

        if (!preset) {
            throw new Error('Preset not found');
        }

        // Normalize preset data
        currentPreset = {
            id: preset.id,
            name: preset.name,
            description: preset.description || 'This preset brings cinematic color tones and balanced contrast optimized for professional edits.',
            price: parseFloat(preset.price),
            category: preset.category || 'General',
            images: normalizeImages(preset.images),
            originalData: preset
        };

        images = currentPreset.images;
        currentImageIndex = 0;

        renderPresetDetails();

        loadingState.style.display = 'none';
        detailsContent.style.display = 'block';

    } catch (error) {
        console.error('Fetch Error:', error);
        showError(error.message);
    }
}

function normalizeImages(imgs) {
    if (!imgs || imgs.length === 0) {
        return ['assets/placeholder-image.jpg'];
    }

    return imgs.map(img => {
        const rawPath = img.path || img.url || img;
        if (rawPath && !rawPath.startsWith('http')) {
            return `http://localhost/pixelFable-main/ci4-backend/public/${rawPath}`;
        }
        return rawPath || 'assets/placeholder-image.jpg';
    });
}

function renderPresetDetails() {
    // Update breadcrumb
    document.getElementById('breadcrumb-category').textContent = currentPreset.category;
    document.getElementById('breadcrumb-name').textContent = currentPreset.name;

    // Update title and info
    document.getElementById('preset-title').textContent = currentPreset.name;
    document.getElementById('preset-category').textContent = currentPreset.category;
    document.getElementById('preset-price').textContent = `₹${currentPreset.price}`;
    document.getElementById('preset-description').textContent = currentPreset.description;

    // Render thumbnails
    renderThumbnails();

    // Set initial image
    updateMainImage();

    // Show/hide navigation buttons based on image count
    const navButtons = document.querySelectorAll('.image-nav-btn');
    const imageCounter = document.getElementById('image-counter');

    if (images.length > 1) {
        navButtons.forEach(btn => btn.style.display = 'flex');
        imageCounter.style.display = 'block';
        updateImageCounter();
    } else {
        navButtons.forEach(btn => btn.style.display = 'none');
        imageCounter.style.display = 'none';
    }
}

function renderThumbnails() {
    const mobileContainer = document.getElementById('thumbnails-mobile');
    const desktopContainer = document.getElementById('thumbnails-vertical');

    mobileContainer.innerHTML = '';
    desktopContainer.innerHTML = '';

    images.forEach((src, index) => {
        // Mobile thumbnail
        const mobileThumbnail = createThumbnail(src, index);
        mobileContainer.appendChild(mobileThumbnail);

        // Desktop thumbnail
        const desktopThumbnail = createThumbnail(src, index);
        desktopContainer.appendChild(desktopThumbnail);
    });
}

function createThumbnail(src, index) {
    const button = document.createElement('button');
    button.classList.add('thumbnail-btn');
    if (index === currentImageIndex) {
        button.classList.add('active');
    }

    button.onclick = () => {
        currentImageIndex = index;
        updateMainImage();
        updateThumbnails();
        updateImageCounter();
    };

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Thumbnail ${index + 1}`;
    img.onerror = () => {
        img.src = 'assets/placeholder-image.jpg';
    };

    button.appendChild(img);
    return button;
}

function updateMainImage() {
    const mainImage = document.getElementById('main-image');
    const mainImageMobile = document.getElementById('main-image-mobile');

    const currentImage = images[currentImageIndex];

    mainImage.src = currentImage;
    mainImage.alt = currentPreset.name;
    mainImage.onerror = () => {
        mainImage.src = 'assets/placeholder-image.jpg';
    };

    mainImageMobile.src = currentImage;
    mainImageMobile.alt = currentPreset.name;
    mainImageMobile.onerror = () => {
        mainImageMobile.src = 'assets/placeholder-image.jpg';
    };
}

function updateThumbnails() {
    const allThumbnails = document.querySelectorAll('.thumbnail-btn');
    allThumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function updateImageCounter() {
    document.getElementById('current-image-num').textContent = currentImageIndex + 1;
    document.getElementById('total-images').textContent = images.length;
}

function setupImageNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.addEventListener('click', () => {
        currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        updateMainImage();
        updateThumbnails();
        updateImageCounter();
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        updateMainImage();
        updateThumbnails();
        updateImageCounter();
    });
}

function setupAddToCart() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    addToCartBtn.addEventListener('click', () => {
        if (!currentPreset) return;

        // Persistent Cart Logic
        let cartData = localStorage.getItem('pixelfable_cart');
        let cart = cartData ? JSON.parse(cartData) : [];

        const existingIndex = cart.findIndex(i => i.id === currentPreset.id);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                id: currentPreset.id,
                name: currentPreset.name,
                price: currentPreset.price,
                image: currentPreset.images[0],
                category: currentPreset.category,
                quantity: 1
            });
        }

        localStorage.setItem('pixelfable_cart', JSON.stringify(cart));

        // Update Navbar UI
        const countEl = document.querySelector('.cart-count');
        if (countEl) {
            countEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
        }

        // Show confirmation
        alert(`Added "${currentPreset.name}" to cart!`);
    });
}

function showError(message) {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const detailsContent = document.getElementById('details-content');

    loadingState.style.display = 'none';
    detailsContent.style.display = 'none';
    errorState.style.display = 'block';

    document.getElementById('error-message').textContent = message;
}
