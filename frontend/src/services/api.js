const BASE_URL = 'http://localhost:8080/api';

// Helper for authenticated fetch requests
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('smartcanteen_jwt');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] Error on ${endpoint}:`, err.message);
    throw err;
  }
};

export const api = {
  // Auth
  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name, email, password, role = 'ROLE_STUDENT') => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  getCurrentUser: async () => {
    return request('/auth/me');
  },

  // Menu
  getMenu: async (category = '') => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return request(`/menu${query}`);
  },

  // Orders
  placeOrder: async (orderData) => {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async () => {
    return request('/orders/my-orders');
  },

  getOrderById: async (id) => {
    return request(`/orders/${id}`);
  },

  // Admin
  getDashboardKpis: async () => {
    return request('/admin/dashboard');
  },

  getAllAdminOrders: async () => {
    return request('/admin/orders');
  },

  updateOrderStatus: async (orderId, status) => {
    return request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  addMenuItem: async (item) => {
    return request('/admin/menu', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  toggleMenuAvailability: async (id) => {
    return request(`/admin/menu/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  deleteMenuItem: async (id) => {
    return request(`/admin/menu/${id}`, {
      method: 'DELETE',
    });
  },

  // Feedback
  submitFeedback: async (feedbackData) => {
    return request('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },

  getAllFeedbacks: async () => {
    return request('/feedback');
  },
};
