/**
 * PixelFable Admin Dashboard - Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    lucide.createIcons();

    // Check Auth
    const token = localStorage.getItem('pf_token');
    if (!token) {
        window.location.href = '../ci4-frontend/login.html';
        return;
    }

    // Setup Sidebar Navigation
    setupNavigation();

    // Default: Dashboard
    renderView('dashboard');

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Admin Logout
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                // Clear tokens and redirect
                localStorage.removeItem('pf_token');
                localStorage.removeItem('pf_user');
                sessionStorage.clear(); // Clear any session data
                window.location.href = '../ci4-frontend/login.html';
            }
        });
    }
});

const API_BASE = 'http://localhost/pixelFable-main/ci4-backend/public/index.php/api';

/**
 * Handle Sidebar Navigation & View Switching
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-view]');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // UI Update
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const viewName = item.dataset.view;
            renderView(viewName);

            // Close sidebar on mobile after selection
            if (window.innerWidth <= 1024) {
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
}

/**
 * Main View Router
 */
async function renderView(viewName) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<div style="padding: 2rem; text-align: center; color: #6b7280;">Loading data...</div>';
    console.log(`Switching to view: ${viewName}`);

    switch (viewName) {
        case 'dashboard':
            await loadDashboard(contentArea);
            break;
        case 'users':
            await loadUsers(contentArea);
            break;
        case 'presets':
            await loadPresets(contentArea);
            break;
        case 'orders':
            await loadOrders(contentArea);
            break;
        case 'settings':
            renderSettingsView(contentArea);
            break;
        case 'payments':
            renderPaymentsView(contentArea);
            break;
        default:
            contentArea.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title">${viewName.charAt(0).toUpperCase() + viewName.slice(1)}</h1>
                    <p class="page-subtitle">This module is currently under development.</p>
                </div>
                <div class="stat-card" style="text-align: center; padding: 100px;">
                    <i data-lucide="construction" style="width: 64px; height: 64px; margin: 0 auto 20px; color: var(--color-primary);"></i>
                    <h2>Coming Soon</h2>
                    <p style="color: var(--color-text-muted);">We are working hard to bring you the ${viewName} management tools.</p>
                </div>
            `;
            lucide.createIcons();
    }
}

/**
 * Dashboard Loader
 */
async function loadDashboard(container) {
    try {
        // Fetch stats
        const response = await fetchWithAuth(`${API_BASE}/admin/dashboard`);
        const result = await response.json();
        const stats = result.data.stats;

        // Render basic structure
        container.innerHTML = `
            <div id="dashboard-view">
                <div class="page-header">
                    <h1 class="page-title">Dashboard Overview</h1>
                    <p class="page-subtitle">Welcome back, here's what's happening with PixelFable today.</p>
                </div>

                <!-- KPI Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Total Users</span>
                            <div class="stat-icon" style="background: rgba(99, 102, 241, 0.1); color: #6366f1;">
                                <i data-lucide="users"></i>
                            </div>
                        </div>
                        <div class="stat-value" id="count-users">${stats.total_users || 0}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Active Presets</span>
                            <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
                                <i data-lucide="palette"></i>
                            </div>
                        </div>
                        <div class="stat-value" id="count-presets">${stats.total_presets || 0}</div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-label">Active Users</span>
                             <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
                                <i data-lucide="users"></i>
                            </div>
                        </div>
                         <div class="stat-value" id="count-active-users">${stats.active_users || 0}</div>
                    </div>
                </div>

                <!-- Charts Area: Placeholder for now as we don't have historical data API yet -->
                <div class="charts-grid">
                     <div class="stat-card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                        <h3>Detailed Analytics Coming Soon</h3>
                        <p style="color: grey;">Historical data visualization will appear here once data logs generate.</p>
                     </div>
                </div>
            </div>
        `;
        lucide.createIcons();

    } catch (error) {
        container.innerHTML = `<div class="error-state">Failed to load dashboard: ${error.message}</div>`;
    }
}

/**
     * User Management Loader
     */
async function loadUsers(container) {
    try {
        const response = await fetchWithAuth(`${API_BASE}/admin/users`);
        const json = await response.json();
        const users = json.data || [];

        container.innerHTML = `
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <h1 class="page-title">User Management</h1>
                    <p class="page-subtitle">Manage customer accounts and administrative roles.</p>
                </div>
            </div>

            <div class="data-card">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => `
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <div style="width:32px;height:32px;border-radius:50%;background:#e0e7ff;color:#4f46e5;display:flex;align-items:center;justify-content:center;font-weight:bold;">
                                                ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <span style="font-weight: 600;">${user.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td>${user.email}</td>
                                    <td><span style="color: ${user.role === 'admin' ? 'var(--color-primary)' : 'inherit'}; font-weight: ${user.role === 'admin' ? '600' : '400'};">${user.role}</span></td>
                                    <td><span class="status-badge status-${user.is_active == 1 ? 'active' : 'inactive'}">${user.is_active == 1 ? 'Active' : 'Inactive'}</span></td>
                                    <td>
                                        <button class="btn-sm btn-outline" onclick="alert('Edit functionality coming soon')"><i data-lucide="edit-3" style="width: 14px;"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                     ${users.length === 0 ? '<div style="padding:20px;text-align:center;">No users found.</div>' : ''}
                </div>
            </div>
        `;
        lucide.createIcons();

    } catch (error) {
        container.innerHTML = `<div class="error-state">Failed to load users: ${error.message}</div>`;
    }
}

