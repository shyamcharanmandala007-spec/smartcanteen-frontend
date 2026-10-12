/**
 * SmartCanteen - Main Application Orchestrator
 * Coordinates Navigation, Split-Screen Demo Mode, Token TV Board,
 * Authentication, Toast Notifications, and Real-Time Event Sync.
 */

// Toast notification helper
function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: '🎉',
        error: '⚠️',
        warning: '🔔',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || '•'}</span>
        <span class="toast-msg">${message}</span>
        <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    // Auto remove
    const timer = setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, duration);

    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(timer);
        toast.remove();
    });
}

class MainApp {
    constructor() {
        this.currentViewMode = 'student'; // 'student', 'admin', 'split', 'tv'
    }

    init() {
        this.bindGlobalNavigation();
        this.bindAuthModal();
        this.bindTokenTVBoard();
        this.bindStoreSyncEvents();
        this.updateUserSessionUI();

        // Initialize sub-controllers
        studentApp.init();
        adminApp.init();
        this.renderTokenTVBoard();

        // Default view mode
        this.setViewMode('student');
    }

    bindGlobalNavigation() {
        // View mode selector buttons (Student, Admin Kitchen, Split Screen, TV Board)
        const modeButtons = document.querySelectorAll('.view-mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                sounds.playClick();
                this.setViewMode(mode);
            });
        });

        // Demo Data Reset button
        const resetBtn = document.getElementById('reset-demo-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Reset SmartCanteen data to initial demo state?')) {
                    store.resetToDemoData();
                    sounds.playSuccess();
                    showToast('Demo data refreshed to default values!', 'success');
                    window.location.reload();
                }
            });
        }
    }

    setViewMode(mode) {
        this.currentViewMode = mode;

        const studentView = document.getElementById('student-app-view');
        const adminView = document.getElementById('admin-app-view');
        const tvView = document.getElementById('tv-display-view');
        const mainContainer = document.getElementById('app-main-viewport');

        // Update active tab buttons
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        if (!studentView || !adminView || !tvView) return;

        // Reset split class
        if (mainContainer) mainContainer.classList.remove('split-mode-active');

        if (mode === 'student') {
            studentView.style.display = 'block';
            adminView.style.display = 'none';
            tvView.style.display = 'none';
            studentApp.renderMenu();
            studentApp.renderCart();
            studentApp.renderOrderHistory();
        } else if (mode === 'admin') {
            studentView.style.display = 'none';
            adminView.style.display = 'block';
            tvView.style.display = 'none';
            adminApp.renderDashboardStats();
            adminApp.renderOrdersQueue();
        } else if (mode === 'split') {
            // Side-by-side demo mode: student on left, admin on right!
            studentView.style.display = 'block';
            adminView.style.display = 'block';
            tvView.style.display = 'none';
            if (mainContainer) mainContainer.classList.add('split-mode-active');
            studentApp.renderMenu();
            adminApp.renderOrdersQueue();
            showToast('Split Demo Mode Active! Order on the left, watch kitchen live on the right.', 'info');
        } else if (mode === 'tv') {
            studentView.style.display = 'none';
            adminView.style.display = 'none';
            tvView.style.display = 'block';
            this.renderTokenTVBoard();
        }
    }

    // ==========================================
    // BIG SCREEN TOKEN TV BOARD
    // ==========================================

    bindTokenTVBoard() {
        const refreshTvBtn = document.getElementById('refresh-tv-btn');
        if (refreshTvBtn) {
            refreshTvBtn.addEventListener('click', () => {
                this.renderTokenTVBoard();
                sounds.playClick();
            });
        }
    }

    renderTokenTVBoard() {
        const preparingContainer = document.getElementById('tv-preparing-tokens');
        const readyContainer = document.getElementById('tv-ready-tokens');
        if (!preparingContainer || !readyContainer) return;

        const orders = store.getOrders();

        const preparingOrders = orders.filter(o => o.status === 'PREPARING' || o.status === 'CONFIRMED');
        const readyOrders = orders.filter(o => o.status === 'READY');

        preparingContainer.innerHTML = preparingOrders.length > 0
            ? preparingOrders.map(o => `
                <div class="tv-token-card tv-prep-card animate-pulse">
                    <span class="tv-num">${o.token}</span>
                    <span class="tv-slot">${o.pickupTime}</span>
                </div>
            `).join('')
            : `<div class="tv-empty-slot">None right now</div>`;

        readyContainer.innerHTML = readyOrders.length > 0
            ? readyOrders.map(o => `
                <div class="tv-token-card tv-ready-card animate-glow">
                    <span class="tv-num">${o.token}</span>
                    <span class="tv-counter">Counter #2</span>
                </div>
            `).join('')
            : `<div class="tv-empty-slot">No orders ready</div>`;
    }

    // ==========================================
    // AUTHENTICATION & LOGIN FLOW
    // ==========================================

    bindAuthModal() {
        const modal = document.getElementById('auth-modal');
        const openAuthBtn = document.getElementById('open-auth-modal-btn');
        const closeAuthBtn = document.getElementById('close-auth-modal-btn');
        const authTabs = document.querySelectorAll('.auth-tab-btn');
        const loginForm = document.getElementById('auth-login-form');
        const registerForm = document.getElementById('auth-register-form');
        const logoutBtn = document.getElementById('header-logout-btn');

        if (openAuthBtn && modal) {
            openAuthBtn.addEventListener('click', () => {
                modal.classList.add('active');
                sounds.playClick();
            });
        }

        if (closeAuthBtn && modal) {
            closeAuthBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        // Quick 1-Click Demo Fill buttons
        const fillStudentBtn = document.getElementById('quick-fill-student');
        const fillAdminBtn = document.getElementById('quick-fill-admin');

        if (fillStudentBtn && loginForm) {
            fillStudentBtn.addEventListener('click', () => {
                loginForm.elements['authEmail'].value = 'student@campus.edu';
                loginForm.elements['authPassword'].value = 'student123';
                loginForm.elements['authRole'].value = 'student';
                sounds.playClick();
            });
        }

        if (fillAdminBtn && loginForm) {
            fillAdminBtn.addEventListener('click', () => {
                loginForm.elements['authEmail'].value = 'admin@canteen.edu';
                loginForm.elements['authPassword'].value = 'admin123';
                loginForm.elements['authRole'].value = 'admin';
                sounds.playClick();
            });
        }

        // Toggle Login / Register Tabs
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.dataset.target;
                if (loginForm && registerForm) {
                    loginForm.style.display = target === 'login' ? 'block' : 'none';
                    registerForm.style.display = target === 'register' ? 'block' : 'none';
                }
                sounds.playClick();
            });
        });

        // Submit Login Form
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = loginForm.elements['authEmail'].value;
                const password = loginForm.elements['authPassword'].value;
                const role = loginForm.elements['authRole'].value;

                try {
                    const user = store.login(email, password, role);
                    sounds.playSuccess();
                    showToast(`Welcome back, ${user.name}! (${role.toUpperCase()})`, 'success');
                    modal.classList.remove('active');
                    this.updateUserSessionUI();

                    if (role === 'admin') {
                        this.setViewMode('admin');
                    } else {
                        this.setViewMode('student');
                    }
                } catch (err) {
                    showToast(err.message, 'error');
                }
            });
        }

        // Submit Registration Form
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = registerForm.elements['regName'].value;
                const studentId = registerForm.elements['regStudentId'].value;
                const email = registerForm.elements['regEmail'].value;
                const phone = registerForm.elements['regPhone'].value;
                const password = registerForm.elements['regPassword'].value;

                try {
                    const newStudent = store.registerStudent({ name, email, password, studentId, phone });
                    sounds.playSuccess();
                    showToast(`Account created! Welcome, ${newStudent.name}. ₹300 welcome balance added!`, 'success');
                    modal.classList.remove('active');
                    this.updateUserSessionUI();
                    this.setViewMode('student');
                } catch (err) {
                    showToast(err.message, 'error');
                }
            });
        }

        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                store.setCurrentUser(SEED_DEFAULT_STUDENT);
                sounds.playClick();
                showToast('Reset to default student account.', 'info');
                this.updateUserSessionUI();
                this.setViewMode('student');
            });
        }
    }

    updateUserSessionUI() {
        const user = store.getCurrentUser();
        const userNameEl = document.getElementById('header-user-name');
        const userRoleEl = document.getElementById('header-user-role');
        const walletWrap = document.getElementById('header-wallet-container');
        const studentBadge = document.getElementById('student-profile-badge');

        if (userNameEl) userNameEl.textContent = user.name;
        if (userRoleEl) userRoleEl.textContent = user.role.toUpperCase();

        if (walletWrap) {
            walletWrap.style.display = user.role === 'student' ? 'inline-flex' : 'none';
        }

        if (studentBadge && user.role === 'student') {
            studentBadge.innerHTML = `
                <div class="user-avatar">🎓</div>
                <div class="user-text">
                    <strong>${user.name}</strong>
                    <span>Roll: ${user.studentId} • Phone: ${user.phone || 'N/A'}</span>
                </div>
            `;
        }

        studentApp.updateWalletBadge();
    }

    // ==========================================
    // CROSS-TAB & STORE SYNC LISTENER
    // ==========================================

    bindStoreSyncEvents() {
        window.addEventListener('canteen-store-update', (e) => {
            const { type, payload } = e.detail;

            // When an order status is updated
            if (type === 'ORDER_STATUS_CHANGED') {
                const { orderId, newStatus, order } = payload;
                const currentUser = store.getCurrentUser();

                // If this order belongs to current student and becomes READY
                if (order && order.studentId === currentUser.id && newStatus === 'READY') {
                    sounds.playReadyChime();
                    showToast(`🔔 Ding-Dong! Your Order #${order.token} is READY for Pickup at Counter #2!`, 'success', 8000);
                }

                // If this is a new order received by admin
                if (newStatus === 'PENDING') {
                    sounds.playKitchenAlert();
                }

                // Update UI views
                adminApp.renderDashboardStats();
                adminApp.renderOrdersQueue();
                adminApp.renderSalesReports();
                studentApp.renderOrderHistory();
                this.renderTokenTVBoard();

                if (studentApp.activeTrackingOrderId === orderId) {
                    const currentOrder = store.getOrderById(orderId);
                    if (currentOrder) studentApp.renderLiveTrackingCard(currentOrder);
                }
            }

            // When a new order is created
            if (type === 'ORDER_CREATED') {
                adminApp.renderDashboardStats();
                adminApp.renderOrdersQueue();
                adminApp.renderSalesReports();
                this.renderTokenTVBoard();
                if (this.currentViewMode === 'admin' || this.currentViewMode === 'split') {
                    sounds.playKitchenAlert();
                    showToast(`New incoming order Token #${payload.order?.token} received!`, 'warning');
                }
            }

            // When menu is updated
            if (type === 'MENU_UPDATED') {
                studentApp.renderMenu();
                adminApp.renderMenuManagement();
                adminApp.renderDashboardStats();
            }

            // When user auth changes
            if (type === 'AUTH_STATE_CHANGED') {
                this.updateUserSessionUI();
                studentApp.renderOrderHistory();
            }

            // When cart changes
            if (type === 'CART_UPDATED') {
                studentApp.renderCart();
            }

            // Fallback sync from other tabs
            if (type === 'SYNC_EVENT' || type === 'DATA_RESET') {
                studentApp.renderMenu();
                studentApp.renderCart();
                studentApp.renderOrderHistory();
                adminApp.renderDashboardStats();
                adminApp.renderOrdersQueue();
                adminApp.renderMenuManagement();
                adminApp.renderSalesReports();
                this.renderTokenTVBoard();
            }
        });
    }
}

// Bootstrapping
document.addEventListener('DOMContentLoaded', () => {
    window.canteenApp = new MainApp();
    window.canteenApp.init();
});
