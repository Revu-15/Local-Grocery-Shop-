import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ReceiptModal from './components/ReceiptModal';
import OrderHistory from './components/OrderHistory';
import AdminDashboard from './components/AdminDashboard';
import AdminInventory from './components/AdminInventory';
import UserAuthModal from './components/UserAuthModal';
import AdminAuthModal from './components/AdminAuthModal';
import { fetchProducts, createOrder } from './utils/api';

export default function App() {
  const [role, setRole] = useState('customer'); // 'customer' or 'admin'
  const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'my-orders', 'dashboard', 'inventory', 'orders'

  // Admin PIN Protection State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);

  const handleRequestAdminAccess = () => {
    if (isAdminAuthenticated) {
      setRole('admin');
      setActiveTab('dashboard');
    } else {
      setIsAdminPinModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminPinModalOpen(false);
    setRole('admin');
    setActiveTab('dashboard');
  };

  // Keyboard Shortcut: Ctrl + Shift + A to open Admin PIN prompt
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleRequestAdminAccess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated]);

  // Logged-in Customer Profile State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lgs_user');
      return saved ? JSON.parse(saved) : {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        phone: '9876543210',
        address: '100 Feet Road, Indiranagar, Bengaluru'
      };
    } catch {
      return {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        phone: '9876543210',
        address: '100 Feet Road, Indiranagar, Bengaluru'
      };
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSignOut = () => {
    const freshUser = {
      id: 'USER-' + Date.now().toString().slice(-6),
      name: 'Guest Customer',
      email: '',
      phone: '',
      address: ''
    };
    setUser(freshUser);
    try {
      localStorage.removeItem('lgs_user');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveUser = (updatedUser) => {
    setUser(updatedUser);
    try {
      localStorage.setItem('lgs_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Order State
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('lgs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState(null);

  // Sync Cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lgs_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Load catalog products whenever filters change
  useEffect(() => {
    if (activeTab === 'shop') {
      loadProducts();
    }
  }, [selectedCategory, showLowStockOnly, searchQuery, activeTab]);

  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts({
        category: selectedCategory,
        search: searchQuery,
        low_stock: showLowStockOnly
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Unable to connect to the backend server. The server may be starting up. Please click retry below.');
    } finally {
      setLoading(false);
    }
  };

  // Cart Handlers
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock_quantity, item.quantity + 1) }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(item.product.stock_quantity, newQty) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Order Placement
  const handleOrderSuccess = async (orderPayload) => {
    const createdOrder = await createOrder(orderPayload);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setReceiptOrder(createdOrder);
    loadProducts();
    return createdOrder;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f6f8fa' }}>
      {/* Sticky Header */}
      <Navbar
        role={role}
        setRole={setRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        setIsCartOpen={setIsCartOpen}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onRequestAdminAccess={handleRequestAdminAccess}
        isAdminAuthenticated={isAdminAuthenticated}
        onLockAdmin={() => {
          setIsAdminAuthenticated(false);
          setRole('customer');
          setActiveTab('shop');
        }}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {role === 'customer' ? (
          activeTab === 'shop' ? (
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              onRetry={loadProducts}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showLowStockOnly={showLowStockOnly}
              setShowLowStockOnly={setShowLowStockOnly}
              cartItems={cartItems}
              addToCart={addToCart}
              updateQuantity={updateQuantity}
            />
          ) : (
            <OrderHistory onSelectReceipt={(ord) => setReceiptOrder(ord)} user={user} />
          )
        ) : (
          activeTab === 'dashboard' ? (
            <AdminDashboard onNavigateToInventory={() => setActiveTab('inventory')} />
          ) : activeTab === 'inventory' ? (
            <AdminInventory searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          ) : (
            <AdminOrders onSelectReceipt={(ord) => setReceiptOrder(ord)} searchQuery={searchQuery} />
          )
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
        user={user}
      />

      {/* User Login & Profile Modal */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onSaveUser={handleSaveUser}
        onSignOut={handleSignOut}
      />

      {/* Admin Password Authentication Modal */}
      <AdminAuthModal
        isOpen={isAdminPinModalOpen}
        onClose={() => setIsAdminPinModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
}
