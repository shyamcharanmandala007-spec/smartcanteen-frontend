import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await onRegister(name, email, password, role);
      } else {
        await onLogin(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoStudent = () => {
    setEmail('student@campus.edu');
    setPassword('student123');
    setIsRegister(false);
    setError('');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@canteen.edu');
    setPassword('admin123');
    setIsRegister(false);
    setError('');
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
      zIndex: 100,
      padding: '16px',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        background: '#111827',
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

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '20px' }}>
          {isRegister
            ? 'Sign up to pre-order food and skip canteen queues'
            : 'Login with your credentials or 1-click test accounts'}
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        {/* 1-Click Test Login Buttons */}
        {!isRegister && (
          <div style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={fillDemoStudent}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(249, 115, 22, 0.12)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                color: '#f97316',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              👨‍🎓 Demo Student
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              👨‍🍳 Demo Admin
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister && (
            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="email"
                required
                placeholder="name@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#6b7280" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="ROLE_STUDENT">Student (Pre-Order Food)</option>
                <option value="ROLE_ADMIN">Canteen Staff / Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#9ca3af' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            style={{
              background: 'none',
              color: '#f97316',
              fontWeight: 700,
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            {isRegister ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
