<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout | PixelFable</title>
    <!-- Use base_url for backend assets if needed, but for frontend consistency let's use the external style -->
    <link rel="stylesheet" href="http://localhost/pixelFable-main/ci4-frontend/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            --glass-bg: rgba(30, 41, 59, 0.7);
            --border-color: rgba(255, 255, 255, 0.1);
        }

        body {
            background-color: #000;
            background-image: 
                radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.1) 0px, transparent 50%);
            min-height: 100vh;
            color: #fff;
            font-family: 'Inter', sans-serif;
        }

        .checkout-page {
            padding-top: 100px;
            padding-bottom: 80px;
        }

        .checkout-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .checkout-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 40px;
        }

        @media (max-width: 968px) {
            .checkout-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Glass Cards */
        .glass-card {
            background: var(--glass-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            padding: 32px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .section-title svg {
            color: #6366f1;
        }

        /* Form Styling */
        .form-group {
            margin-bottom: 20px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: #94a3b8;
            margin-bottom: 8px;
        }

        input, select, textarea {
            width: 100%;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 12px 16px;
            color: #fff;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }

        input:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        /* Order Review */
        .order-summary-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 24px;
        }

        .order-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .order-item:last-child {
            border-bottom: none;
        }

        .order-item img {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            object-fit: cover;
        }

        .order-item-info {
            flex: 1;
        }

        .order-item-name {
            font-weight: 600;
            font-size: 1rem;
            margin-bottom: 4px;
        }

        .order-item-meta {
            font-size: 0.875rem;
            color: #94a3b8;
        }

        .order-item-price {
            font-weight: 700;
            color: #fff;
        }

        /* Totals */
        .totals-section {
            background: rgba(15, 23, 42, 0.4);
            border-radius: 16px;
            padding: 20px;
            margin-top: 24px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 0.95rem;
            color: #94a3b8;
        }

        .total-row.grand-total {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            font-weight: 800;
            font-size: 1.25rem;
        }

        .grand-total .price {
            color: #fbbf24;
        }

        /* Payment Methods */
        .payment-methods {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 24px;
        }

        .payment-option {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .payment-option:hover {
            border-color: rgba(99, 102, 241, 0.5);
        }

        .payment-option.active {
            border-color: #6366f1;
            background: rgba(99, 102, 241, 0.05);
        }

        .radio-circle {
            width: 20px;
            height: 20px;
            border: 2px solid #334155;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .active .radio-circle {
            border-color: #6366f1;
        }

        .active .radio-circle::after {
            content: '';
            width: 10px;
            height: 10px;
            background: #6366f1;
            border-radius: 50%;
        }

        .btn-pay {
            width: 100%;
            background: var(--primary-gradient);
            color: white;
            border: none;
            padding: 18px;
            border-radius: 14px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            margin-top: 32px;
            transition: all 0.3s;
            box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
        }

        .btn-pay:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(99, 102, 241, 0.3);
            filter: brightness(1.1);
        }

        .btn-pay:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
        }

        /* Step Indicators */
        .checkout-steps {
            display: flex;
            justify-content: center;
            margin-bottom: 48px;
            gap: 16px;
        }

        .step {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #475569;
            font-weight: 600;
        }

        .step.active {
            color: #fff;
        }

        .step-num {
            width: 28px;
            height: 28px;
            background: #1e293b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
        }

        .active .step-num {
            background: #6366f1;
        }

        .step-line {
            width: 40px;
            height: 2px;
            background: #1e293b;
            margin: 0 8px;
        }

        /* Navbar Re-style for Checkout */
        .checkout-nav {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(10px);
            z-index: 1000;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding: 20px 0;
        }

        .nav-content {
            max-width: 1100px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            font-size: 1.5rem;
            text-decoration: none;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .logo span { color: #6366f1; }
    </style>
</head>
<body>

    <nav class="checkout-nav">
        <div class="nav-content">
            <a href="http://localhost/pixelFable-main/ci4-frontend/index.html" class="logo">
                <img src="http://localhost/pixelFable-main/ci4-frontend/assets/pixelfableWhite.png" alt="" style="height: 30px;">
                PIXEL<span>FABLE</span>
            </a>
            <a href="http://localhost/pixelFable-main/ci4-frontend/cart.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem; font-weight: 500;">&larr; Back to Cart</a>
        </div>
    </nav>

    <main class="checkout-page">
        <div class="checkout-container">
            
            <div class="checkout-steps">
                <div class="step">
                    <div class="step-num">✓</div>
                    <span>Cart</span>
                </div>
                <div class="step-line"></div>
                <div class="step active">
                    <div class="step-num">2</div>
                    <span>Checkout</span>
                </div>
                <div class="step-line"></div>
                <div class="step">
                    <div class="step-num">3</div>
                    <span>Payment</span>
                </div>
            </div>

            <form id="checkout-form">
                <div class="checkout-grid">
                    
                    <!-- Left: Details -->
                    <div class="checkout-main">
                        <div class="glass-card">
                            <h2 class="section-title">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                Billing Information
                            </h2>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="first_name">First Name</label>
                                    <input type="text" id="first_name" name="first_name" placeholder="John" required>
                                </div>
                                <div class="form-group">
                                    <label for="last_name">Last Name</label>
                                    <input type="text" id="last_name" name="last_name" placeholder="Doe" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="email">Email Address (Downloads will be sent here)</label>
                                <input type="email" id="email" name="email" placeholder="john@example.com" required>
                            </div>

                            <div class="form-group">
                                <label for="phone">Phone Number (Optional)</label>
                                <input type="tel" id="phone" name="phone" placeholder="+91 98765 43210">
                            </div>

                            <h2 class="section-title" style="margin-top: 40px;">
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                Payment Method
                            </h2>

                            <div class="payment-methods">
                                <div class="payment-option active" onclick="selectPayment('razorpay')">
                                    <div class="radio-circle"></div>
                                    <div class="payment-info">
                                        <div style="font-weight: 600;">Razorpay (Cards, UPI, Netbanking)</div>
                                        <div style="font-size: 0.8rem; color: #94a3b8;">Secure online payment via Razorpay gateway</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Summary -->
                    <div class="checkout-sidebar">
                        <div class="glass-card" style="padding: 24px;">
                            <h2 class="section-title" style="font-size: 1.25rem;">Order Summary</h2>
                            
                            <div id="checkout-items" class="order-summary-list">
                                <!-- Items injected JS -->
                                <div style="color: #94a3b8; text-align: center; padding: 20px;">Loading items...</div>
                            </div>

                            <div class="totals-section">
                                <div class="total-row">
                                    <span>Subtotal</span>
                                    <span id="subtotal">₹0.00</span>
                                </div>
                                <div class="total-row">
                                    <span>Taxes (GST 0%)</span>
                                    <span>₹0.00</span>
                                </div>
                                <div class="total-row grand-total">
                                    <span>Total Amount</span>
                                    <span class="price" id="grand-total">₹0.00</span>
                                </div>
                            </div>

                            <button type="submit" id="btn-submit" class="btn-pay">
                                Complete Purchase
                            </button>

                            <div style="margin-top: 24px; text-align: center; font-size: 0.8rem; color: #475569; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                Secure 256-bit SSL Encrypted Payment
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    </main>

    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script>
        const API_BASE = "<?= base_url('api') ?>";
        const CART_KEY = 'pixelfable_cart';

        document.addEventListener('DOMContentLoaded', () => {
            initCheckout();
            setupForm();
        });

        function initCheckout() {
            const data = localStorage.getItem(CART_KEY);
            const cart = data ? JSON.parse(data) : [];

            if (cart.length === 0) {
                alert("Your cart is empty. Redirecting to presets...");
                window.location.href = "<?= base_url('../ci4-frontend/presets.html') ?>";
                return;
            }

            renderItems(cart);
            calculateTotals(cart);
        }

        function renderItems(cart) {
            const container = document.getElementById('checkout-items');
            container.innerHTML = '';

            cart.forEach(item => {
                const div = document.createElement('div');
                div.className = 'order-item';
                div.innerHTML = `
                    <img src="${item.image}" alt="">
                    <div class="order-item-info">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-meta">Qty: ${item.quantity} · ${item.category}</div>
                    </div>
                    <div class="order-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                `;
                container.appendChild(div);
            });
        }

        function calculateTotals(cart) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('subtotal').textContent = `₹${total.toFixed(2)}`;
            document.getElementById('grand-total').textContent = `₹${total.toFixed(2)}`;
        }

        function selectPayment(type) {
            // Placeholder for Multiple payment options
            console.log("Selected payment type:", type);
        }

        function setupForm() {
            const form = document.getElementById('checkout-form');
            const submitBtn = document.getElementById('btn-submit');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const customerData = {
                    firstName: formData.get('first_name'),
                    lastName: formData.get('last_name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                };

                const cart = JSON.parse(localStorage.getItem(CART_KEY));
                
                // Disable button
                submitBtn.disabled = true;
                submitBtn.textContent = "Processing...";

                try {
                    // 1. For simplicity, we process first item for now or send multiple
                    // Our current PaymentController handles one preset_id. 
                    // Let's adapt to handle the first one or loop.
                    // Ideally, we'd have a bulk purchase endpoint.
                    
                    const item = cart[0]; // Process first item in this demo integration
                    
                    const response = await fetch(`${API_BASE}/payments/create-order`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            preset_id: item.id,
                            customer_email: customerData.email,
                            customer_name: `${customerData.firstName} ${customerData.lastName}`,
                            customer_phone: customerData.phone
                        })
                    });

                    const result = await response.json();
                    
                    if (result.status === 200) {
                        launchRazorpay(result.data, customerData);
                    } else {
                        throw new Error(result.message || "Failed to create order");
                    }

                } catch (error) {
                    alert("Error: " + error.message);
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Complete Purchase";
                }
            });
        }

        function launchRazorpay(orderData, customer) {
            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "PixelFable",
                description: "Purchase of Professional Presets",
                image: "<?= base_url('../ci4-frontend/assets/pixelfableWhite.png') ?>",
                order_id: orderData.id,
                handler: async function (response) {
                    // Verify Payment
                    try {
                        const verifyRes = await fetch(`${API_BASE}/payments/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });
                        
                        const verifyResult = await verifyRes.json();
                        if (verifyResult.status === 200) {
                            // Success! Clear cart and redirect
                            localStorage.removeItem(CART_KEY);
                            window.location.href = verifyResult.redirect_url;
                        } else {
                            alert("Payment verification failed. Please contact support.");
                        }
                    } catch (e) {
                        alert("Error verifying payment.");
                    }
                },
                prefill: {
                    name: customer.firstName + " " + customer.lastName,
                    email: customer.email,
                    contact: customer.phone
                },
                theme: { color: "#6366f1" }
            };

            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert("Payment failed: " + response.error.description);
            });
            rzp.open();
        }
    </script>
</body>
</html>
