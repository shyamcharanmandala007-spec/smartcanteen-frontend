/**
 * SmartCanteen - Central State Management & Data Store
 * Supports LocalStorage persistence and Cross-Tab Real-time BroadcastChannel sync.
 * Intermediate architecture: clean functions, robust error handling, modular events.
 */

const STORAGE_KEYS = {
    MENU: 'smart_canteen_menu_v1',
    ORDERS: 'smart_canteen_orders_v1',
    CURRENT_USER: 'smart_canteen_auth_v1',
    CART: 'smart_canteen_cart_v1',
    TOKEN_SEQ: 'smart_canteen_token_seq_v1',
    USERS: 'smart_canteen_users_v1'
};

class CanteenStore {
    constructor() {
        this.broadcastChannel = null;
        this.initBroadcastChannel();
        this.initStorage();
    }

    initBroadcastChannel() {
        try {
            if ('BroadcastChannel' in window) {
                this.broadcastChannel = new BroadcastChannel('smart_canteen_broadcast');
                this.broadcastChannel.onmessage = (event) => {
                    this.triggerLocalEvent(event.data.type, event.data.payload);
                };
            }
        } catch (e) {
            console.warn('BroadcastChannel not supported or restricted, relying on local state.');
        }

        // Also listen to storage events across tabs
        window.addEventListener('storage', (e) => {
            if (Object.values(STORAGE_KEYS).includes(e.key)) {
                this.triggerLocalEvent('SYNC_EVENT', { key: e.key });
            }
        });
    }

    notify(type, payload = {}) {
        this.triggerLocalEvent(type, payload);
        if (this.broadcastChannel) {
            try {
                this.broadcastChannel.postMessage({ type, payload });
            } catch (err) {
                console.warn('Broadcast error:', err);
            }
        }
    }

    triggerLocalEvent(type, payload) {
        const customEvent = new CustomEvent('canteen-store-update', {
            detail: { type, payload, timestamp: Date.now() }
        });
        window.dispatchEvent(customEvent);
    }

