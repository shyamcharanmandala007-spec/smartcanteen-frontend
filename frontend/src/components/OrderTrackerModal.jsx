import React from 'react';
import { X, CheckCircle, Clock, ChefHat, Bell, Star } from 'lucide-react';

const STAGES = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock, desc: 'Waiting for kitchen acceptance' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, desc: 'Kitchen accepted your order' },
  { key: 'PREPARING', label: 'Cooking', icon: ChefHat, desc: 'Chef is preparing your meal' },
  { key: 'READY', label: 'Ready for Pickup', icon: Bell, desc: 'Collect food at Counter #2!' },
  { key: 'COMPLETED', label: 'Collected', icon: CheckCircle, desc: 'Order completed' },
];

export default function OrderTrackerModal({ isOpen, onClose, activeOrder, onOpenFeedback }) {
  if (!isOpen || !activeOrder) return null;

  const currentStageIndex = STAGES.findIndex((s) => s.key === activeOrder.status);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        background: '#111827',
        padding: '30px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
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

        {/* Token Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Official Pickup Token
          </div>
          <div style={{
            fontSize: '3rem',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 800,
            color: '#f97316',
            letterSpacing: '0.05em',
            margin: '4px 0',
            textShadow: '0 0 25px rgba(249, 115, 22, 0.4)',
          }}>
            {activeOrder.pickupToken || '#T-101'}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Order ID: <strong style={{ color: '#d1d5db' }}>{activeOrder.orderNumber}</strong> • Slot: {activeOrder.pickupSlot}
          </div>
        </div>

        {/* Status Stepper Progression */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const Icon = stage.icon;

              return (
                <div key={stage.key} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isCurrent
                      ? '#f97316'
                      : isPast
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: isCurrent ? '#fff' : isPast ? '#34d399' : '#6b7280',
                    border: isCurrent
                      ? '2px solid #ea580c'
                      : isPast
                      ? '1px solid #10b981'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isCurrent ? '0 0 15px rgba(249, 115, 22, 0.5)' : 'none',
                  }}>
                    <Icon size={18} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: isCurrent ? 800 : 600,
                      color: isCurrent ? '#fff' : isPast ? '#e5e7eb' : '#6b7280',
                      fontSize: '0.9rem',
                    }}>
                      {stage.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isCurrent ? '#f97316' : '#9ca3af' }}>
                      {stage.desc}
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="badge badge-preparing">Active</span>
                  )}
                  {isPast && (
                    <span className="badge badge-completed">Done</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button: Feedback if completed */}
        {activeOrder.status === 'COMPLETED' ? (
          <button
            onClick={() => onOpenFeedback(activeOrder)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Star size={18} /> Give Feedback & Rating
          </button>
        ) : (
          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#9ca3af' }}>
            Show token <strong style={{ color: '#f97316' }}>{activeOrder.pickupToken}</strong> at Canteen Counter #2 when status turns Ready.
          </div>
        )}
      </div>
    </div>
  );
}