/**
 * Preset Management Loader
 */
async function loadPresets(container) {
    try {
        const response = await fetch(`${API_BASE}/presets`); // Public endpoint OK for list
        const json = await response.json();
        const presets = json.data || [];

        container.innerHTML = `
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h1 class="page-title">Preset Control</h1>
                    <p class="page-subtitle">Manage your product catalog.</p>
                </div>
                <!-- Add preset button could go here -->
            </div>

            <div class="presets-grid">
                ${presets.map(preset => `
                    <div class="preset-card">
                        <div class="preset-img-wrapper">
                            <img src="${getPresetImage(preset)}" class="preset-img" alt="${preset.name}" onerror="this.src='../ci4-frontend/assets/placeholder-image.jpg'">
                        </div>
                        <div class="preset-content">
                            <div class="preset-title">${preset.name}</div>
                            <div style="color: var(--color-text-muted); font-size: 0.875rem; margin-bottom: 12px;">${preset.category || 'General'}</div>
                            <div class="preset-price">₹${preset.price}</div>
                            
                            <div class="preset-actions">
                                <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="alert('Edit ID ${preset.id} coming soon')">
                                    <i data-lucide="edit-3" style="width: 14px; margin-right: 4px;"></i> Edit
                                </button>
                                <button class="btn btn-outline btn-sm" style="color: var(--color-danger);" onclick="deletePreset(${preset.id})">
                                    <i data-lucide="trash-2" style="width: 14px;"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
             ${presets.length === 0 ? '<div style="text-align:center;padding:40px;">No presets found. Create one via API or Seed.</div>' : ''}
        `;
        lucide.createIcons();

    } catch (error) {
        container.innerHTML = `<div class="error-state">Failed to load presets: ${error.message}</div>`;
    }
}

// Helper for preset image
function getPresetImage(preset) {
    if (preset.images && preset.images.length > 0) {
        // Check if it's a full URL or relative
        const path = preset.images[0].path || preset.images[0].url;
        if (path.startsWith('http')) return path;
        return `http://localhost/pixelFable-main/ci4-backend/public/${path}`;
    }
    if (preset.drive_link && (preset.drive_link.endsWith('.jpg') || preset.drive_link.endsWith('.png'))) {
        return preset.drive_link;
    }
    return '../ci4-frontend/assets/placeholder-image.jpg';
}

/**
 * Order Management Loader
 */
