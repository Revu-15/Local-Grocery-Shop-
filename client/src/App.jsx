import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ReceiptModal from './components/ReceiptModal';
import OrderHistory from './components/OrderHistory';
import AdminDashboard from './components/AdminDashboard';
import AdminInventory from './components/AdminInventory';
import AdminOrders from './components/AdminOrders';
import { fetchProducts, createOrder } from './utils/api';

export default function App() {
  const [role, setRole] = useState('customer'); // 'customer' or 'admin'
  const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'my-orders', 'dashboard', 'inventory', 'orders'

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

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts({
        category: selectedCategory,
        search: searchQuery,
        low_stock: showLowStockOnly
      });
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
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
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {role === 'customer' ? (
          activeTab === 'shop' ? (
            <ProductGrid
              products={products}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showLowStockOnly={showLowStockOnly}
              setShowLowStockOnly={setShowLowStockOnly}
              cartItems={cartItems}
              addToCart={addToCart}
              updateQuantity={updateQuantity}
            />
          ) : (
            <OrderHistory onSelectReceipt={(ord) => setReceiptOrder(ord)} />
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
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
}
