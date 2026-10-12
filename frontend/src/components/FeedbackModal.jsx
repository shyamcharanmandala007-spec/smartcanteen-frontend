import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose, order, onSubmitFeedback }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmitFeedback({
        orderId: order.id,
        rating,
        comment,
      });
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '16px',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        background: '#111827',
        padding: '30px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
      }}>
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

        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
          How was your meal?
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '20px' }}>
          Rate your order <strong style={{ color: '#f97316' }}>{order.orderNumber}</strong> ({order.pickupToken})
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Star selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '10px 0' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  background: 'none',
                  padding: '4px',
                  color: star <= rating ? '#f59e0b' : '#4b5563',
                  transform: star <= rating ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.15s',
                }}
              >
                <Star size={32} fill={star <= rating ? '#f59e0b' : 'none'} />
              </button>
            ))}
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
              Your Comments
            </label>
            <textarea
              rows={3}
              placeholder="Food was fresh and ready on time! Loved the chutney..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Send size={16} /> {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
