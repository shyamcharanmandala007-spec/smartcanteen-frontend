import React, { useState } from 'react';
import { ChefHat, CheckCircle2, Clock, AlertCircle, DollarSign, Plus, ToggleLeft, ToggleRight, Trash2, Star, Shield } from 'lucide-react';

export default function AdminDashboard({ kpis, orders, menuItems, feedbacks, onUpdateStatus, onToggleMenu, onDeleteMenu, onAddMenu }) {
  const [activeTab, setActiveTab] = useState('kds'); // 'kds', 'menu', 'feedback'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Lunch',
    price: '',
    description: '',
    isVeg: true,
    preparationTimeMinutes: 10,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await onAddMenu({
      ...newItem,
      price: parseFloat(newItem.price),
      preparationTimeMinutes: parseInt(newItem.preparationTimeMinutes),
      isAvailable: true,
    });
    setShowAddModal(false);
    setNewItem({
      name: '',
      category: 'Lunch',
      price: '',
      description: '',
      isVeg: true,
      preparationTimeMinutes: 10,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    });
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto', padding: '0 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Shield size={16} /> Canteen Management & Kitchen Display
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
            Kitchen Command Center
          </h1>
        </div>

        {/* Admin Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('kds')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: activeTab === 'kds' ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
            }}
          >
            🍳 Kitchen Orders ({orders.filter((o) => o.status !== 'COMPLETED').length})
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: activeTab === 'menu' ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
            }}
          >
            🍱 Food Menu CRUD ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: activeTab === 'feedback' ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
            }}
          >
            ⭐ Reviews & Feedback ({feedbacks.length})
          </button>
        </div>
      </div>

      {/* KPI Cards Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Pending Acceptance</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{kpis.pendingOrders || 0}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb923c' }}>
            <ChefHat size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Cooking in Kitchen</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{kpis.cookingOrders || 0}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Ready for Pickup</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{kpis.readyOrders || 0}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Total Revenue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>₹{kpis.totalRevenue?.toFixed(2) || '0.00'}</div>
          </div>
        </div>
      </div>

      {/* TAB 1: KITCHEN DISPLAY SYSTEM */}
      {activeTab === 'kds' && (
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Live Kitchen Queue (Orders Ordered by Time)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {orders.map((order) => (
              <div key={order.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 800,
                    color: '#f97316',
                  }}>
                    {order.pickupToken}
                  </div>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '12px' }}>
                  Student: <strong style={{ color: '#fff' }}>{order.user?.name || 'Student'}</strong> • Slot: {order.pickupSlot}
                </div>

                {/* Items */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  flex: 1,
                }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#e5e7eb', marginBottom: '4px' }}>
                      <span>{item.quantity}x {item.menuItem?.name || 'Dish'}</span>
                      <span style={{ color: '#9ca3af' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.specialInstructions && (
                    <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '6px', fontStyle: 'italic' }}>
                      Note: "{order.specialInstructions}"
                    </div>
                  )}
                </div>

                {/* 1-Click Status Lifecycle Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => onUpdateStatus(order.id, 'CONFIRMED')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        background: '#3b82f6',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      ✓ Accept Order
                    </button>
                  )}

                  {order.status === 'CONFIRMED' && (
                    <button
                      onClick={() => onUpdateStatus(order.id, 'PREPARING')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        background: '#f97316',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      🔥 Start Cooking
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => onUpdateStatus(order.id, 'READY')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        background: '#10b981',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      🔔 Mark Ready (Ring Chime)
                    </button>
                  )}

                  {order.status === 'READY' && (
                    <button
                      onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        background: '#6b7280',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      ✓ Handover & Complete
                    </button>
                  )}

                  {order.status === 'COMPLETED' && (
                    <div style={{ textAlign: 'center', width: '100%', fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                      ✓ Order Completed & Picked Up
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MENU CRUD */}
      {activeTab === 'menu' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Manage Food Menu Items
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: '#3b82f6',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} /> Add New Dish
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {menuItems.map((item) => (
              <div key={item.id} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{item.category} • ₹{item.price?.toFixed(2)}</span>
                  </div>
                  <span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <button
                    onClick={() => onToggleMenu(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      color: item.isAvailable ? '#10b981' : '#ef4444',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    {item.isAvailable ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    {item.isAvailable ? 'In Stock' : 'Sold Out'}
                  </button>

                  <button
                    onClick={() => onDeleteMenu(item.id)}
                    style={{ background: 'none', color: '#ef4444', padding: '4px' }}
                    title="Delete dish"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FEEDBACK WALL */}
      {activeTab === 'feedback' && (
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Student Reviews & Canteen Feedback Wall
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {feedbacks.length === 0 ? (
              <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>No student feedback submitted yet.</div>
            ) : (
              feedbacks.map((fb, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{fb.user?.name || 'Student'}</div>
                    <div style={{ display: 'flex', color: '#f59e0b' }}>
                      {[...Array(fb.rating || 5)].map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#d1d5db', fontStyle: 'italic' }}>
                    "{fb.comment || 'Great experience and timely food!'}"
                  </p>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '8px' }}>
                    Order: {fb.order?.pickupToken || '#T-100'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '16px',
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', background: '#111827', padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>Add Dish to Menu</h3>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                required
                placeholder="Dish Name (e.g. Chole Bhature)"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
                <option value="Desserts">Desserts</option>
              </select>
              <input
                type="number"
                required
                placeholder="Price (₹)"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
              <input
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#fff' }}>
                  <input
                    type="checkbox"
                    checked={newItem.isVeg}
                    onChange={(e) => setNewItem({ ...newItem, isVeg: e.target.checked })}
                  />
                  Vegetarian
                </label>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, padding: '10px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', borderRadius: '8px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', background: '#3b82f6', color: '#fff', fontWeight: 700, borderRadius: '8px' }}
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
