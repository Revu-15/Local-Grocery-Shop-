# FreshBasket - Local Grocery Shop Web Application 🛒

A full-stack web application built for a **Local Grocery Shop** to manage inventory, stock alerts, customer orders, real-time stock deduction, billing receipts, and store analytics in **Indian Rupees (₹)**.

- 🔗 **GitHub Repository**: [https://github.com/Revu-15/Local-Grocery-Shop-](https://github.com/Revu-15/Local-Grocery-Shop-)
- 🌐 **Live Web Application**: [https://local-grocery-shop.vercel.app](https://local-grocery-shop.vercel.app)
- ⚙️ **Live Backend API**: [https://grocery-shop-backend-2q5y.onrender.com](https://grocery-shop-backend-2q5y.onrender.com)

---

## 👥 User Roles & Features

### 🛒 Customer Experience
- **Sign In & Sign Up Account System**: Customer registration with Username, Email, Phone Number, Password, and Address.
- **120 Unique Grocery Items**: Browse 120 distinct items across 6 categories (*Produce, Dairy & Eggs, Bakery, Beverages, Snacks & Staples, Meats & Seafood*).
- **Indian Rupee (₹) Pricing**: Realistic Indian grocery pricing (e.g. Honeycrisp Apples ₹180/kg, Amul Butter ₹275, Sona Masoori Rice ₹340/5kg).
- **Category Browsing & Live Search**: Filter products by category or search bar in real time.
- **Cart & Real-time Stock Deduction**: Interactive Cart Drawer with live quantity counters. Stock is deducted automatically upon order placement.
- **Flexible Order Fulfillment**: Choose between **Cash on Delivery (COD)** or **In-Store Pickup Counter**. Auto-fills details from logged-in profile.
- **Private Order History**: Customers see ONLY their own placed orders under "My Orders".
- **Printable GST Invoice Receipt**: Downloadable/printable GST Tax invoice receipt with **GSTIN (29AABCU9603R1ZM)**.

### 🔑 Admin & Store Owner Experience (PIN Password Protected: `1234`)
- **Restricted Admin Access**: Admin Dashboard and inventory controls are password protected (`Default PIN: 1234`).
- **Inventory Management**: Add, edit, or delete items, set custom low-stock thresholds, and use quick restock controls (`+5 Restock` / `-1`).
- **Customer Orders Management**: View orders across all login IDs, filter by status (*Pending, Processing, Completed, Cancelled*), and update status in real time.
- **Sales Analytics Dashboard**: Real-time sales summary reporting total revenue in **₹**, total orders completed, low stock alerts, top-selling items, and category distribution charts.

---

## 🛠️ Tech Stack

- **Backend**: Node.js (Express ES Modules)
- **Database**: SQLite (`sqlite3` with promise wrappers and atomic transactions)
- **Frontend**: React 18 (Vite) + Lucide Icons + Custom CSS Design System (Glassmorphism, Animations)
- **Billing**: Responsive Printable Receipt View (`@media print` support)

---

## 🚀 How to Run Locally

### 1. Start Backend API
```powershell
cd server
npm install
node index.js
```
*Server runs at `http://localhost:5000`*

### 2. Start Frontend App
```powershell
cd client
npm install
npm run dev
```
*App runs at `http://localhost:5173`*

### 3. Run Automated End-to-End Test Suite
```powershell
cd server
node test-flow.js
```