async function loadOrders(container) {
    try {
        const response = await fetchWithAuth(`${API_BASE}/admin/orders`);
        const json = await response.json();
        const orders = json.data || [];

        container.innerHTML = `
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h1 class="page-title">Order Management</h1>
                    <p class="page-subtitle">Monitor customer purchases.</p>
                </div>
            </div>

            <div class="data-card">
                <div class="table-responsive">
                    <table>
                         <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                             ${orders.map(order => `
                                <tr>
                                    <td style="font-family: monospace; font-weight: 600;">${order.razorpay_order_id || 'N/A'}</td>
                                    <td>
                                        <div>${order.customer_name || 'Guest'}</div>
                                        <div style="font-size:0.75rem;color:#6b7280;">${order.customer_email}</div>
                                    </td>
                                    <td>${order.preset_name || 'Unknown Item'}</td>
                                    <td style="font-weight: 700;">₹${order.price_paid}</td>
                                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                                    <td>${new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                             `).join('')}
                        </tbody>
                    </table>
                    ${orders.length === 0 ? '<div style="padding:20px;text-align:center;">No orders found.</div>' : ''}
                </div>
            </div>
        `;
        lucide.createIcons();

    } catch (error) {
        container.innerHTML = `<div class="error-state">Failed to load orders: ${error.message}</div>`;
    }
}

/**
 * API Helper
 */
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('pf_token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Allow token to be sent in Authorization header (Need backend to support Bearer or custom header)
    // CI4 Filter often checks header.

    const response = await fetch(url, { ...options, headers });
    if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        alert('Session expired. Please login again.');
        localStorage.removeItem('pf_token');
        window.location.href = '../ci4-frontend/login.html';
        throw new Error('Unauthorized');
    }
    return response;
}


/**
 * Payments & Transaction Logs
 */
function renderPaymentsView(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Payment Verification</h1>
            <p class="page-subtitle">Audit Razorpay transaction logs and verification signatures.</p>
        </div>
        <div class="data-card">
             <div class="table-header">
                <h3>Transaction Logs</h3>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Order Reflect</th>
                            <th>Method</th>
                            <th>Amount</th>
                            <th>Verification</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>pay_P1rX...</td>
                            <td>#PF-9021</td>
                            <td>UPI</td>
                            <td>₹1,299.00</td>
                            <td><span class="status-badge status-active">Verified</span></td>
                            <td>12:30 PM</td>
                            <td><button class="btn-sm btn-outline">Details</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    lucide.createIcons();
}

/**
 * Settings View
 */
