import React, { useState } from 'react';
import { Search, Clock, Plus, Minus, CheckCircle, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages', 'Desserts'];

export default function MenuSection({ menuItems, cart, onAddToCart, onUpdateQuantity }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [dietFilter, setDietFilter] = useState('ALL'); // ALL, VEG, NONVEG
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter((item) => {
    const matchCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchDiet =
      dietFilter === 'ALL' ||
      (dietFilter === 'VEG' && item.isVeg) ||
      (dietFilter === 'NONVEG' && !item.isVeg);
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchDiet && matchSearch;
  });

  const getItemQuantity = (itemId) => {
    const found = cart.find((c) => c.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <section style={{ maxWidth: '1280px', margin: '30px auto', padding: '0 20px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(249, 115, 22, 0.1)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          padding: '6px 16px',
          borderRadius: '9999px',
          color: '#f97316',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '12px',
        }}>
          <Sparkles size={16} /> Campus Smart Food Delivery & Pickup
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          Skip The Line. Pre-Order Delicious Bites.
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Select your favorite meal, choose your pickup time slot, and collect your food right when it's hot!
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: activeCategory === cat ? '#f97316' : 'rgba(255, 255, 255, 0.05)',
                color: activeCategory === cat ? '#fff' : '#9ca3af',
                boxShadow: activeCategory === cat ? '0 0 12px rgba(249, 115, 22, 0.4)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Diet Toggles & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Diet Buttons */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '3px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <button
              onClick={() => setDietFilter('ALL')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: dietFilter === 'ALL' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: '#fff',
              }}
            >
              All
            </button>
            <button
              onClick={() => setDietFilter('VEG')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: dietFilter === 'VEG' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                color: '#34d399',
              }}
            >
              🟢 Veg
            </button>
            <button
              onClick={() => setDietFilter('NONVEG')}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: dietFilter === 'NONVEG' ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                color: '#f87171',
              }}
            >
              🔴 Non-Veg
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', width: '200px' }}
            />
          </div>
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
      }}>
        {filteredItems.map((item) => {
          const qty = getItemQuantity(item.id);
          const isAvailable = item.isAvailable !== false;

          return (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                opacity: isAvailable ? 1 : 0.6,
              }}
            >
              {/* Dish Image */}
              <div style={{ position: 'relative', height: '170px', width: '100%', overflow: 'hidden' }}>
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Dietary Badge */}
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className={`badge ${item.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                    {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                </div>

                {/* Prep time badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <Clock size={12} /> {item.preparationTimeMinutes || 10}m
                </div>

                {!isAvailable && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f87171',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    Sold Out
                  </div>
                )}
              </div>

              {/* Dish Details */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.75rem', color: '#f97316', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  {item.category}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                  {item.name}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#9ca3af',
                  marginBottom: '16px',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {item.description || 'Prepared fresh in the canteen kitchen with high-quality ingredients.'}
                </p>

                {/* Price and Add to Cart Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                      ₹{item.price?.toFixed(2)}
                    </span>
                  </div>

                  {isAvailable && (
                    qty === 0 ? (
                      <button
                        onClick={() => onAddToCart(item)}
                        style={{
                          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                          color: '#fff',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        <Plus size={16} /> Add to Cart
                      </button>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, qty - 1)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontWeight: 800, color: '#fff', minWidth: '18px', textAlign: 'center' }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, qty + 1)}
                          style={{
                            background: '#f97316',
                            color: '#fff',
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
