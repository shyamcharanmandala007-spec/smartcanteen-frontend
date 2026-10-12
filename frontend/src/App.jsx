import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import MenuSection from './components/MenuSection';
import CartDrawer from './components/CartDrawer';
import OrderTrackerModal from './components/OrderTrackerModal';
import AdminDashboard from './components/AdminDashboard';
import FeedbackModal from './components/FeedbackModal';
import AuthModal from './components/AuthModal';
import { api } from './services/api';

// Fallback seed menu in case backend is offline
const INITIAL_MENU = [
  { id: 1, name: 'Masala Dosa with Sambar', description: 'Crispy golden crepe served with hot lentil stew and coconut chutney', price: 65, category: 'Breakfast', imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400', isVeg: true, isAvailable: true, preparationTimeMinutes: 8 },
  { id: 2, name: 'Paneer Butter Masala Combo', description: 'Rich cottage cheese gravy served with 2 butter naans and jeera rice', price: 140, category: 'Lunch', imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', isVeg: true, isAvailable: true, preparationTimeMinutes: 15 },
  { id: 3, name: 'Chicken Biryani Special', description: 'Fragrant basmati rice layered with spiced chicken and served with raita', price: 180, category: 'Lunch', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', isVeg: false, isAvailable: true, preparationTimeMinutes: 12 },
  { id: 4, name: 'Crispy Veg Burger & Fries', description: 'Grilled mixed-veg patty with lettuce, cheddar cheese and fries', price: 85, category: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', isVeg: true, isAvailable: true, preparationTimeMinutes: 10 },
  { id: 5, name: 'Cold Coffee with Ice Cream', description: 'Chilled whipped Arabica blend topped with vanilla scoop', price: 60, category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400', isVeg: true, isAvailable: true, preparationTimeMinutes: 5 },
  { id: 6, name: 'Hot Masala Chai', description: 'Fresh brewed Assam tea leaves with cardamom and ginger spices', price: 20, category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400', isVeg: true, isAvailable: true, preparationTimeMinutes: 3 },
  { id: 7, name: 'Warm Chocolate Brownie', description: 'Sizzling fudge brownie drizzled with warm chocolate sauce', price: 75, category: 'Desserts', imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', isVeg: true, isAvailable: true, preparationTimeMinutes: 6 },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('student'); // 'student' or 'admin'
  const [menuItems, setMenuItems] = useState(INITIAL_MENU);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTrackerOrder, setActiveTrackerOrder] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [kpis, setKpis] = useState({ pendingOrders: 0, cookingOrders: 0, readyOrders: 0, completedOrders: 0, totalRevenue: 0 });

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState(null);

  // BroadcastChannel reference for cross-tab real-time communication
  const channelRef = useRef(null);

  // Play audio chime using Web Audio API
  const playAlertChime = (type = 'success') => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'ready') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      } else {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        osc.frequency.setValueAtTime(554.37, audioCtx.currentTime + 0.1); // C#5
      }

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // AudioContext not allowed or not supported
    }
  };

  // Recompute KPIs from current orders list
  const recalculateKpis = (orderList) => {
    const pending = orderList.filter((o) => o.status === 'PENDING').length;
    const cooking = orderList.filter((o) => o.status === 'CONFIRMED' || o.status === 'PREPARING').length;
    const ready = orderList.filter((o) => o.status === 'READY').length;
    const completed = orderList.filter((o) => o.status === 'COMPLETED').length;
    const rev = orderList
      .filter((o) => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    setKpis({
      pendingOrders: pending,
      cookingOrders: cooking,
      readyOrders: ready,
      completedOrders: completed,
      totalRevenue: rev,
      totalMenuItems: menuItems.length,
    });
  };

  // Setup BroadcastChannel for Instant Cross-Tab Sync
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('smartcanteen_sync_channel');
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};

        if (type === 'NEW_ORDER') {
          // Admin tab receives order placed in Student tab!
          setOrders((prev) => {
            const next = [payload, ...prev.filter((o) => o.id !== payload.id)];
            localStorage.setItem('smartcanteen_shared_orders', JSON.stringify(next));
            recalculateKpis(next);
            return next;
          });
          playAlertChime('success');
        } else if (type === 'STATUS_UPDATED') {
          // Student tab receives status change made by Admin in other tab!
          const { orderId, newStatus } = payload;
          setOrders((prev) => {
            const next = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
            localStorage.setItem('smartcanteen_shared_orders', JSON.stringify(next));
            recalculateKpis(next);
            return next;
          });

          setActiveTrackerOrder((curr) => {
            if (curr && curr.id === orderId) {
              return { ...curr, status: newStatus };
            }
            return curr;
          });

          if (newStatus === 'READY') {
            playAlertChime('ready');
          }
        } else if (type === 'FEEDBACK_SUBMITTED') {
          setFeedbacks((prev) => [payload, ...prev]);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    return () => {
      if (channel) channel.close();
    };
  }, [menuItems]);

  // Load Menu and Shared Orders on mount
  useEffect(() => {
    const init = async () => {
      // 1. Load Menu
      try {
        const data = await api.getMenu();
        if (data && data.length > 0) setMenuItems(data);
      } catch {}

      // 2. Load tab-specific user from sessionStorage, with fallback to localStorage
      const sessionUser = sessionStorage.getItem('smartcanteen_user');
      const localUser = localStorage.getItem('smartcanteen_user');
      const savedUserStr = sessionUser || localUser;

      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);
          if (parsed.role === 'ROLE_ADMIN') {
            setActiveView('admin');
          }
        } catch (e) {}
      }

      // 3. Load Shared Orders across tabs
      const savedOrdersStr = localStorage.getItem('smartcanteen_shared_orders');
      if (savedOrdersStr) {
        try {
          const parsedOrders = JSON.parse(savedOrdersStr);
          setOrders(parsedOrders);
          recalculateKpis(parsedOrders);
        } catch (e) {}
      }
    };

    init();
  }, []);

  // Poll Admin Data from Backend (if backend is running)
  const loadAdminData = async () => {
    try {
      const [kpiData, orderData, feedbackData] = await Promise.all([
        api.getDashboardKpis().catch(() => null),
        api.getAllAdminOrders().catch(() => []),
        api.getAllFeedbacks().catch(() => []),
      ]);

      if (orderData && orderData.length > 0) {
        setOrders(orderData);
        localStorage.setItem('smartcanteen_shared_orders', JSON.stringify(orderData));
        recalculateKpis(orderData);
      }
      if (kpiData) setKpis(kpiData);
      if (feedbackData) setFeedbacks(feedbackData);
    } catch {}
  };

  useEffect(() => {
    if (user && user.role === 'ROLE_ADMIN') {
      loadAdminData();
      const interval = setInterval(loadAdminData, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Auth Handlers - Uses sessionStorage so Tab 1 (Student) & Tab 2 (Admin) can coexist!
  const handleLogin = async (email, password) => {
    try {
      const res = await api.login(email, password);
      sessionStorage.setItem('smartcanteen_jwt', res.token);
      sessionStorage.setItem('smartcanteen_user', JSON.stringify(res));
      localStorage.setItem('smartcanteen_jwt', res.token);
      setUser(res);
      if (res.role === 'ROLE_ADMIN') setActiveView('admin');
      else setActiveView('student');
      return res;
    } catch {
      // Mock login for offline / multi-tab demonstration
      const isAdm = email.includes('admin');
      const mock = {
        name: isAdm ? 'Head Chef' : 'Demo Student',
        email,
        role: isAdm ? 'ROLE_ADMIN' : 'ROLE_STUDENT',
        walletBalance: 350.0,
      };
      sessionStorage.setItem('smartcanteen_user', JSON.stringify(mock));
      setUser(mock);
      if (mock.role === 'ROLE_ADMIN') setActiveView('admin');
      else setActiveView('student');
      return mock;
    }
  };

  const handleRegister = async (name, email, password, role) => {
    try {
      const res = await api.register(name, email, password, role);
      sessionStorage.setItem('smartcanteen_jwt', res.token);
      sessionStorage.setItem('smartcanteen_user', JSON.stringify(res));
      setUser(res);
      if (res.role === 'ROLE_ADMIN') setActiveView('admin');
      else setActiveView('student');
      return res;
    } catch {
      const mock = { name, email, role, walletBalance: 300.0 };
      sessionStorage.setItem('smartcanteen_user', JSON.stringify(mock));
      setUser(mock);
      if (mock.role === 'ROLE_ADMIN') setActiveView('admin');
      else setActiveView('student');
      return mock;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('smartcanteen_jwt');
    sessionStorage.removeItem('smartcanteen_user');
    setUser(null);
    setActiveView('student');
  };

  // Cart Handlers
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) {
        return prev.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    playAlertChime('success');
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((c) => c.id !== itemId));
    } else {
      setCart((prev) => prev.map((c) => (c.id === itemId ? { ...c, quantity: newQty } : c)));
    }
  };

  // Order Placement (Student Tab)
  const handleCheckoutSuccess = async (orderPayload) => {
    let createdOrder = null;
    try {
      createdOrder = await api.placeOrder(orderPayload);
    } catch {
      // Offline fallback
      const randToken = '#T-' + Math.floor(100 + Math.random() * 900);
      const randOrderNum = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
      const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

      createdOrder = {
        id: Date.now(),
        orderNumber: randOrderNum,
        pickupToken: randToken,
        pickupSlot: orderPayload.pickupSlot,
        status: 'PENDING',
        totalAmount: total,
        user: user || { name: 'Arjun Sharma' },
        items: cart.map((i) => ({ menuItem: i, quantity: i.quantity, price: i.price })),
        specialInstructions: orderPayload.specialInstructions,
      };

      if (user) {
        const updated = { ...user, walletBalance: Math.max(0, user.walletBalance - total) };
        setUser(updated);
        sessionStorage.setItem('smartcanteen_user', JSON.stringify(updated));
      }
    }

    // Save order locally and in localStorage
    setOrders((prev) => {
      const next = [createdOrder, ...prev];
      localStorage.setItem('smartcanteen_shared_orders', JSON.stringify(next));
      recalculateKpis(next);
      return next;
    });

    setActiveTrackerOrder(createdOrder);
    setCart([]);
    setIsTrackerOpen(true);
    playAlertChime('success');

    // ⚡ BROADCAST TO ADMIN TAB IMMEDIATELY!
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'NEW_ORDER',
        payload: createdOrder,
      });
    }
  };

  // Status Progression (Admin Tab Action)
  const updateOrderState = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
    } catch {}

    // Update state locally and in shared localStorage
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      localStorage.setItem('smartcanteen_shared_orders', JSON.stringify(next));
      recalculateKpis(next);
      return next;
    });

    setActiveTrackerOrder((curr) =>
      curr && curr.id === orderId ? { ...curr, status: newStatus } : curr
    );

    // ⚡ BROADCAST TO STUDENT TAB IMMEDIATELY!
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'STATUS_UPDATED',
        payload: { orderId, newStatus },
      });
    }

    if (newStatus === 'READY') {
      playAlertChime('ready');
    }
  };

  // Menu Management for Admin
  const handleToggleMenu = async (id) => {
    try {
      await api.toggleMenuAvailability(id);
    } catch {}
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  const handleDeleteMenu = async (id) => {
    try {
      await api.deleteMenuItem(id);
    } catch {}
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddMenu = async (item) => {
    let saved = null;
    try {
      saved = await api.addMenuItem(item);
    } catch {
      saved = { ...item, id: Date.now() };
    }
    setMenuItems((prev) => [...prev, saved]);
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      await api.submitFeedback(feedbackData);
    } catch {}
    const fbItem = {
      ...feedbackData,
      user: user || { name: 'Student' },
      order: feedbackOrder,
    };
    setFeedbacks((prev) => [fbItem, ...prev]);

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'FEEDBACK_SUBMITTED',
        payload: fbItem,
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenTracker={() => {
          if (orders.length > 0) {
            setActiveTrackerOrder(orders[0]);
            setIsTrackerOpen(true);
          } else {
            alert('No active pre-orders placed yet. Add dishes to cart and place an order first!');
          }
        }}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeView === 'student' ? (
          <MenuSection
            menuItems={menuItems}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        ) : (
          <AdminDashboard
            kpis={kpis}
            orders={orders}
            menuItems={menuItems}
            feedbacks={feedbacks}
            onUpdateStatus={updateOrderState}
            onToggleMenu={handleToggleMenu}
            onDeleteMenu={handleDeleteMenu}
            onAddMenu={handleAddMenu}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        user={user}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={() => setCart([])}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        activeOrder={activeTrackerOrder}
        onOpenFeedback={(ord) => {
          setIsTrackerOpen(false);
          setFeedbackOrder(ord);
        }}
      />

      {/* Rating & Review Feedback Modal */}
      <FeedbackModal
        isOpen={!!feedbackOrder}
        onClose={() => setFeedbackOrder(null)}
        order={feedbackOrder}
        onSubmitFeedback={handleSubmitFeedback}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}
