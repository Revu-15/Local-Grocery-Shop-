const getApiBase = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }
  return 'https://grocery-shop-backend-2q5y.onrender.com/api';
};

export const API_BASE = getApiBase();

export const fetchProducts = async (filters = {}, retries = 2) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.low_stock) params.append('low_stock', 'true');

  const url = `${API_BASE}/products?${params.toString()}`;
  console.log(`🛒 [API] Fetching products from: ${url}`);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[API] Fetch attempt ${attempt + 1} failed:`, err);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 2000)); // wait 2s for Render cold start
    }
  }
};

export const createProduct = async (productData) => {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create product');
  }
  return res.json();
};

export const updateProduct = async (id, productData) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
};

export const createOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || err.details?.join(', ') || 'Failed to place order');
  }
  return res.json();
};

export const fetchOrders = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'All') params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);
  if (filters.user_id) params.append('user_id', filters.user_id);
  if (filters.phone) params.append('phone', filters.phone);

  const res = await fetch(`${API_BASE}/orders?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${API_BASE}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return res.json();
};

export const updateOrderPaymentStatus = async (id, payment_status) => {
  const res = await fetch(`${API_BASE}/orders/${id}/payment-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status })
  });
  if (!res.ok) throw new Error('Failed to update payment status');
  return res.json();
};

export const fetchSalesReport = async () => {
  const res = await fetch(`${API_BASE}/reports/daily-sales`);
  if (!res.ok) throw new Error('Failed to fetch sales report');
  return res.json();
};

export const resetSeedData = async () => {
  const res = await fetch(`${API_BASE}/reset-seed`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset seed data');
  return res.json();
};