    initStorage() {
        if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
            localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(SEED_MENU_ITEMS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([SEED_DEFAULT_STUDENT, SEED_DEFAULT_ADMIN]));
        }
        if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_DEFAULT_STUDENT));
        }
        if (!localStorage.getItem(STORAGE_KEYS.CART)) {
            localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
        }
        if (!localStorage.getItem(STORAGE_KEYS.TOKEN_SEQ)) {
            localStorage.setItem(STORAGE_KEYS.TOKEN_SEQ, '105');
        }
    }

    resetToDemoData() {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(SEED_MENU_ITEMS));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([SEED_DEFAULT_STUDENT, SEED_DEFAULT_ADMIN]));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_DEFAULT_STUDENT));
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.TOKEN_SEQ, '105');
        this.notify('DATA_RESET', {});
    }

    // ==========================================
    // MENU CRUD OPERATIONS
    // ==========================================

    getMenuItems() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU)) || [];
        } catch {
            return SEED_MENU_ITEMS;
        }
    }

    getMenuItemById(id) {
        return this.getMenuItems().find(item => item.id === id) || null;
    }

    addMenuItem(itemData) {
        const items = this.getMenuItems();
        const newItem = {
            id: 'item-' + Date.now(),
            name: itemData.name.trim(),
            category: itemData.category || 'snacks',
            price: Number(itemData.price) || 0,
            isVeg: Boolean(itemData.isVeg),
            prepTime: Number(itemData.prepTime) || 10,
            inStock: itemData.inStock !== false,
            rating: 5.0,
            ratingCount: 1,
            description: itemData.description || '',
            image: itemData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
            calories: Number(itemData.calories) || 300
        };

        items.unshift(newItem);
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
        this.notify('MENU_UPDATED', { action: 'add', item: newItem });
        return newItem;
    }

    updateMenuItem(id, updatedFields) {
        const items = this.getMenuItems();
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return null;

        items[index] = { ...items[index], ...updatedFields };
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
        this.notify('MENU_UPDATED', { action: 'update', item: items[index] });
        return items[index];
    }

    deleteMenuItem(id) {
        let items = this.getMenuItems();
        const initialLen = items.length;
        items = items.filter(item => item.id !== id);
        if (items.length !== initialLen) {
            localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
            this.notify('MENU_UPDATED', { action: 'delete', id });
            return true;
        }
        return false;
    }

    toggleItemStock(id) {
        const item = this.getMenuItemById(id);
        if (!item) return null;
        return this.updateMenuItem(id, { inStock: !item.inStock });
    }

    // ==========================================
    // ORDER FLOW OPERATIONS
    // ==========================================

    getOrders() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
        } catch {
            return SEED_ORDERS;
        }
    }

    getOrderById(id) {
        return this.getOrders().find(o => o.id === id) || null;
    }

    getStudentOrders(studentId) {
        const orders = this.getOrders();
        return orders.filter(o => o.studentId === studentId);
    }

    generateToken() {
        let seq = parseInt(localStorage.getItem(STORAGE_KEYS.TOKEN_SEQ) || '105', 10);
        const token = `T-${seq}`;
        seq += 1;
        localStorage.setItem(STORAGE_KEYS.TOKEN_SEQ, seq.toString());
        return token;
    }

    createOrder({ items, pickupTime, paymentMethod, specialNotes = '' }) {
        const currentUser = this.getCurrentUser();
        if (!items || items.length === 0) {
            throw new Error('Cannot place an empty order.');
        }

        const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const tax = Math.round((subtotal * 0.05) * 100) / 100; // 5% GST/Service
        const total = Math.round((subtotal + tax) * 100) / 100;

        // Check wallet balance if paying with wallet
        if (paymentMethod === 'Campus Digital Wallet' && currentUser.role === 'student') {
            if ((currentUser.walletBalance || 0) < total) {
                throw new Error(`Insufficient wallet balance (Available: ₹${(currentUser.walletBalance || 0).toFixed(2)}, Needed: ₹${total.toFixed(2)})`);
            }
            this.deductWallet(currentUser.id, total);
        }

        const token = this.generateToken();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const orderId = `ORD-${randomNum}`;

        const newOrder = {
            id: orderId,
            token: token,
            studentId: currentUser.id || 'std-101',
            studentName: currentUser.name || 'Student',
            studentRoll: currentUser.studentId || 'STUDENT',
            status: 'PENDING', // Flowchart start status
            statusHistory: [
                { status: 'PENDING', time: new Date().toISOString(), note: 'Pre-order placed by student' }
            ],
            pickupTime: pickupTime || 'ASAP',
            createdAt: new Date().toISOString(),
            paymentMethod: paymentMethod || 'UPI',
            paymentStatus: 'PAID',
            items: items.map(i => ({
                id: i.id,
                name: i.name,
                price: i.price,
                qty: i.qty,
                image: i.image
            })),
            subtotal,
            tax,
            total,
            specialNotes,
            feedback: null
        };

        const orders = this.getOrders();
        orders.unshift(newOrder);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

        this.notify('ORDER_CREATED', { order: newOrder });
        return newOrder;
    }

    updateOrderStatus(orderId, newStatus) {
        const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Invalid order status: ${newStatus}`);
        }

        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (!order) return null;

        order.status = newStatus;
        if (!order.statusHistory) {
            order.statusHistory = [];
        }
        order.statusHistory.push({
            status: newStatus,
            time: new Date().toISOString(),
            note: `Status updated to ${newStatus}`
        });

        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        this.notify('ORDER_STATUS_CHANGED', { orderId, newStatus, order });
        return order;
    }

    submitFeedback(orderId, { rating, review, tags }) {
        const orders = this.getOrders();
        const order = orders.find(o => o.id === orderId);
        if (!order) return null;

        order.feedback = {
            rating: Number(rating) || 5,
            review: review || '',
            tags: Array.isArray(tags) ? tags : [],
            submittedAt: new Date().toISOString()
        };

        // Also update ratings on ordered items
        this.updateItemRatingsFromOrder(order.items, rating);

        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        this.notify('ORDER_FEEDBACK_SUBMITTED', { orderId, feedback: order.feedback });
        return order;
    }

    updateItemRatingsFromOrder(items, rating) {
        const menuItems = this.getMenuItems();
        let changed = false;

        items.forEach(orderItem => {
            const mItem = menuItems.find(m => m.id === orderItem.id);
            if (mItem) {
                const curCount = mItem.ratingCount || 1;
                const curAvg = mItem.rating || 4.5;
                const newCount = curCount + 1;
                const newAvg = ((curAvg * curCount) + Number(rating)) / newCount;
                mItem.rating = Math.round(newAvg * 10) / 10;
                mItem.ratingCount = newCount;
                changed = true;
            }
        });

        if (changed) {
            localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
        }
    }

    // ==========================================
    // CART MANAGEMENT
    // ==========================================

    getCart() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
        } catch {
            return [];
        }
    }

    addToCart(item, qty = 1) {
        const cart = this.getCart();
        const existing = cart.find(c => c.id === item.id);

        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                isVeg: item.isVeg,
                prepTime: item.prepTime,
                qty: qty
            });
        }

        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        this.notify('CART_UPDATED', { cart });
        return cart;
    }

    updateCartQty(itemId, newQty) {
        let cart = this.getCart();
        if (newQty <= 0) {
            cart = cart.filter(c => c.id !== itemId);
        } else {
            const item = cart.find(c => c.id === itemId);
            if (item) item.qty = newQty;
        }

        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        this.notify('CART_UPDATED', { cart });
        return cart;
    }

    removeFromCart(itemId) {
        let cart = this.getCart();
        cart = cart.filter(c => c.id !== itemId);
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        this.notify('CART_UPDATED', { cart });
        return cart;
    }

    clearCart() {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
        this.notify('CART_UPDATED', { cart: [] });
    }

    getCartSummary() {
        const cart = this.getCart();
        const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const tax = Math.round((subtotal * 0.05) * 100) / 100;
        const total = Math.round((subtotal + tax) * 100) / 100;

        return { cart, itemCount, subtotal, tax, total };
    }

    // ==========================================
    // USER AUTH & WALLET
    // ==========================================

    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [SEED_DEFAULT_STUDENT, SEED_DEFAULT_ADMIN];
        } catch {
            return [SEED_DEFAULT_STUDENT, SEED_DEFAULT_ADMIN];
        }
    }

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || SEED_DEFAULT_STUDENT;
        } catch {
            return SEED_DEFAULT_STUDENT;
        }
    }

    setCurrentUser(user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        this.notify('AUTH_STATE_CHANGED', { user });
    }

    login(email, password, role) {
        const users = this.getUsers();
        const found = users.find(u =>
            u.email.toLowerCase() === email.toLowerCase().trim() &&
            u.password === password &&
            u.role === role
        );

        if (!found) {
            throw new Error('Invalid credentials! Please check your email, password, and chosen role.');
        }

        this.setCurrentUser(found);
        return found;
    }

    registerStudent({ name, email, password, studentId, phone }) {
        const users = this.getUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
            throw new Error('An account with this email already exists.');
        }

        const newStudent = {
            id: 'std-' + Date.now(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            role: 'student',
            studentId: studentId.trim().toUpperCase(),
            phone: phone.trim(),
            walletBalance: 300.00 // Welcome bonus wallet balance!
        };

        users.push(newStudent);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        this.setCurrentUser(newStudent);
        return newStudent;
    }

    deductWallet(userId, amount) {
        const users = this.getUsers();
        const u = users.find(user => user.id === userId);
        if (u) {
            u.walletBalance = Math.max(0, Math.round(((u.walletBalance || 0) - amount) * 100) / 100);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

            const cur = this.getCurrentUser();
            if (cur && cur.id === userId) {
                cur.walletBalance = u.walletBalance;
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(cur));
            }
        }
    }

    addWalletBalance(amount) {
        const cur = this.getCurrentUser();
        if (!cur || cur.role !== 'student') return;

        const users = this.getUsers();
        const u = users.find(user => user.id === cur.id);
        const added = Number(amount) || 0;
        if (u) {
            u.walletBalance = Math.round(((u.walletBalance || 0) + added) * 100) / 100;
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            cur.walletBalance = u.walletBalance;
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(cur));
            this.notify('AUTH_STATE_CHANGED', { user: cur });
        }
    }
}

// Global Store Instance
const store = new CanteenStore();
