import React from 'react';
import { ShoppingBag, UtensilsCrossed, Shield, User as UserIcon, LogOut, Wallet } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onLogout, cartCount, onOpenCart, activeView, setActiveView, onOpenTracker }) {
  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: '16px',
      zIndex: 50,
      margin: '0 20px',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      {/* Brand */}
      <div 
        onClick={() => setActiveView('student')} 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
      >
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(249, 115, 22, 0.4)',
        }}>
          <UtensilsCrossed size={22} color="#fff" />
        </div>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            Smart<span style={{ color: '#f97316' }}>Canteen</span>
          </span>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Pre-Order & Queue System
          </div>
        </div>
      </div>

      {/* Navigation Links / View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => setActiveView('student')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: activeView === 'student' ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
            color: activeView === 'student' ? '#f97316' : '#9ca3af',
            border: activeView === 'student' ? '1px solid rgba(249, 115, 22, 0.4)' : '1px solid transparent',
          }}
        >
          👨‍🎓 Food Menu
        </button>

        {user && user.role === 'ROLE_ADMIN' && (
          <button
            onClick={() => setActiveView('admin')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              background: activeView === 'admin' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              color: activeView === 'admin' ? '#60a5fa' : '#9ca3af',
              border: activeView === 'admin' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Shield size={16} /> Kitchen KDS & Admin
          </button>
        )}

        <button
          onClick={onOpenTracker}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#d1d5db',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          ⏱️ Track Live Token
        </button>
      </div>

      {/* User Info & Cart Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {user ? (
          <>
            {/* Wallet pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '6px 14px',
              borderRadius: '9999px',
              color: '#34d399',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}>
              <Wallet size={16} />
              <span>₹{user.walletBalance?.toFixed(2) || '300.00'}</span>
            </div>

            {/* Profile chip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: user.role === 'ROLE_ADMIN' ? '#3b82f6' : '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f3f4f6' }}>
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={onLogout}
                title="Logout"
                style={{ background: 'none', color: '#9ca3af', padding: '2px', display: 'flex' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.875rem',
              boxShadow: '0 0 15px rgba(249, 115, 22, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <UserIcon size={16} /> Login / Register
          </button>
        )}

        {/* Cart Button */}
        <button
          onClick={onOpenCart}
          style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#fff',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#f97316',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #0b0f19',
              boxShadow: '0 0 8px rgba(249, 115, 22, 0.5)',
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
