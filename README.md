# FreshBasket - Local Grocery Shop Web Application 🛒

A full-stack web application built for a **Local Grocery Shop** to manage inventory, stock alerts, customer orders, real-time stock deduction, billing receipts, and store analytics.

**GitHub Repository**: [https://github.com/Revu-15/Local-Grocery-Shop-](https://github.com/Revu-15/Local-Grocery-Shop-)

---

## 🌟 Features & Highlights

### 🛒 Customer Experience
- **Category Browsing & Live Search**: Browse grocery items by categories (*Produce, Dairy & Eggs, Bakery, Beverages, Snacks & Staples*) with live search filtering.
- **Stock Badges & Availability**: Real-time visual stock indicators (Green = In Stock, Yellow = Low Stock Warning, Red = Out of Stock).
- **Slide-Over Cart Drawer**: Adjust item quantities, view real-time subtotal, tax (5%), and order total.
- **Flexible Order Checkout**: Choose between **Cash on Delivery (COD)** or **In-Store Pickup Counter**.
- **Printable Billing Receipt**: Thermal/invoice style receipt modal featuring store branding, order #, timestamp, breakdown, subtotal, tax, total, and direct print trigger (`window.print()`).
- **My Order History**: Track past order statuses and reprint receipts anytime.

### 👑 Admin & Store Owner Experience
- **Sales Analytics Dashboard**: Daily revenue ($), total orders count, low-stock alerts, out-of-stock count, top-selling items breakdown, and category sales distribution.
- **Inventory Management**:
  - Add/Edit/Delete grocery items.
  - Set custom low-stock warning thresholds.
  - **Quick Stock Restock Buttons**: `+5 Restock` and `-1 Deduct` inline controls.
  - Low-stock filter view for fast store replenishment.
- **Customer Orders Pipeline**: Real-time pipeline to update order status (*Pending ➔ Processing ➔ Completed ➔ Cancelled* with automatic stock restoration on cancellation).
- **Reset Seed Data Button**: One-click restore to reset the database back to clean initial demo items.

---

## 🛠️ Tech Stack

- **Backend**: Node.js (Express ES Modules)
- **Database**: SQLite (`sqlite3` with promise wrappers and atomic transactions)
- **Frontend**: React 18 (Vite) + Lucide Icons + Custom CSS Design System (Glassmorphism, CSS Variables, Animations)
- **Billing**: Responsive Printable Receipt View (`@media print` support)

---

## 📁 Project Structure

```text
Local Grocery Shop/
├── server/                      # Express REST API & SQLite DB
│   ├── index.js                 # API Endpoints & Server entrypoint
│   ├── db.js                    # SQLite Schema initialization & query helpers
│   ├── seedData.js              # Initial 20 realistic grocery items with high-res images
│   ├── test-flow.js             # End-to-end automated API verification test suite
│   ├── grocery.db               # SQLite database file (auto-created on startup)
│   └── package.json             # Server dependencies (express, cors, sqlite3)
├── client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx              # Main App layout, state & role manager
│   │   ├── index.css            # Global design system & print styles
│   │   ├── main.jsx             # React entrypoint
│   │   ├── utils/api.js         # API client functions
│   │   └── components/
│   │       ├── Navbar.jsx       # Header with search & Customer/Admin role toggle
│   │       ├── ProductCard.jsx  # Item card with stock badges & cart buttons
│   │       ├── ProductGrid.jsx  # Catalog grid with category filter pills
│   │       ├── CartDrawer.jsx   # Slide-over cart summary
│   │       ├── CheckoutModal.jsx# Fulfillment form (COD / Pickup)
│   │       ├── ReceiptModal.jsx # Printable receipt modal
│   │       ├── OrderHistory.jsx # Customer order tracking
│   │       ├── AdminDashboard.jsx# Sales KPI metrics & analytics
│   │       ├── AdminInventory.jsx# Inventory CRUD table & quick restock
│   │       ├── AdminOrders.jsx   # Customer order pipeline & status updater
│   │       └── ProductModal.jsx  # Add/Edit product modal form
│   ├── index.html
│   ├── vite.config.js
│   └── package.json             # Client dependencies (react, lucide-react, vite)
└── README.md                    # Setup and usage documentation
```

---

## 🚀 Quick Setup & Local Execution

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

### 2. Backend Setup & Run
```bash
# Navigate to server directory
cd server

# Install dependencies (Express, CORS, SQLite3)
npm install

# Start Express server (runs on http://localhost:5000)
npm start
```
*Note: The database (`grocery.db`) initializes automatically on first run and seeds 20 realistic grocery items across 5 categories.*

### 3. Frontend Setup & Run
Open a new terminal window:
```bash
# Navigate to client directory
cd client

# Install dependencies (React, Vite, Lucide-React)
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

Now open **`http://localhost:5173`** in your browser!

---

## 🧪 Automated Testing

To run the automated end-to-end API test suite (which tests stock management, checkout, stock deduction, status updating, and analytics):

```bash
cd server
node test-flow.js
```

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Query products (supports `category`, `search`, `low_stock`) |
| `POST` | `/api/products` | Create new grocery item |
| `PUT` | `/api/products/:id` | Update product details or stock quantity |
| `DELETE` | `/api/products/:id` | Remove item from inventory |
| `POST` | `/api/orders` | Checkout order, validate stock, & deduct stock atomically |
| `GET` | `/api/orders` | Fetch orders (supports `status` & `search`) |
| `PATCH` | `/api/orders/:id/status` | Update order status (`Pending`, `Processing`, `Completed`, `Cancelled`) |
| `GET` | `/api/reports/daily-sales` | Fetch daily sales summary, revenue, and top-selling items |
| `POST` | `/api/reset-seed` | Reset database and re-seed clean initial grocery items |
