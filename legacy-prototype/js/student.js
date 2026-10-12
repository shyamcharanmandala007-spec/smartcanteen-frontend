/**
 * SmartCanteen - Student Workflow Controller
 * Implements full Student Flow from the flowchart:
 * View Menu -> Add to Cart -> Select Pickup Time -> Place Pre-Order ->
 * Make Payment -> Generate Order ID & Token -> Live Status Tracking ->
 * Token Collection -> Rating / Feedback.
 */

class StudentApp {
    constructor() {
        this.selectedCategory = 'all';
        this.selectedDiet = 'all'; // 'all', 'veg', 'nonveg'
        this.searchQuery = '';
        this.sortBy = 'popular';
        this.selectedPickupSlot = 'ASAP';
        this.selectedPaymentMethod = 'UPI';
        this.activeTrackingOrderId = null;
    }

    init() {
        this.renderCategoryPills();
        this.renderMenu();
        this.renderCart();
        this.renderPickupSlots();
        this.renderOrderHistory();
        this.bindEvents();
    }

    bindEvents() {
        // Search bar
        const searchInput = document.getElementById('student-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.renderMenu();
            });
        }

        // Diet filter buttons
        const dietBtns = document.querySelectorAll('.diet-filter-btn');
        dietBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                dietBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedDiet = btn.dataset.diet;
                this.renderMenu();
            });
        });

        // Sort select
        const sortSelect = document.getElementById('student-sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.renderMenu();
            });
        }

        // Cart Drawer toggle
        const openCartBtn = document.getElementById('open-cart-btn');
        const closeCartBtn = document.getElementById('close-cart-btn');
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');

        if (openCartBtn && cartDrawer && cartOverlay) {
            openCartBtn.addEventListener('click', () => {
                cartDrawer.classList.add('open');
                cartOverlay.classList.add('open');
                sounds.playClick();
            });
        }

        if (closeCartBtn && cartDrawer && cartOverlay) {
            const closeCart = () => {
                cartDrawer.classList.remove('open');
                cartOverlay.classList.remove('open');
            };
            closeCartBtn.addEventListener('click', closeCart);
            cartOverlay.addEventListener('click', closeCart);
        }

        // Checkout Button -> opens Payment Modal
        const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
        if (proceedCheckoutBtn) {
            proceedCheckoutBtn.addEventListener('click', () => {
                const { cart } = store.getCartSummary();
                if (cart.length === 0) {
                    showToast('Your cart is empty. Add items from the menu first!', 'warning');
                    return;
                }
                this.openPaymentModal();
            });
        }

        // Payment Method selection
        const paymentOptions = document.querySelectorAll('.payment-option-card');
        paymentOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                paymentOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                this.selectedPaymentMethod = opt.dataset.method;
                this.updatePaymentDetailsView();
                sounds.playClick();
            });
        });

        // Confirm Payment & Place Pre-Order button
        const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
        if (confirmPaymentBtn) {
            confirmPaymentBtn.addEventListener('click', () => {
                this.handlePaymentAndPlaceOrder();
            });
        }

        // Add funds to wallet quick button
        const topupWalletBtn = document.getElementById('topup-wallet-btn');
        if (topupWalletBtn) {
            topupWalletBtn.addEventListener('click', () => {
                store.addWalletBalance(200);
                showToast('Added ₹200 to your Canteen Wallet! 🎉', 'success');
                this.updateWalletBadge();
            });
        }
    }

    renderCategoryPills() {
        const container = document.getElementById('category-pills-container');
        if (!container) return;

        container.innerHTML = SEED_CATEGORIES.map(cat => `
            <button class="category-pill ${cat.id === this.selectedCategory ? 'active' : ''}" 
                    data-category="${cat.id}">
                <span class="cat-icon">${cat.icon}</span>
                <span class="cat-name">${cat.name}</span>
            </button>
        `).join('');

        container.querySelectorAll('.category-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedCategory = btn.dataset.category;
                sounds.playClick();
                this.renderMenu();
            });
        });
    }

    renderPickupSlots() {
        const container = document.getElementById('pickup-slots-container');
        if (!container) return;

        container.innerHTML = SEED_PICKUP_SLOTS.map((slot, index) => `
            <div class="pickup-slot-card ${slot.value === this.selectedPickupSlot ? 'active' : ''}" 
                 data-value="${slot.value}">
                <div class="slot-radio-circle"></div>
                <div class="slot-info">
                    <span class="slot-title">${slot.label}</span>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.pickup-slot-card').forEach(card => {
            card.addEventListener('click', () => {
                container.querySelectorAll('.pickup-slot-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.selectedPickupSlot = card.dataset.value;
                sounds.playClick();

                // If custom slot, prompt for time
                const customInputWrapper = document.getElementById('custom-pickup-time-wrapper');
                if (customInputWrapper) {
                    customInputWrapper.style.display = this.selectedPickupSlot === 'custom' ? 'block' : 'none';
                }
            });
        });
    }

    renderMenu() {
        const grid = document.getElementById('food-menu-grid');
        const emptyState = document.getElementById('menu-empty-state');
        if (!grid) return;

        let items = store.getMenuItems();

        // 1. Filter by category
        if (this.selectedCategory !== 'all') {
            items = items.filter(item => item.category === this.selectedCategory);
        }

        // 2. Filter by veg/non-veg
        if (this.selectedDiet === 'veg') {
            items = items.filter(item => item.isVeg === true);
        } else if (this.selectedDiet === 'nonveg') {
            items = items.filter(item => item.isVeg === false);
        }

        // 3. Filter by search query
        if (this.searchQuery) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(this.searchQuery) ||
                item.description.toLowerCase().includes(this.searchQuery)
            );
        }

        // 4. Sort
        if (this.sortBy === 'price-low') {
            items.sort((a, b) => a.price - b.price);
        } else if (this.sortBy === 'price-high') {
            items.sort((a, b) => b.price - a.price);
        } else if (this.sortBy === 'time-fast') {
            items.sort((a, b) => a.prepTime - b.prepTime);
        } else {
            // popular
            items.sort((a, b) => (b.rating * b.ratingCount) - (a.rating * a.ratingCount));
        }

        if (items.length === 0) {
            grid.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        const cart = store.getCart();

        grid.innerHTML = items.map(item => {
            const inCartItem = cart.find(c => c.id === item.id);
            const cartQty = inCartItem ? inCartItem.qty : 0;
            const vegIcon = item.isVeg
                ? `<span class="veg-badge" title="Vegetarian"><span class="dot veg"></span> Veg</span>`
                : `<span class="nonveg-badge" title="Non-Vegetarian"><span class="dot nonveg"></span> Non-Veg</span>`;

            return `
                <div class="food-card ${!item.inStock ? 'out-of-stock' : ''}" data-id="${item.id}">
                    <div class="food-img-container">
                        <img src="${item.image}" alt="${item.name}" loading="lazy" class="food-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'">
                        <div class="food-badges">
                            ${vegIcon}
                            <span class="prep-badge">⏱️ ${item.prepTime} min</span>
                        </div>
                        ${!item.inStock ? `<div class="sold-out-overlay">SOLD OUT TODAY</div>` : ''}
                    </div>
                    <div class="food-details">
                        <div class="food-header">
                            <h3 class="food-title">${item.name}</h3>
                            <div class="food-rating">★ ${item.rating.toFixed(1)} <span class="rating-count">(${item.ratingCount})</span></div>
                        </div>
                        <p class="food-desc">${item.description}</p>
                        <div class="food-footer">
                            <div class="food-price-wrapper">
                                <span class="currency">₹</span>
                                <span class="price-val">${item.price}</span>
                                <span class="calorie-tag">${item.calories} kcal</span>
                            </div>
                            <div class="food-action-area">
                                ${!item.inStock ? `
                                    <button class="btn btn-disabled" disabled>Unavailable</button>
                                ` : cartQty > 0 ? `
                                    <div class="qty-stepper-mini">
                                        <button class="qty-btn-mini minus-btn" data-id="${item.id}">−</button>
                                        <span class="qty-val-mini">${cartQty}</span>
                                        <button class="qty-btn-mini plus-btn" data-id="${item.id}">+</button>
                                    </div>
                                ` : `
                                    <button class="btn btn-primary add-to-cart-btn" data-id="${item.id}">
                                        <span>+ Add</span>
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind Add & Stepper clicks
        grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = store.getMenuItemById(id);
                if (item) {
                    store.addToCart(item, 1);
                    sounds.playClick();
                    showToast(`Added ${item.name} to cart!`, 'success');
                    this.renderMenu();
                    this.renderCart();
                }
            });
        });

        grid.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const cart = store.getCart();
                const cur = cart.find(c => c.id === id);
                if (cur) {
                    store.updateCartQty(id, cur.qty + 1);
                    sounds.playClick();
                    this.renderMenu();
                    this.renderCart();
                }
            });
        });

        grid.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const cart = store.getCart();
                const cur = cart.find(c => c.id === id);
                if (cur) {
                    store.updateCartQty(id, cur.qty - 1);
                    sounds.playClick();
                    this.renderMenu();
                    this.renderCart();
                }
            });
        });
    }

    renderCart() {
        const { cart, itemCount, subtotal, tax, total } = store.getCartSummary();

        // Update floating cart badge and header count
        const cartBadge = document.getElementById('cart-floating-badge');
        const cartHeaderCount = document.getElementById('cart-header-count');
        if (cartBadge) {
            cartBadge.textContent = itemCount;
            cartBadge.style.display = itemCount > 0 ? 'inline-flex' : 'none';
        }
        if (cartHeaderCount) {
            cartHeaderCount.textContent = `(${itemCount} ${itemCount === 1 ? 'item' : 'items'})`;
        }

        const itemsContainer = document.getElementById('cart-items-container');
        const emptyCartState = document.getElementById('cart-empty-message');
        const cartSummaryBox = document.getElementById('cart-summary-box');

        if (!itemsContainer) return;

        if (cart.length === 0) {
            itemsContainer.innerHTML = '';
            if (emptyCartState) emptyCartState.style.display = 'block';
            if (cartSummaryBox) cartSummaryBox.style.display = 'none';
            return;
        }

        if (emptyCartState) emptyCartState.style.display = 'none';
        if (cartSummaryBox) cartSummaryBox.style.display = 'block';

        itemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item-row" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <span class="cart-item-price">₹${item.price} each</span>
                </div>
                <div class="cart-item-controls">
                    <div class="qty-stepper">
                        <button class="cart-qty-btn cart-minus-btn" data-id="${item.id}">−</button>
                        <span class="cart-qty-val">${item.qty}</span>
                        <button class="cart-qty-btn cart-plus-btn" data-id="${item.id}">+</button>
                    </div>
                    <span class="cart-item-total">₹${item.price * item.qty}</span>
                    <button class="cart-remove-btn" data-id="${item.id}" title="Remove item">&times;</button>
                </div>
            </div>
        `).join('');

        // Update totals
        const subtotalEl = document.getElementById('cart-subtotal-val');
        const taxEl = document.getElementById('cart-tax-val');
        const totalEl = document.getElementById('cart-total-val');

        if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;

        // Bind cart row buttons
        itemsContainer.querySelectorAll('.cart-plus-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const cur = cart.find(c => c.id === id);
                if (cur) {
                    store.updateCartQty(id, cur.qty + 1);
                    sounds.playClick();
                    this.renderCart();
                    this.renderMenu();
                }
            });
        });

        itemsContainer.querySelectorAll('.cart-minus-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const cur = cart.find(c => c.id === id);
                if (cur) {
                    store.updateCartQty(id, cur.qty - 1);
                    sounds.playClick();
                    this.renderCart();
                    this.renderMenu();
                }
            });
        });

        itemsContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                store.removeFromCart(id);
                sounds.playClick();
                showToast('Item removed from cart', 'info');
                this.renderCart();
                this.renderMenu();
            });
        });
    }

    openPaymentModal() {
        const { total, itemCount } = store.getCartSummary();
        const modal = document.getElementById('payment-modal');
        if (!modal) return;

        // Update payment modal bill details
        const billTotalEl = document.getElementById('modal-pay-total');
        const billItemsEl = document.getElementById('modal-pay-count');
        const billSlotEl = document.getElementById('modal-pay-slot');

        let slotDisplay = this.selectedPickupSlot;
        if (slotDisplay === 'custom') {
            const customInput = document.getElementById('custom-pickup-time-input');
            slotDisplay = customInput && customInput.value ? customInput.value : 'Custom Slot';
        }

        if (billTotalEl) billTotalEl.textContent = `₹${total.toFixed(2)}`;
        if (billItemsEl) billItemsEl.textContent = `${itemCount} items`;
        if (billSlotEl) billSlotEl.textContent = slotDisplay;

        this.updatePaymentDetailsView();
        modal.classList.add('active');
        sounds.playClick();
    }

    updatePaymentDetailsView() {
        const currentUser = store.getCurrentUser();
        const { total } = store.getCartSummary();

        const upiView = document.getElementById('pay-method-upi-view');
        const walletView = document.getElementById('pay-method-wallet-view');
        const cardView = document.getElementById('pay-method-card-view');
        const cashView = document.getElementById('pay-method-cash-view');

        if (upiView) upiView.style.display = this.selectedPaymentMethod === 'UPI' ? 'block' : 'none';
        if (walletView) walletView.style.display = this.selectedPaymentMethod === 'WALLET' ? 'block' : 'none';
        if (cardView) cardView.style.display = this.selectedPaymentMethod === 'CARD' ? 'block' : 'none';
        if (cashView) cashView.style.display = this.selectedPaymentMethod === 'CASH' ? 'block' : 'none';

        // Update wallet balance display
        const walletBalEl = document.getElementById('pay-modal-wallet-balance');
        const walletWarnEl = document.getElementById('pay-modal-wallet-warning');
        if (walletBalEl) {
            const bal = currentUser.walletBalance || 0;
            walletBalEl.textContent = `₹${bal.toFixed(2)}`;
            if (walletWarnEl) {
                walletWarnEl.style.display = bal < total ? 'block' : 'none';
            }
        }
    }

    closePaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (modal) modal.classList.remove('active');
    }

    handlePaymentAndPlaceOrder() {
        const { cart, total } = store.getCartSummary();
        const currentUser = store.getCurrentUser();

        let paymentLabel = 'UPI (QR Pay)';
        if (this.selectedPaymentMethod === 'WALLET') {
            paymentLabel = 'Campus Digital Wallet';
            if ((currentUser.walletBalance || 0) < total) {
                showToast('Insufficient wallet balance! Please top up or select UPI.', 'error');
                return;
            }
        } else if (this.selectedPaymentMethod === 'CARD') {
            paymentLabel = 'Debit/Credit Card';
        } else if (this.selectedPaymentMethod === 'CASH') {
            paymentLabel = 'Pay at Canteen Counter';
        }

        let slotDisplay = this.selectedPickupSlot;
        if (slotDisplay === 'custom') {
            const customInput = document.getElementById('custom-pickup-time-input');
            slotDisplay = (customInput && customInput.value) ? customInput.value : 'Custom Pickup';
        }

        const notesInput = document.getElementById('order-special-notes');
        const specialNotes = notesInput ? notesInput.value.trim() : '';

        // Simulate payment gateway processing state
        const payBtn = document.getElementById('confirm-payment-btn');
        const originalBtnText = payBtn.innerHTML;
        payBtn.disabled = true;
        payBtn.innerHTML = `<span class="spinner-sm"></span> Processing Payment...`;

        setTimeout(() => {
            try {
                const order = store.createOrder({
                    items: cart,
                    pickupTime: slotDisplay,
                    paymentMethod: paymentLabel,
                    specialNotes: specialNotes
                });

                payBtn.disabled = false;
                payBtn.innerHTML = originalBtnText;

                // Close cart and payment modal
                this.closePaymentModal();
                const cartDrawer = document.getElementById('cart-drawer');
                const cartOverlay = document.getElementById('cart-overlay');
                if (cartDrawer) cartDrawer.classList.remove('open');
                if (cartOverlay) cartOverlay.classList.remove('open');

                // Clear cart in store
                store.clearCart();
                this.renderCart();
                this.renderMenu();
                this.updateWalletBadge();

                // Play sound and show Order Token Screen
                sounds.playSuccess();
                showToast(`Payment Successful! Order Token #${order.token} generated.`, 'success');
                this.showOrderConfirmationModal(order);
                this.renderOrderHistory();

            } catch (err) {
                payBtn.disabled = false;
                payBtn.innerHTML = originalBtnText;
                showToast(err.message, 'error');
            }
        }, 1200);
    }

    showOrderConfirmationModal(order) {
        const modal = document.getElementById('order-token-modal');
        if (!modal) return;

        // Populate Token Details
        const tokenBadge = document.getElementById('confirm-token-badge');
        const orderIdEl = document.getElementById('confirm-order-id');
        const pickupSlotEl = document.getElementById('confirm-pickup-slot');
        const amountEl = document.getElementById('confirm-order-amount');
        const itemsListEl = document.getElementById('confirm-order-items-list');

        if (tokenBadge) tokenBadge.textContent = order.token;
        if (orderIdEl) orderIdEl.textContent = order.id;
        if (pickupSlotEl) pickupSlotEl.textContent = order.pickupTime;
        if (amountEl) amountEl.textContent = `₹${order.total.toFixed(2)}`;

        if (itemsListEl) {
            itemsListEl.innerHTML = order.items.map(i => `
                <div class="confirm-item-row">
                    <span>${i.qty}x ${i.name}</span>
                    <span>₹${(i.price * i.qty).toFixed(2)}</span>
                </div>
            `).join('');
        }

        modal.classList.add('active');

        // Track this order immediately
        this.activeTrackingOrderId = order.id;

        const trackBtn = document.getElementById('track-order-modal-btn');
        if (trackBtn) {
            trackBtn.onclick = () => {
                modal.classList.remove('active');
                this.openOrderTrackingView(order.id);
            };
        }

        const closeBtn = document.getElementById('close-token-modal-btn');
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.remove('active');
        }
    }

    openOrderTrackingView(orderId) {
        const order = store.getOrderById(orderId);
        if (!order) return;

        this.activeTrackingOrderId = orderId;
        const trackingSection = document.getElementById('student-tracking-section');
        if (trackingSection) {
            trackingSection.scrollIntoView({ behavior: 'smooth' });
        }
        this.renderLiveTrackingCard(order);
    }

    renderLiveTrackingCard(order) {
        const container = document.getElementById('student-live-tracking-container');
        if (!container) return;

        const stages = [
            { key: 'PENDING', label: 'Pending', icon: '📋', desc: 'Order received by canteen' },
            { key: 'CONFIRMED', label: 'Confirmed', icon: '✅', desc: 'Kitchen accepted your order' },
            { key: 'PREPARING', label: 'Preparing', icon: '🍳', desc: 'Chef is cooking your meal' },
            { key: 'READY', label: 'Ready', icon: '🍽️', desc: 'Ready for pickup at counter!' },
            { key: 'COMPLETED', label: 'Completed', icon: '🛍️', desc: 'Food collected successfully' }
        ];

        const currentIndex = stages.findIndex(s => s.key === order.status);

        container.innerHTML = `
            <div class="live-tracking-card status-${order.status.toLowerCase()}">
                <div class="tracking-top-bar">
                    <div class="tracking-token-pill">
                        <span class="token-title">Pickup Token</span>
                        <span class="token-code">${order.token}</span>
                    </div>
                    <div class="tracking-meta">
                        <span class="order-id-badge">${order.id}</span>
                        <span class="pickup-time-pill">⏰ Slot: ${order.pickupTime}</span>
                    </div>
                </div>

                <!-- 5-Stage Status Stepper from Flowchart -->
                <div class="status-stepper-container">
                    <div class="stepper-progress-track">
                        <div class="stepper-progress-fill" style="width: ${(currentIndex / (stages.length - 1)) * 100}%;"></div>
                    </div>
                    <div class="stepper-steps-wrapper">
                        ${stages.map((stage, idx) => {
                            const isDone = idx < currentIndex;
                            const isCurrent = idx === currentIndex;
                            const statusClass = isCurrent ? 'active' : isDone ? 'completed' : 'pending';
                            return `
                                <div class="stepper-step ${statusClass}">
                                    <div class="step-circle">${stage.icon}</div>
                                    <span class="step-label">${stage.label}</span>
                                    <span class="step-desc-micro">${isCurrent ? 'Current' : isDone ? 'Done' : 'Next'}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Status Live Announcement Banner -->
                <div class="status-live-banner ${order.status.toLowerCase()}">
                    <div class="banner-icon-pulse">${stages[currentIndex].icon}</div>
                    <div class="banner-text">
                        <h4>Current Status: ${stages[currentIndex].label.toUpperCase()}</h4>
                        <p>${stages[currentIndex].desc}</p>
                    </div>
                </div>

                <!-- Order Items Breakdown -->
                <div class="tracking-items-list">
                    <h5>Items in this Order (${order.items.length})</h5>
                    ${order.items.map(item => `
                        <div class="tracking-item-row">
                            <span>${item.qty} × ${item.name}</span>
                            <span>₹${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    `).join('')}
                    <div class="tracking-total-row">
                        <span>Total Paid (${order.paymentMethod})</span>
                        <strong>₹${order.total.toFixed(2)}</strong>
                    </div>
                </div>

                <!-- Student Action Area -->
                <div class="tracking-action-bar">
                    ${order.status === 'READY' ? `
                        <div class="ready-alert-box">
                            <span class="alert-bell">🔔</span>
                            <div>
                                <strong>Your food is ready at Counter #2!</strong>
                                <p>Show Token <strong>${order.token}</strong> to canteen staff.</p>
                            </div>
                        </div>
                        <button class="btn btn-success btn-lg collect-btn" data-id="${order.id}">
                            ✅ I Have Collected My Food
                        </button>
                    ` : order.status === 'COMPLETED' ? `
                        ${!order.feedback ? `
                            <button class="btn btn-accent btn-lg rate-btn" data-id="${order.id}">
                                ⭐ Rate & Give Feedback
                            </button>
                        ` : `
                            <div class="feedback-submitted-pill">
                                ⭐ Feedback Submitted (${order.feedback.rating}/5 Stars)
                            </div>
                        `}
                    ` : `
                        <div class="preparing-wait-tip">
                            <span>💡 Tip:</span> Relax while our kitchen prepares your food. You will receive an instant chime when ready!
                        </div>
                    `}
                </div>
            </div>
        `;

        // Bind student collection button
        const collectBtn = container.querySelector('.collect-btn');
        if (collectBtn) {
            collectBtn.addEventListener('click', () => {
                store.updateOrderStatus(order.id, 'COMPLETED');
                sounds.playSuccess();
                showToast('Order marked as Completed! Enjoy your meal 🍔', 'success');
                this.renderLiveTrackingCard(store.getOrderById(order.id));
                this.renderOrderHistory();
            });
        }

        // Bind feedback button
        const rateBtn = container.querySelector('.rate-btn');
        if (rateBtn) {
            rateBtn.addEventListener('click', () => {
                this.openFeedbackModal(order.id);
            });
        }
    }

    openFeedbackModal(orderId) {
        const order = store.getOrderById(orderId);
        if (!order) return;

        const modal = document.getElementById('feedback-modal');
        if (!modal) return;

        const tokenSpan = document.getElementById('feedback-modal-token');
        if (tokenSpan) tokenSpan.textContent = order.token;

        let selectedRating = 5;
        const starBtns = modal.querySelectorAll('.star-btn');
        const updateStars = (val) => {
            selectedRating = val;
            starBtns.forEach(b => {
                const bVal = parseInt(b.dataset.value, 10);
                b.classList.toggle('active', bVal <= val);
            });
        };
        updateStars(5);

        starBtns.forEach(b => {
            b.onclick = () => {
                updateStars(parseInt(b.dataset.value, 10));
                sounds.playClick();
            };
        });

        // Tag pills
        const tagChips = modal.querySelectorAll('.feedback-tag-chip');
        tagChips.forEach(chip => {
            chip.onclick = () => {
                chip.classList.toggle('active');
                sounds.playClick();
            };
        });

        const submitBtn = document.getElementById('submit-feedback-btn');
        if (submitBtn) {
            submitBtn.onclick = () => {
                const commentInput = document.getElementById('feedback-comment-input');
                const comment = commentInput ? commentInput.value.trim() : '';
                const activeTags = Array.from(modal.querySelectorAll('.feedback-tag-chip.active')).map(c => c.textContent.trim());

                store.submitFeedback(orderId, {
                    rating: selectedRating,
                    review: comment,
                    tags: activeTags
                });

                modal.classList.remove('active');
                sounds.playSuccess();
                showToast('Thank you for rating your food experience! ⭐', 'success');

                this.renderLiveTrackingCard(store.getOrderById(orderId));
                this.renderOrderHistory();
            };
        }

        const closeBtn = document.getElementById('close-feedback-modal-btn');
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.remove('active');
        }

        modal.classList.add('active');
    }

    renderOrderHistory() {
        const currentUser = store.getCurrentUser();
        const historyContainer = document.getElementById('student-order-history-list');
        if (!historyContainer) return;

        const studentOrders = store.getStudentOrders(currentUser.id);

        if (studentOrders.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-history-box">
                    <p>No past pre-orders yet. Place your first order today!</p>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = studentOrders.map(order => `
            <div class="history-order-card" data-id="${order.id}">
                <div class="history-order-header">
                    <div class="token-history-badge">${order.token}</div>
                    <div class="history-order-meta">
                        <strong>${order.id}</strong>
                        <span class="history-order-date">${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <span class="status-pill status-${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="history-order-items-snippet">
                    ${order.items.map(i => `${i.qty}× ${i.name}`).join(', ')}
                </div>
                <div class="history-order-footer">
                    <span>Paid ₹${order.total.toFixed(2)}</span>
                    <button class="btn btn-outline-sm view-track-btn" data-id="${order.id}">
                        View Details & Tracking →
                    </button>
                </div>
            </div>
        `).join('');

        historyContainer.querySelectorAll('.view-track-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                this.openOrderTrackingView(id);
            });
        });

        // If no active tracking order selected yet, select the most recent one
        if (!this.activeTrackingOrderId && studentOrders.length > 0) {
            this.renderLiveTrackingCard(studentOrders[0]);
        } else if (this.activeTrackingOrderId) {
            const current = store.getOrderById(this.activeTrackingOrderId);
            if (current) this.renderLiveTrackingCard(current);
        }
    }

    updateWalletBadge() {
        const currentUser = store.getCurrentUser();
        const walletEl = document.getElementById('header-wallet-amount');
        if (walletEl && currentUser.role === 'student') {
            walletEl.textContent = `₹${(currentUser.walletBalance || 0).toFixed(2)}`;
        }
    }
}

// Global Student controller
const studentApp = new StudentApp();
