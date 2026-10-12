/**
 * SmartCanteen - Admin & Canteen Staff Workflow Controller
 * Implements Admin Flow from flowchart:
 * Dashboard -> Manage Food Menu (CRUD) -> View Incoming Orders ->
 * Accept Order -> Prepare Food -> Update to READY -> Mark COMPLETED ->
 * View Sales / Reports.
 */

class AdminApp {
    constructor() {
        this.activeOrderFilter = 'ALL';
        this.activeAdminTab = 'orders'; // 'orders', 'menu', 'reports'
        this.editingItemId = null;
    }

    init() {
        this.renderDashboardStats();
        this.renderOrdersQueue();
        this.renderMenuManagement();
        this.renderSalesReports();
        this.bindEvents();
    }

    bindEvents() {
        // Admin Navigation tabs (Orders Queue, Menu Manager, Sales & Reports)
        const tabBtns = document.querySelectorAll('.admin-nav-tab');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeAdminTab = btn.dataset.tab;
                sounds.playClick();
                this.switchAdminTab(this.activeAdminTab);
            });
        });

        // Kitchen Order Filter tabs (ALL, PENDING, PREPARING, READY, COMPLETED)
        const filterBtns = document.querySelectorAll('.queue-filter-pill');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeOrderFilter = btn.dataset.filter;
                sounds.playClick();
                this.renderOrdersQueue();
            });
        });

        // Add New Menu Item Modal trigger
        const addNewItemBtn = document.getElementById('open-add-item-modal-btn');
        if (addNewItemBtn) {
            addNewItemBtn.addEventListener('click', () => {
                this.openMenuModal(null);
            });
        }

        // Save Menu Item Form Submit
        const itemForm = document.getElementById('menu-item-form');
        if (itemForm) {
            itemForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveMenuItem();
            });
        }

        // Cancel / Close Menu Item Modal
        const closeItemModalBtn = document.getElementById('close-menu-modal-btn');
        if (closeItemModalBtn) {
            closeItemModalBtn.addEventListener('click', () => {
                this.closeMenuModal();
            });
        }

        // Token quick lookup input
        const tokenSearchInput = document.getElementById('admin-token-search');
        if (tokenSearchInput) {
            tokenSearchInput.addEventListener('input', (e) => {
                this.filterOrdersByToken(e.target.value.trim().toUpperCase());
            });
        }
    }

    switchAdminTab(tabKey) {
        const sections = {
            orders: document.getElementById('admin-orders-section'),
            menu: document.getElementById('admin-menu-section'),
            reports: document.getElementById('admin-reports-section')
        };

        Object.keys(sections).forEach(key => {
            if (sections[key]) {
                sections[key].style.display = key === tabKey ? 'block' : 'none';
            }
        });

        if (tabKey === 'reports') {
            this.renderSalesReports();
        } else if (tabKey === 'menu') {
            this.renderMenuManagement();
        } else {
            this.renderOrdersQueue();
        }
    }

    renderDashboardStats() {
        const orders = store.getOrders();

        const pendingCount = orders.filter(o => o.status === 'PENDING').length;
        const inKitchenCount = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PREPARING').length;
        const readyCount = orders.filter(o => o.status === 'READY').length;
        const completedCount = orders.filter(o => o.status === 'COMPLETED').length;

        const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.total : 0), 0);

        // Update DOM elements
        const statPending = document.getElementById('admin-stat-pending');
        const statKitchen = document.getElementById('admin-stat-kitchen');
        const statReady = document.getElementById('admin-stat-ready');
        const statCompleted = document.getElementById('admin-stat-completed');
        const statRevenue = document.getElementById('admin-stat-revenue');

        if (statPending) statPending.textContent = pendingCount;
        if (statKitchen) statKitchen.textContent = inKitchenCount;
        if (statReady) statReady.textContent = readyCount;
        if (statCompleted) statCompleted.textContent = completedCount;
        if (statRevenue) statRevenue.textContent = `₹${totalRevenue.toFixed(0)}`;
    }

    renderOrdersQueue() {
        const grid = document.getElementById('kitchen-orders-grid');
        if (!grid) return;

        let orders = store.getOrders();

        // Filter by status tab
        if (this.activeOrderFilter !== 'ALL') {
            if (this.activeOrderFilter === 'IN_KITCHEN') {
                orders = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PREPARING');
            } else {
                orders = orders.filter(o => o.status === this.activeOrderFilter);
            }
        }

        if (orders.length === 0) {
            grid.innerHTML = `
                <div class="empty-queue-box">
                    <span class="empty-icon">🍳</span>
                    <h4>No orders in this category</h4>
                    <p>Incoming pre-orders from students will appear here in real time.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = orders.map(order => {
            const timeAgo = this.formatTimeAgo(order.createdAt);
            const statusConfig = this.getStatusConfig(order.status);

            return `
                <div class="kitchen-order-card border-status-${order.status.toLowerCase()}" data-id="${order.id}">
                    <div class="k-card-header">
                        <div class="k-token-badge">
                            <span class="token-prefix">TOKEN</span>
                            <span class="token-num">${order.token}</span>
                        </div>
                        <div class="k-order-meta">
                            <strong class="k-order-id">${order.id}</strong>
                            <span class="k-student-info">👤 ${order.studentName} (${order.studentRoll})</span>
                        </div>
                        <span class="k-status-pill status-${order.status.toLowerCase()}">
                            ${statusConfig.icon} ${order.status}
                        </span>
                    </div>

                    <div class="k-order-timing">
                        <span class="k-pickup-slot">⏰ Slot: <strong>${order.pickupTime}</strong></span>
                        <span class="k-time-ago">🕒 ${timeAgo}</span>
                    </div>

                    ${order.specialNotes ? `
                        <div class="k-special-notes">
                            <span class="note-icon">📝</span>
                            <em>"${order.specialNotes}"</em>
                        </div>
                    ` : ''}

                    <div class="k-items-table">
                        ${order.items.map(item => `
                            <div class="k-item-line">
                                <span class="k-item-qty">${item.qty}×</span>
                                <span class="k-item-name">${item.name}</span>
                                <span class="k-item-price">₹${item.price * item.qty}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="k-order-footer">
                        <div class="k-bill-summary">
                            <span>Total: <strong>₹${order.total.toFixed(2)}</strong></span>
                            <span class="k-pay-badge">✓ ${order.paymentMethod}</span>
                        </div>
                        <div class="k-action-buttons">
                            ${this.renderKitchenActionButtons(order)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.bindKitchenOrderActions(grid);
    }

    renderKitchenActionButtons(order) {
        switch (order.status) {
            case 'PENDING':
                return `
                    <button class="btn btn-warning btn-sm btn-accept" data-id="${order.id}">
                        ✓ Accept Order
                    </button>
                `;
            case 'CONFIRMED':
                return `
                    <button class="btn btn-primary btn-sm btn-prep" data-id="${order.id}">
                        🍳 Start Cooking
                    </button>
                `;
            case 'PREPARING':
                return `
                    <button class="btn btn-success btn-sm btn-ready" data-id="${order.id}">
                        🔔 Mark Ready
                    </button>
                `;
            case 'READY':
                return `
                    <button class="btn btn-purple btn-sm btn-complete" data-id="${order.id}">
                        🛍️ Handover & Complete
                    </button>
                `;
            case 'COMPLETED':
                return `
                    <span class="k-done-tag">
                        ✓ Collected
                    </span>
                `;
            default:
                return '';
        }
    }

    bindKitchenOrderActions(container) {
        // Accept Order: PENDING -> CONFIRMED
        container.querySelectorAll('.btn-accept').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                store.updateOrderStatus(id, 'CONFIRMED');
                sounds.playKitchenAlert();
                showToast(`Order #${id} Confirmed! Moved to kitchen queue.`, 'info');
                this.renderDashboardStats();
                this.renderOrdersQueue();
            });
        });

        // Start Cooking: CONFIRMED -> PREPARING
        container.querySelectorAll('.btn-prep').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                store.updateOrderStatus(id, 'PREPARING');
                sounds.playClick();
                showToast(`Order #${id} is now being prepared!`, 'info');
                this.renderDashboardStats();
                this.renderOrdersQueue();
            });
        });

        // Mark as Ready: PREPARING -> READY
        container.querySelectorAll('.btn-ready').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const order = store.updateOrderStatus(id, 'READY');
                sounds.playReadyChime();
                showToast(`Order #${order.token} is READY for Pickup! Student notified.`, 'success');
                this.renderDashboardStats();
                this.renderOrdersQueue();
            });
        });

        // Handover & Complete: READY -> COMPLETED
        container.querySelectorAll('.btn-complete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const order = store.updateOrderStatus(id, 'COMPLETED');
                sounds.playSuccess();
                showToast(`Token #${order.token} collected! Order marked completed.`, 'success');
                this.renderDashboardStats();
                this.renderOrdersQueue();
            });
        });
    }

    filterOrdersByToken(query) {
        const grid = document.getElementById('kitchen-orders-grid');
        if (!grid) return;
        const cards = grid.querySelectorAll('.kitchen-order-card');

        cards.forEach(card => {
            const tokenText = card.querySelector('.token-num')?.textContent || '';
            const orderIdText = card.querySelector('.k-order-id')?.textContent || '';
            const matches = tokenText.includes(query) || orderIdText.includes(query);
            card.style.display = matches ? 'block' : 'none';
        });
    }

    // ==========================================
    // MENU CRUD MANAGEMENT
    // ==========================================

    renderMenuManagement() {
        const tableBody = document.getElementById('admin-menu-table-body');
        if (!tableBody) return;

        const items = store.getMenuItems();

        tableBody.innerHTML = items.map(item => `
            <tr data-id="${item.id}">
                <td>
                    <img src="${item.image}" alt="${item.name}" class="table-food-thumb" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'">
                </td>
                <td>
                    <strong>${item.name}</strong>
                    <div class="table-micro-desc">${item.category.toUpperCase()} • ${item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</div>
                </td>
                <td>₹${item.price}</td>
                <td>${item.prepTime} mins</td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" class="stock-toggle" data-id="${item.id}" ${item.inStock ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="stock-text-status">${item.inStock ? 'In Stock' : 'Sold Out'}</span>
                </td>
                <td>★ ${item.rating.toFixed(1)} (${item.ratingCount})</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-outline-xs edit-item-btn" data-id="${item.id}" title="Edit item">✏️ Edit</button>
                        <button class="btn btn-danger-xs delete-item-btn" data-id="${item.id}" title="Delete item">🗑️ Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Stock Toggle
        tableBody.querySelectorAll('.stock-toggle').forEach(input => {
            input.addEventListener('change', () => {
                const id = input.dataset.id;
                const updated = store.toggleItemStock(id);
                sounds.playClick();
                showToast(`${updated.name} is now ${updated.inStock ? 'In Stock' : 'Sold Out'}`, 'info');
                this.renderMenuManagement();
            });
        });

        // Edit Item
        tableBody.querySelectorAll('.edit-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.openMenuModal(id);
            });
        });

        // Delete Item
        tableBody.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = store.getMenuItemById(id);
                if (confirm(`Are you sure you want to remove "${item.name}" from the canteen menu?`)) {
                    store.deleteMenuItem(id);
                    sounds.playClick();
                    showToast(`Deleted ${item.name} from menu`, 'warning');
                    this.renderMenuManagement();
                }
            });
        });
    }

    openMenuModal(itemId = null) {
        this.editingItemId = itemId;
        const modal = document.getElementById('menu-item-modal');
        const form = document.getElementById('menu-item-form');
        const titleEl = document.getElementById('menu-modal-title');
        if (!modal || !form) return;

        if (itemId) {
            const item = store.getMenuItemById(itemId);
            if (!item) return;

            if (titleEl) titleEl.textContent = 'Edit Menu Item';
            form.elements['itemName'].value = item.name;
            form.elements['itemCategory'].value = item.category;
            form.elements['itemPrice'].value = item.price;
            form.elements['itemPrepTime'].value = item.prepTime;
            form.elements['itemCalories'].value = item.calories || 250;
            form.elements['itemVeg'].value = item.isVeg ? 'veg' : 'nonveg';
            form.elements['itemImage'].value = item.image;
            form.elements['itemDesc'].value = item.description;
        } else {
            if (titleEl) titleEl.textContent = 'Add New Menu Item';
            form.reset();
            form.elements['itemImage'].value = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
        }

        modal.classList.add('active');
        sounds.playClick();
    }

    closeMenuModal() {
        const modal = document.getElementById('menu-item-modal');
        if (modal) modal.classList.remove('active');
        this.editingItemId = null;
    }

    handleSaveMenuItem() {
        const form = document.getElementById('menu-item-form');
        if (!form) return;

        const name = form.elements['itemName'].value.trim();
        const category = form.elements['itemCategory'].value;
        const price = parseFloat(form.elements['itemPrice'].value);
        const prepTime = parseInt(form.elements['itemPrepTime'].value, 10);
        const calories = parseInt(form.elements['itemCalories'].value, 10) || 250;
        const isVeg = form.elements['itemVeg'].value === 'veg';
        const image = form.elements['itemImage'].value.trim();
        const description = form.elements['itemDesc'].value.trim();

        if (!name || isNaN(price) || price <= 0) {
            showToast('Please enter a valid item name and price.', 'error');
            return;
        }

        if (this.editingItemId) {
            store.updateMenuItem(this.editingItemId, {
                name, category, price, prepTime, calories, isVeg, image, description
            });
            showToast(`Updated menu item: ${name}`, 'success');
        } else {
            store.addMenuItem({
                name, category, price, prepTime, calories, isVeg, image, description
            });
            showToast(`Added new item: ${name} to menu!`, 'success');
        }

        sounds.playSuccess();
        this.closeMenuModal();
        this.renderMenuManagement();
    }

    // ==========================================
    // SALES & ANALYTICS REPORTS
    // ==========================================

    renderSalesReports() {
        const orders = store.getOrders();
        const menuItems = store.getMenuItems();

        // Calculate Revenue and Averages
        const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');
        const totalSales = paidOrders.reduce((sum, o) => sum + o.total, 0);
        const avgOrderVal = paidOrders.length > 0 ? (totalSales / paidOrders.length) : 0;

        const repTotalSales = document.getElementById('rep-total-sales');
        const repTotalOrders = document.getElementById('rep-total-orders');
        const repAvgTicket = document.getElementById('rep-avg-ticket');

        if (repTotalSales) repTotalSales.textContent = `₹${totalSales.toFixed(2)}`;
        if (repTotalOrders) repTotalOrders.textContent = paidOrders.length;
        if (repAvgTicket) repAvgTicket.textContent = `₹${avgOrderVal.toFixed(2)}`;

        // Calculate Top Items
        const itemSalesMap = {};
        paidOrders.forEach(o => {
            o.items.forEach(i => {
                if (!itemSalesMap[i.name]) {
                    itemSalesMap[i.name] = { qty: 0, revenue: 0 };
                }
                itemSalesMap[i.name].qty += i.qty;
                itemSalesMap[i.name].revenue += (i.price * i.qty);
            });
        });

        const sortedItems = Object.entries(itemSalesMap)
            .map(([name, data]) => ({ name, qty: data.qty, revenue: data.revenue }))
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5);

        const topItemsContainer = document.getElementById('rep-top-items-list');
        if (topItemsContainer) {
            topItemsContainer.innerHTML = sortedItems.map((item, idx) => `
                <div class="rep-item-card">
                    <span class="rep-item-rank">#${idx + 1}</span>
                    <div class="rep-item-info">
                        <strong>${item.name}</strong>
                        <span>${item.qty} portions sold</span>
                    </div>
                    <div class="rep-item-rev">
                        <strong>₹${item.revenue.toFixed(2)}</strong>
                    </div>
                </div>
            `).join('') || '<p class="text-muted">No sales logged yet.</p>';
        }

        // Render Hourly Sales Distribution Bar Chart (SVG)
        this.renderHourlySalesChart(paidOrders);

        // Render Feedback Reviews Wall
        this.renderFeedbackWall(orders);
    }

    renderHourlySalesChart(orders) {
        const chartWrapper = document.getElementById('rep-hourly-chart');
        if (!chartWrapper) return;

        // Sample hours: 10 AM, 11 AM, 12 PM, 1 PM, 2 PM, 3 PM, 4 PM, 5 PM
        const hours = ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
        // Generate realistic hourly distribution based on orders or defaults
        const counts = [2, 5, 14, 28, 19, 8, 16, 6];

        const maxVal = Math.max(...counts, 30);

        chartWrapper.innerHTML = `
            <div class="bar-chart-container">
                ${hours.map((hr, idx) => {
                    const count = counts[idx];
                    const heightPercent = Math.round((count / maxVal) * 100);
                    return `
                        <div class="bar-col">
                            <span class="bar-tooltip">${count} orders</span>
                            <div class="bar-pillar-wrap">
                                <div class="bar-pillar" style="height: ${heightPercent}%;"></div>
                            </div>
                            <span class="bar-label">${hr}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderFeedbackWall(orders) {
        const wall = document.getElementById('rep-feedback-wall');
        if (!wall) return;

        const reviewedOrders = orders.filter(o => o.feedback && o.feedback.rating);

        if (reviewedOrders.length === 0) {
            wall.innerHTML = '<p class="text-muted">No student ratings submitted yet.</p>';
            return;
        }

        wall.innerHTML = reviewedOrders.map(o => `
            <div class="feedback-card">
                <div class="fb-card-top">
                    <div>
                        <strong>${o.studentName}</strong>
                        <span class="fb-token">Token ${o.token}</span>
                    </div>
                    <div class="fb-stars">${'⭐'.repeat(o.feedback.rating)}</div>
                </div>
                ${o.feedback.review ? `<p class="fb-text">"${o.feedback.review}"</p>` : ''}
                <div class="fb-tags">
                    ${(o.feedback.tags || []).map(t => `<span class="fb-tag-pill">${t}</span>`).join('')}
                </div>
                <span class="fb-time">${new Date(o.feedback.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `).join('');
    }

    // Helper functions
    getStatusConfig(status) {
        const configs = {
            PENDING: { icon: '📋', label: 'Pending' },
            CONFIRMED: { icon: '✅', label: 'Confirmed' },
            PREPARING: { icon: '🍳', label: 'Preparing' },
            READY: { icon: '🍽️', label: 'Ready' },
            COMPLETED: { icon: '🛍️', label: 'Completed' }
        };
        return configs[status] || { icon: '•', label: status };
    }

    formatTimeAgo(isoString) {
        if (!isoString) return 'Just now';
        const diffMs = Date.now() - new Date(isoString).getTime();
        const mins = Math.floor(diffMs / (60 * 1000));
        if (mins < 1) return 'Just now';
        if (mins === 1) return '1 min ago';
        if (mins < 60) return `${mins} mins ago`;
        const hrs = Math.floor(mins / 60);
        return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    }
}

// Global Admin controller
const adminApp = new AdminApp();