function renderSettingsView(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">Application Settings</h1>
            <p class="page-subtitle">Configure site metadata, email services, and payment credentials.</p>
        </div>

        <div class="charts-grid" style="grid-template-columns: 1fr 1.5fr;">
            <div class="sidebar-nav" style="background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 12px; height: fit-content; padding: 12px;">
                <a href="#" class="nav-item active"><i data-lucide="globe"></i> General</a>
                <a href="#" class="nav-item"><i data-lucide="credit-card"></i> Payments</a>
                <a href="#" class="nav-item"><i data-lucide="mail"></i> Email (SMTP)</a>
                <a href="#" class="nav-item"><i data-lucide="shield"></i> Security</a>
                <a href="#" class="nav-item"><i data-lucide="bell"></i> Notifications</a>
            </div>

            <div class="stat-card">
                <h3 style="margin-bottom: 24px;">General Configuration</h3>
                <form>
                    <div style="margin-bottom: 20px;">
                        <label class="nav-label" style="display: block; margin-bottom: 8px;">Site Name</label>
                        <input type="text" class="search-input" style="padding-left: 14px;" value="PixelFable">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label class="nav-label" style="display: block; margin-bottom: 8px;">Support Email</label>
                        <input type="email" class="search-input" style="padding-left: 14px;" value="support@pixelfable.com">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label class="nav-label" style="display: block; margin-bottom: 8px;">Currency</label>
                        <select class="search-input" style="padding-left: 14px;">
                            <option>INR (₹)</option>
                            <option>USD ($)</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 24px;">
                        <label class="nav-label" style="display: block; margin-bottom: 8px;">Maintenance Mode</label>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <input type="checkbox" id="maint" style="width: 18px; height: 18px;">
                            <span>Temporarily disable frontend</span>
                        </div>
                    </div>
                    <hr style="border: none; border-top: 1px solid var(--color-border); margin-bottom: 24px;">
                    <button class="btn btn-primary">Save Changes</button>
                </form>
            </div>
        </div>
    `;
    lucide.createIcons();
}

/**
 * Modal & Action Handlers
 */
function showAddPresetModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal-overlay active" id="preset-modal">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2 class="page-title" style="font-size: 1.25rem;">Create New Preset</h2>
                    <button class="header-btn" onclick="closeModal('preset-modal')"><i data-lucide="x"></i></button>
                </div>
                <div class="modal-body">
                    <form id="preset-form" onsubmit="handlePresetSubmit(event)">
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Preset Name *</label>
                                <input type="text" class="form-control" placeholder="e.g. Cinematic Teal & Orange" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Category *</label>
                                <select class="form-control" required>
                                    <option value="">Select Category</option>
                                    <option>Lightroom Mobile</option>
                                    <option>Lightroom Desktop</option>
                                    <option>Video LUTs</option>
                                    <option>Photoshop Actions</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Price (INR) *</label>
                                <div style="position: relative;">
                                    <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-text-muted);">₹</span>
                                    <input type="number" class="form-control" style="padding-left: 30px;" placeholder="1299" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Discount Price (Optional)</label>
                                <input type="number" class="form-control" placeholder="999">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" rows="3" placeholder="Tell customers what this preset does..."></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Upload Cover Image (WebP Recommended)</label>
                            <div class="dropzone" onclick="document.getElementById('preset-file-input').click()">
                                <i data-lucide="image-plus" class="dropzone-icon"></i>
                                <p style="font-weight: 500;">Drag and drop or click to upload</p>
                                <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: 4px;">Supports JPG, PNG, WEBP (Max 2MB)</p>
                                <input type="file" id="preset-file-input" style="display: none;" accept="image/*" onchange="previewPresetImage(this)">
                            </div>
                            <div id="image-preview-container" style="margin-top: 12px; display: none;">
                                <img id="image-preview-img" src="" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
                            </div>
                        </div>

                        <div class="form-group" style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" id="preset-active" checked style="width: 18px; height: 18px; cursor: pointer;">
                            <label for="preset-active" style="cursor: pointer; font-size: 0.875rem;">Make this preset active immediately</label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('preset-modal')">Cancel</button>
                    <button class="btn btn-primary" type="submit" form="preset-form">Save Preset</button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function showOrderDetailsModal(orderId) {
    const modalContainer = document.getElementById('modal-container');
    // Mock detailed order data
    const orderData = {
        id: orderId,
        customer: 'Aryan Sharma',
        email: 'aryan@example.com',
        phone: '+91 98765 43210',
        date: 'Oct 24, 2025 - 14:20 PM',
        status: 'Completed',
        amount: 1299,
        items: [
            { name: 'Cinematic Kerala Pack', qty: 1, price: 1299 }
        ],
        subtotal: 1299,
        tax: 0,
        total: 1299,
        paymentId: 'pay_PF_88291029',
        history: [
            { status: 'Pending', date: 'Oct 24, 2025 - 14:18 PM' },
            { status: 'Processing', date: 'Oct 24, 2025 - 14:19 PM' },
            { status: 'Completed', date: 'Oct 24, 2025 - 14:20 PM' }
        ]
    };

    modalContainer.innerHTML = `
        <div class="modal-overlay active" id="order-modal">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <div>
                        <h2 class="page-title" style="font-size: 1.25rem;">Order Details: ${orderId}</h2>
                        <div style="font-size: 0.8125rem; color: var(--color-text-muted);">${orderData.date}</div>
                    </div>
                    <button class="header-btn" onclick="closeModal('order-modal')"><i data-lucide="x"></i></button>
                </div>
                <div class="modal-body">
                    <div class="order-detail-layout">
                        <div class="left-col">
                            <h3 style="font-size: 1rem; margin-bottom: 16px;">Purchased Items</h3>
                            <div class="data-card" style="margin-bottom: 24px;">
                                <table style="width: 100%;">
                                    <thead style="background: rgba(255,255,255,0.02);">
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                            <th style="text-align: right;">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${orderData.items.map(item => `
                                            <tr>
                                                <td>${item.name}</td>
                                                <td>${item.qty}</td>
                                                <td>₹${item.price.toLocaleString()}</td>
                                                <td style="text-align: right; font-weight: 600;">₹${(item.qty * item.price).toLocaleString()}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>

                            <h3 style="font-size: 1rem; margin-bottom: 16px;">Order History</h3>
                            <div class="timeline" style="border-left: 2px solid var(--color-border); padding-left: 20px; margin-left: 10px;">
                                ${orderData.history.map(item => `
                                    <div style="position: relative; margin-bottom: 16px;">
                                        <div style="position: absolute; left: -26px; top: 6px; width: 10px; height: 10px; border-radius: 50%; background: var(--color-primary);"></div>
                                        <div style="font-weight: 600; font-size: 0.875rem;">Status changed to <span style="color: var(--color-primary);">${item.status}</span></div>
                                        <div style="font-size: 0.75rem; color: var(--color-text-muted);">${item.date}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="right-col">
                            <h3 style="font-size: 1rem; margin-bottom: 16px;">Customer Profile</h3>
                            <div class="customer-info-box">
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                                    <img src="https://ui-avatars.com/api/?name=${orderData.customer}&background=6366f1&color=fff" style="width: 48px; height: 48px; border-radius: 50%;">
                                    <div>
                                        <div style="font-weight: 700;">${orderData.customer}</div>
                                        <div style="font-size: 0.75rem; color: var(--color-text-muted);">Customer ID: #C-1290</div>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                                    <i data-lucide="mail" style="width: 14px; color: var(--color-text-muted);"></i>
                                    <span style="font-size: 0.8125rem;">${orderData.email}</span>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <i data-lucide="phone" style="width: 14px; color: var(--color-text-muted);"></i>
                                    <span style="font-size: 0.8125rem;">${orderData.phone}</span>
                                </div>
                            </div>

                            <h3 style="font-size: 1rem; margin-bottom: 16px;">Payment Summary</h3>
                            <div class="stat-card" style="padding: 16px;">
                                <div class="order-summary-row">
                                    <span>Subtotal</span>
                                    <span>₹${orderData.subtotal.toLocaleString()}</span>
                                </div>
                                <div class="order-summary-row">
                                    <span>Tax</span>
                                    <span>₹${orderData.tax.toLocaleString()}</span>
                                </div>
                                <div class="total-row">
                                    <span>Total</span>
                                    <span>₹${orderData.total.toLocaleString()}</span>
                                </div>
                                <div style="margin-top: 16px; font-size: 0.75rem; color: var(--color-text-muted);">
                                    Ref ID: ${orderData.paymentId}
                                </div>
                            </div>

                            <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" onclick="window.print()">
                                <i data-lucide="printer" style="width: 14px; margin-right: 8px;"></i> Print Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function showStatusUpdateModal(orderId) {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="modal-overlay active" id="status-modal">
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h2 style="font-size: 1.125rem;">Update Order Status</h2>
                    <button class="header-btn" onclick="closeModal('status-modal')"><i data-lucide="x"></i></button>
                </div>
                <div class="modal-body">
                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 4px;">Update status for:</div>
                        <div style="font-weight: 700; color: var(--color-primary);">${orderId}</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">New Status</label>
                        <select class="form-control" id="new-status-select">
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Completed</option>
                            <option>Cancelled</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Comment (Optional)</label>
                        <textarea class="form-control" placeholder="Reason for update..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('status-modal')">Cancel</button>
                    <button class="btn btn-primary" onclick="handleStatusUpdate('${orderId}')">Update Status</button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

/**
 * Functional Handlers
 */
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

function previewPresetImage(input) {
    const container = document.getElementById('image-preview-container');
    const img = document.getElementById('image-preview-img');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
            container.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function handlePresetSubmit(e) {
    e.preventDefault();
    alert('Preset data captured successfully! Ready for API integration.');
    closeModal('preset-modal');
}

function handleStatusUpdate(orderId) {
    const status = document.getElementById('new-status-select').value;
    alert(`Order ${orderId} status updated to ${status}`);
    closeModal('status-modal');
}

function deletePreset(id) {
    if (confirm('Are you sure you want to delete this preset? This action cannot be undone.')) {
        alert('Preset deleted from database.');
    }
}

function bulkActivatePresets() {
    alert('All inactive presets are now activated.');
}

function exportOrders() {
    alert('Exporting order data as CSV...');
}
