// Backend API Base URL
const API_BASE = 'http://localhost/pixelFable-main/ci4-backend/public/index.php/api';

let currentPresets = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchPresets();
    setupSorting();
});

async function fetchPresets() {
    const grid = document.getElementById('all-presets-grid');

    try {
        const response = await fetch(`${API_BASE}/presets`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        // Ensure we're working with an array
        const data = Array.isArray(json.data) ? json.data : [];

        // Map backend data to frontend model
        currentPresets = data.map(preset => {
            // Normalize image path: prepend API URL if it's a relative path from uploads
            let displayImage = 'assets/placeholder-image.jpg';
            if (preset.images && preset.images.length > 0) {
                const rawPath = preset.images[0].path || preset.images[0].url || '';
                if (rawPath) {
                    displayImage = `http://localhost/pixelFable-main/ci4-backend/public/${rawPath}`;
                }
            } else if (preset.drive_link && (preset.drive_link.endsWith('.jpg') || preset.drive_link.endsWith('.png'))) {
                // Fallback if drive_link was used for image URL in legacy data
                displayImage = preset.drive_link;
            }

            return {
                id: preset.id,
                name: preset.name,
                description: preset.description || 'Professional grade preset.',
                price: parseFloat(preset.price),
                category: preset.category || 'General',
                images: [displayImage], // Normalized array
                originalData: preset // Keep raw data just in case
            };
        });

        renderPresets(currentPresets);
        updateCount(currentPresets.length);

    } catch (error) {
        console.error('Fetch Error:', error);
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:3rem;">
                <h3 style="color:#ef4444; margin-bottom:1rem;">Failed to load presets</h3>
                <p style="color:#9ca3af;">${error.message}</p>
                <button onclick="fetchPresets()" style="margin-top:1rem; padding:0.5rem 1rem; background:#374151; color:white; border:none; border-radius:0.5rem; cursor:pointer;">Retry</button>
            </div>
        `;
    }
}

function renderPresets(presets) {
    const grid = document.getElementById('all-presets-grid');
    grid.innerHTML = ''; // Clear loader

    if (presets.length === 0) {
        grid.innerHTML = '<div style="text-align:center;color:#9ca3af;grid-column:1/-1;padding:3rem;">No presets found.</div>';
        return;
    }

    presets.forEach(preset => {
        const card = document.createElement('div');
        card.classList.add('preset-card');
        card.setAttribute('role', 'button');

        // Use the first image from our normalized array
        const imgPath = preset.images[0];

        card.innerHTML = `
            <div class="card-img-container">
                <img src="${imgPath}" alt="${preset.name}" class="card-img" loading="lazy" onerror="this.onerror=null;this.src='assets/placeholder-image.jpg';">
                <div class="card-overlay-hover"></div>
                <div class="cat-badge">${preset.category || 'Preset'}</div>
            </div>
            <div class="card-content" style="display:flex; flex-direction:column;">
                <h3 class="card-title">${preset.name}</h3>
                <p class="card-desc" style="flex:1;">${preset.description}</p>
                
                <div style="margin-top:1rem;">
                    <div class="price-tag">₹${preset.price}</div>
                    <div style="font-size:0.75rem; color:#9ca3af;">One-time purchase</div>
                </div>

                <div class="card-actions">
                    <button class="btn-icon btn-add-cart" onclick="addToCart('${preset.id}')">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        Add to Cart
                    </button>
                    <button class="btn-icon btn-buy-now" onclick="buyNow('${preset.id}')">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        Buy Now
                    </button>
                </div>
            </div>
        `;

        // Navigation on click (excluding buttons)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                // Navigate to details page (mock)
                console.log(`Navigating to preset ${preset.id}`);
                // window.location.href = `/preset-details.html?id=${preset.id}`;
            }
        });

        grid.appendChild(card);
    });
}

function updateCount(count) {
    document.getElementById('preset-count').textContent = count;
}

function setupSorting() {
    const sortSelect = document.getElementById('sortPresets');
    sortSelect.addEventListener('change', (e) => {
        const sortValue = e.target.value;
        sortPresets(sortValue);
    });
}

function sortPresets(criteria) {
    let sorted = [...currentPresets];

    switch (criteria) {
        case 'name-asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sorted.sort((a, b) => b.price - a.price);
            break;
    }

    renderPresets(sorted);
}

// Global functions for button clicks
window.addToCart = (id) => {
    // Find the preset to get its name
    const item = currentPresets.find(p => p.id == id);
    if (item) {
        console.log(`Added ${item.name} to cart`);
        // Mock cart UI update
        const countEl = document.querySelector('.cart-count');
        let count = parseInt(countEl.textContent || '0');
        countEl.textContent = count + 1;
        alert(`Added "${item.name}" to cart!`);
    }
};

window.buyNow = (id) => {
    // This is where we will hook into the Payment Flow later
    const item = currentPresets.find(p => p.id == id);
    if (item) {
        console.log(`Initiating checkout for ${item.name}`);
        // For now, just an alert. Next step: Hook into Razorpay
        alert(`Redirecting to checkout for: ${item.name} (₹${item.price})`);
    }
};
