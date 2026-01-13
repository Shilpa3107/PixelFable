/**
 * PixelFable Admin Dashboard - Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    lucide.createIcons();

    // Setup Sidebar Navigation
    setupNavigation();

    // Default: Dashboard
    initDashboard();

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
});

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
function renderView(viewName) {
    const contentArea = document.getElementById('content-area');
    console.log(`Switching to view: ${viewName}`);

    switch (viewName) {
        case 'dashboard':
            window.location.reload(); // Quick way to reset to dashboard for now
            break;
        case 'users':
            renderUsersView(contentArea);
            break;
        case 'presets':
            renderPresetsView(contentArea);
            break;
        case 'orders':
            renderOrdersView(contentArea);
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
 * Dashboard Initialization (Charts & Recent Data)
 */
function initDashboard() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [{
                    label: 'Revenue (INR)',
                    data: [35000, 48000, 42000, 55000, 68000, 59000, 75000, 82000],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }

    // Distribution Chart
    const distCtx = document.getElementById('distributionChart');
    if (distCtx) {
        new Chart(distCtx, {
            type: 'doughnut',
            data: {
                labels: ['LR Presets', 'LUTs', 'Mobile', 'Desktop'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8', padding: 20, usePointStyle: true }
                    }
                }
            }
        });
    }

    // Render Recent Orders
    const ordersBody = document.getElementById('recent-orders-list');
    if (ordersBody) {
        const mockOrders = [
            { id: '#PF-9021', customer: 'Aryan Sharma', product: 'Cinematic Teal Pack', amount: '₹1,299', date: 'Oct 24, 2025', status: 'completed' },
            { id: '#PF-9022', customer: 'Priya Verma', product: 'Vintage Retro LUTs', amount: '₹999', date: 'Oct 24, 2025', status: 'pending' },
            { id: '#PF-9023', customer: 'Kabir Singh', product: 'Dark Moody Mobile', amount: '₹499', date: 'Oct 23, 2025', status: 'completed' },
            { id: '#PF-9024', customer: 'Ananya Rao', product: 'Nature Landscape Pack', amount: '₹1,499', date: 'Oct 23, 2025', status: 'disabled' },
        ];

        ordersBody.innerHTML = mockOrders.map(order => `
            <tr>
                <td style="font-family: monospace; font-weight: 600;">${order.id}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <img src="https://ui-avatars.com/api/?name=${order.customer}&size=24&background=random" style="border-radius: 50%;">
                        ${order.customer}
                    </div>
                </td>
                <td>${order.product}</td>
                <td style="color: var(--color-text-muted);">${order.date}</td>
                <td style="font-weight: 700;">${order.amount}</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>
                    <button class="btn-sm btn-outline"><i data-lucide="eye" style="width: 14px;"></i></button>
                    <button class="btn-sm btn-outline"><i data-lucide="more-horizontal" style="width: 14px;"></i></button>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    }
}

/**
 * Users Management View
 */
function renderUsersView(container) {
    container.innerHTML = `
        <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
                <h1 class="page-title">User Management</h1>
                <p class="page-subtitle">Manage customer accounts and administrative roles.</p>
            </div>
            <button class="btn btn-primary"><i data-lucide="plus" style="display: inline; vertical-align: middle; margin-right: 4px;"></i> Add User</button>
        </div>

        <div class="data-card">
            <div class="table-header">
                <div style="display: flex; gap: 12px;">
                    <input type="text" class="search-input" placeholder="Filter by name or email..." style="padding-left: 12px; width: 300px;">
                    <select class="btn btn-outline" style="font-weight: 400;">
                        <option>All Roles</option>
                        <option>Admin</option>
                        <option>Customer</option>
                    </select>
                </div>
                <div style="display: flex; gap: 8px;">
                     <button class="btn btn-outline btn-sm">Export CSV</button>
                     <button class="btn btn-outline btn-sm">Bulk Delete</button>
                </div>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff&size=32" alt="Avatar" class="user-avatar">
                                    <span style="font-weight: 600;">Admin User</span>
                                </div>
                            </td>
                            <td>admin@pixelfable.com</td>
                            <td><span style="color: var(--color-primary); font-weight: 600;">Super Admin</span></td>
                            <td><span class="status-badge status-active">Active</span></td>
                            <td class="color-muted">Oct 01, 2025</td>
                            <td>
                                <button class="btn-sm btn-outline"><i data-lucide="edit-3" style="width: 14px;"></i></button>
                                <button class="btn-sm btn-outline" style="color: var(--color-danger);"><i data-lucide="trash-2" style="width: 14px;"></i></button>
                            </td>
                        </tr>
                        <!-- Add more mock users as needed -->
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <span style="color: var(--color-text-muted); font-size: 0.875rem;">Showing 1-10 of 254 entries</span>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm">Previous</button>
                    <button class="btn btn-primary btn-sm">1</button>
                    <button class="btn btn-outline btn-sm">2</button>
                    <button class="btn btn-outline btn-sm">Next</button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

/**
 * Presets Management View
 */
function renderPresetsView(container) {
    container.innerHTML = `
        <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
            <div>
                <h1 class="page-title">Preset Control</h1>
                <p class="page-subtitle">Manage your product catalog, upload WebP images, and control availability.</p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" onclick="bulkActivatePresets()"><i data-lucide="zap" style="width: 14px; display: inline; vertical-align: middle; margin-right: 4px;"></i> Bulk Activate</button>
                <button class="btn btn-primary" onclick="showAddPresetModal()">
                    <i data-lucide="plus" style="width: 14px; display: inline; vertical-align: middle; margin-right: 4px;"></i> Create New Preset
                </button>
            </div>
        </div>

        <div class="filter-bar">
            <div class="header-search" style="max-width: 300px; display: block;">
                <i data-lucide="search" class="search-icon"></i>
                <input type="text" class="form-control" placeholder="Search presets..." style="padding-left: 40px;">
            </div>
            <select class="form-control" style="width: 180px;">
                <option>All Categories</option>
                <option>Lightroom Mobile</option>
                <option>Lightroom Desktop</option>
                <option>Video LUTs</option>
                <option>Photoshop Actions</option>
            </select>
            <select class="form-control" style="width: 150px;">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
            </select>
            <div style="margin-left: auto; color: var(--color-text-muted); font-size: 0.875rem;">
                Showing 12 of 86 presets
            </div>
        </div>

        <div class="presets-grid">
            ${generatePresetCards()}
        </div>
    `;
    lucide.createIcons();
}

function generatePresetCards() {
    const mockPresets = [
        { id: 1, name: 'Cinematic Kerala', category: 'Lightroom Mobile', price: 1299, status: 'Active', img: '../ci4-frontend/assets/teal&orangeKeralaPost01.jpg', updated: '2 hours ago' },
        { id: 2, name: 'Vintage Retro LUTs', category: 'Video LUTs', price: 999, status: 'Active', img: '../ci4-frontend/assets/vintagePost.jpg', updated: '1 day ago' },
        { id: 3, name: 'Moody Dark Forest', category: 'Lightroom Desktop', price: 1499, status: 'Inactive', img: '../ci4-frontend/assets/moodyPost.jpg', updated: '3 days ago' },
        { id: 4, name: 'Summer Glow Pack', category: 'Lightroom Mobile', price: 799, status: 'Active', img: '../ci4-frontend/assets/summerPost.jpg', updated: '5 days ago' },
        { id: 5, name: 'Urban Street Night', category: 'Lightroom Mobile', price: 1199, status: 'Active', img: '../ci4-frontend/assets/urbanPost.jpg', updated: '1 week ago' },
        { id: 6, name: 'Portrait Essence', category: 'Photoshop Actions', price: 1599, status: 'Active', img: '../ci4-frontend/assets/portraitPost.jpg', updated: '2 weeks ago' }
    ];

    return mockPresets.map(preset => `
        <div class="preset-card">
            <div class="preset-img-wrapper">
                <img src="${preset.img}" class="preset-img" alt="${preset.name}">
                <span class="preset-badge status-${preset.status.toLowerCase()}">${preset.status}</span>
            </div>
            <div class="preset-content">
                <div class="preset-title">${preset.name}</div>
                <div style="color: var(--color-text-muted); font-size: 0.875rem; margin-bottom: 12px;">${preset.category}</div>
                <div class="preset-price">₹${preset.price.toLocaleString()}</div>
                
                <div class="preset-actions">
                    <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="showEditPresetModal(${preset.id})">
                        <i data-lucide="edit-3" style="width: 14px; margin-right: 4px;"></i> Edit
                    </button>
                    <button class="btn btn-outline btn-sm" style="color: var(--color-danger);" onclick="deletePreset(${preset.id})">
                        <i data-lucide="trash-2" style="width: 14px;"></i>
                    </button>
                </div>
                
                <div class="preset-meta">
                    <span><i data-lucide="clock" style="width: 12px; display: inline; margin-right: 4px;"></i> ${preset.updated}</span>
                    <label class="switch" style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                        <input type="checkbox" ${preset.status === 'Active' ? 'checked' : ''} style="width: 16px; height: 16px;">
                        <span style="font-size: 0.75rem;">Active</span>
                    </label>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Orders Management View
 */
function renderOrdersView(container) {
    container.innerHTML = `
        <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
            <div>
                <h1 class="page-title">Order Management</h1>
                <p class="page-subtitle">Monitor customer purchases, track payments, and manage fulfillment.</p>
            </div>
            <button class="btn btn-outline" onclick="exportOrders()"><i data-lucide="download" style="width: 14px; margin-right: 4px;"></i> Export Data</button>
        </div>

        <div class="filter-bar">
            <div class="header-search" style="max-width: 250px; display: block;">
                <i data-lucide="search" class="search-icon"></i>
                <input type="text" class="form-control" placeholder="Search Order ID or Name..." style="padding-left: 40px;">
            </div>
            <div class="filter-group">
                <span class="form-label" style="margin-bottom: 0;">Date:</span>
                <input type="date" class="form-control" style="width: 160px;">
            </div>
            <div class="filter-group">
                <span class="form-label" style="margin-bottom: 0;">Status:</span>
                <select class="form-control" style="width: 140px;">
                    <option>All Status</option>
                    <option>Completed</option>
                    <option>Processing</option>
                    <option>Pending</option>
                    <option>Cancelled</option>
                </select>
            </div>
            <div class="filter-group">
                <span class="form-label" style="margin-bottom: 0;">Payment:</span>
                <select class="form-control" style="width: 140px;">
                    <option>All Methods</option>
                    <option>Razorpay</option>
                    <option>Stripe</option>
                    <option>PayPal</option>
                </select>
            </div>
        </div>

        <div class="data-card">
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Module/Item</th>
                            <th>Order Date</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="orders-table-body">
                        ${generateOrderRows()}
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <span style="color: var(--color-text-muted); font-size: 0.875rem;">Showing 1-8 of 1,240 orders</span>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline btn-sm">Previous</button>
                    <button class="btn btn-primary btn-sm">1</button>
                    <button class="btn btn-outline btn-sm">2</button>
                    <button class="btn btn-outline btn-sm">Next</button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function generateOrderRows() {
    const mockOrders = [
        { id: '#PF-9021', name: 'Aryan Sharma', email: 'aryan@example.com', item: 'Cinematic Kerala Pack', date: 'Oct 24, 2025', amount: 1299, method: 'Razorpay', status: 'Completed' },
        { id: '#PF-9022', name: 'Priya Verma', email: 'priya@gmail.com', item: 'Vintage Retro LUTs', date: 'Oct 24, 2025', amount: 999, method: 'Razorpay', status: 'Pending' },
        { id: '#PF-9023', name: 'Kabir Singh', email: 'kabir.s@outlook.com', item: 'Dark Moody Mobile', date: 'Oct 23, 2025', amount: 499, method: 'UPI', status: 'Processing' },
        { id: '#PF-9024', name: 'Ananya Rao', email: 'ananya.rao@comp.in', item: 'Nature Landscape Pack', date: 'Oct 23, 2025', amount: 1499, method: 'Razorpay', status: 'Cancelled' },
        { id: '#PF-9025', name: 'Rahul Malhotra', email: 'rahul.m@yahoo.com', item: 'Urban Coffee Pack', date: 'Oct 22, 2025', amount: 899, method: 'Stripe', status: 'Completed' }
    ];

    return mockOrders.map(order => `
        <tr>
            <td style="font-family: monospace; font-weight: 600; color: var(--color-primary);">${order.id}</td>
            <td>
                <div style="font-weight: 600;">${order.name}</div>
                <div style="font-size: 0.75rem; color: var(--color-text-muted);">${order.email}</div>
            </td>
            <td>${order.item}</td>
            <td style="color: var(--color-text-muted);">${order.date}</td>
            <td style="font-weight: 700;">₹${order.amount.toLocaleString()}</td>
            <td><span style="font-size: 0.8125rem;">${order.method}</span></td>
            <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
            <td>
                <div style="display: flex; gap: 6px;">
                    <button class="btn-sm btn-outline" title="View Details" onclick="showOrderDetailsModal('${order.id}')">
                        <i data-lucide="eye" style="width: 14px;"></i>
                    </button>
                    <button class="btn-sm btn-outline" title="Update Status" onclick="showStatusUpdateModal('${order.id}')">
                        <i data-lucide="refresh-cw" style="width: 14px;"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
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
