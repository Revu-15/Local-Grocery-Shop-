const API_BASE = import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://grocery-shop-backend-2q5y.onrender.com/api');

export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.low_stock) params.append('low_stock', 'true');

  const res = await fetch(`${API_BASE}/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
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
