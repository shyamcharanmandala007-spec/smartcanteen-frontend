import React, { useState } from 'react';
import { X, Trash2, Clock, MessageSquare, CreditCard, Wallet, QrCode, CheckCircle2 } from 'lucide-react';

const TIME_SLOTS = [
  'ASAP (~10-15m)',
  'In 30 mins',
  'Lunch Break (1:15 PM)',
  'Tea Break (4:30 PM)',
];

export default function CartDrawer({ isOpen, onClose, cart, user, onUpdateQuantity, onClearCart, onCheckoutSuccess }) {
  const [pickupSlot, setPickupSlot] = useState(TIME_SLOTS[0]);
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('WALLET');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setError('');

    if (paymentMethod === 'WALLET' && user && user.walletBalance < subtotal) {
      setError(`Insufficient wallet balance (₹${user.walletBalance.toFixed(2)}). Please choose UPI or Card.`);
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cart.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
        pickupSlot,
        specialInstructions: instructions,
        paymentMethod,
      };

      await onCheckoutSuccess(orderPayload);
      onClose();
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 100,
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '460px',
        height: '100%',
        background: '#111827',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Your Pre-Order Cart</h2>
            <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{cart.length} item(s) selected</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#9ca3af',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
            }}>
              {error}
            </div>
          )}

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛒</div>
              <h3 style={{ fontSize: '1.1rem', color: '#9ca3af', fontWeight: 700 }}>Your cart is empty</h3>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Add some tasty dishes from the menu to get started!</p>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#f97316' }}>
                        ₹{item.price.toFixed(2)} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
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
                        -
                      </button>
                      <span style={{ fontWeight: 800, color: '#fff', minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
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
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pickup Time Slot */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d1d5db', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Clock size={16} color="#f97316" /> Select Pickup Time Slot
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPickupSlot(slot)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: pickupSlot === slot ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        color: pickupSlot === slot ? '#f97316' : '#9ca3af',
                        border: pickupSlot === slot ? '1px solid rgba(249, 115, 22, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                        textAlign: 'left',
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d1d5db', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <MessageSquare size={16} color="#f97316" /> Kitchen Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Extra spicy, no onions, keep sauce separate..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d1d5db', display: 'block', marginBottom: '8px' }}>
                  Payment Method
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WALLET')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: paymentMethod === 'WALLET' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: paymentMethod === 'WALLET' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                      color: paymentMethod === 'WALLET' ? '#34d399' : '#9ca3af',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Wallet size={18} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Campus Digital Wallet</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                          Balance: ₹{user ? user.walletBalance?.toFixed(2) : '300.00'}
                        </div>
                      </div>
                    </div>
                    {paymentMethod === 'WALLET' && <CheckCircle2 size={16} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: paymentMethod === 'UPI' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: paymentMethod === 'UPI' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                      color: paymentMethod === 'UPI' ? '#60a5fa' : '#9ca3af',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <QrCode size={18} />
                      <div style={{ textAlign: 'left', fontSize: '0.85rem', fontWeight: 700 }}>
                        UPI QR (GPay / PhonePe / Paytm)
                      </div>
                    </div>
                    {paymentMethod === 'UPI' && <CheckCircle2 size={16} />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer with Subtotal & Place Order */}
        {cart.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Total Amount</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Processing Order...' : 'Pay & Confirm Pre-Order ➔'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
