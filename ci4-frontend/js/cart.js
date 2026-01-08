/**
 * Cart Logic for PixelFable
 * Uses localStorage to persist cart data
 */

const CART_STORAGE_KEY = 'pixelfable_cart';

document.addEventListener('DOMContentLoaded', () => {
    initCart();
});

function initCart() {
    const cart = getCart();
    renderCart(cart);
    updateNavbarCartCount(cart);

    // Setup clear cart listener (if needed) or individual item removals via delegation
    document.getElementById('proceed-to-payment')?.addEventListener('click', proceedToPayment);
}

/**
 * Get cart from localStorage
 */
function getCart() {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateNavbarCartCount(cart);
}

/**
 * Add item to cart
 * Note: Since these are presets, quantity is usually 1, but we handle it just in case
 */
function addToCart(item) {
    let cart = getCart();
    const existingIndex = cart.findIndex(i => i.id === item.id);

    if (existingIndex > -1) {
        // Just increment quantity if it already exists
        cart[existingIndex].quantity += 1;
    } else {
        // Add new item
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image || item.images[0],
            category: item.category || item.section || 'Preset',
            quantity: 1
        });
    }

    saveCart(cart);
    alert(`"${item.name}" added to cart!`);
}

/**
 * Remove item from cart
 */
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart(cart);
}

/**
 * Update Navbar Cart Count
 */
function updateNavbarCartCount(cart) {
    const countEl = document.querySelector('.cart-count');
    if (countEl) {
        const totalItems = (cart || getCart()).reduce((sum, item) => sum + item.quantity, 0);
        countEl.textContent = totalItems;
    }
}

/**
 * Render Cart Page
 */
function renderCart(cart) {
    const emptyView = document.getElementById('empty-cart-view');
    const contentView = document.getElementById('cart-content-view');
    const itemsList = document.getElementById('cart-items-list');
    const itemsCountEl = document.getElementById('cart-items-count');

    if (!cart || cart.length === 0) {
        if (emptyView) emptyView.style.display = 'block';
        if (contentView) contentView.style.display = 'none';
        return;
    }

    if (emptyView) emptyView.style.display = 'none';
    if (contentView) contentView.style.display = 'block';

    itemsCountEl.textContent = cart.length;
    itemsList.innerHTML = '';

    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-category">${item.category}</p>
                <div class="cart-item-controls">
                    <span class="quantity-display">
                        Quantity: <span class="quantity-val">${item.quantity}</span>
                    </span>
                    <span class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove Item">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        `;
        itemsList.appendChild(itemEl);
    });

    updateSummary(cart);
}

/**
 * Update Summary Card
 */
function updateSummary(cart) {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (subtotalEl) subtotalEl.textContent = `₹${total.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
}

/**
 * Proceed to Checkout
 */
function proceedToPayment() {
    const cart = getCart();
    if (cart.length === 0) return;

    // Redirect to the CI4 Backend Checkout Page
    // Assuming the backend is hosted at this path relative to the root
    const backendCheckoutUrl = 'http://localhost/pixelFable-main/ci4-backend/public/index.php/checkout';

    console.log('Redirecting to checkout:', backendCheckoutUrl);
    window.location.href = backendCheckoutUrl;
}

// Export for use in other scripts
window.getCart = getCart;
window.saveCart = saveCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateNavbarCartCount = updateNavbarCartCount;
