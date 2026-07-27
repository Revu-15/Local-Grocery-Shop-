# 🛒 FreshBasket - Local Grocery Shop Web Application

[![React](https://img.shields.io/badge/Frontend-React_18_(Vite)-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Express.js_ESM-339933?logo=nodedotjs)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-SQLite3-003B57?logo=sqlite)](https://sqlite.org/)
[![Deployment](https://img.shields.io/badge/Frontend_Deploy-Vercel-000000?logo=vercel)](https://local-grocery-shop-wheat.vercel.app)
[![Deployment](https://img.shields.io/badge/Backend_Deploy-Render-46E3B7?logo=render)](https://grocery-shop-backend-2q5y.onrender.com)

A full-stack, enterprise-grade **Local Grocery Shop Web Application** built with **React (Vite)**, **Node.js Express**, and **SQLite**. Features real-time inventory management, **PhonePe & UPI Bank Payment Verification**, **SMS & Email OTP Customer Verification**, real-time stock deduction, **Printable GST Invoice Receipts**, and **Store Analytics** in Indian Rupees (**₹**).

---

## 🌐 Live Web Application & Repository Links

- 🛒 **Live Customer Web Store (Primary)**: **[https://local-grocery-shop-wheat.vercel.app](https://local-grocery-shop-wheat.vercel.app)**
- 🛒 **Live Customer Web Store (Secondary)**: **[https://local-grocery-shop.vercel.app](https://local-grocery-shop.vercel.app)**
- ⚙️ **Live Backend REST API**: **[https://grocery-shop-backend-2q5y.onrender.com](https://grocery-shop-backend-2q5y.onrender.com)**
- 🐱 **GitHub Repository**: **[https://github.com/Revu-15/Local-Grocery-Shop-](https://github.com/Revu-15/Local-Grocery-Shop-)**

---

## ✨ Comprehensive Feature Suite

### 1. 📲 Verified Customer Authentication & SMS/Email OTP Engine
- **SMS & Email OTP Registration**: When signing up, a **6-Digit OTP Code** is dispatched to the user's mobile number (*e.g., +91 9876543210*) and email (*e.g., customer@example.com*).
- **Master Test OTP Support (`123456`)**: Supports `123456` as a master fallback OTP for instant testing.
- **1-Click SMS Helper**: Includes a **`📩 Didn't receive SMS? Click to view/auto-fill OTP`** fallback for zero friction.
- **Strict Registered Account Security**: Only registered users with verified phone/email and correct passwords can sign in. Unregistered logins are blocked with clear error alerts.
- **Auto-Switch to Sign In**: After account creation, the app auto-switches to the **Sign In** tab with pre-filled credentials.

### 2. 💳 PhonePe & UPI Bank Payment Verification System
- **Interactive PhonePe QR Code**: Scan-to-pay via PhonePe, Google Pay, SBI UPI, or Paytm.
- **Strict 12-Digit Numeric UTR Input**: Enforces exact 12-digit UTR/UPI reference numbers (*e.g., 151642402322*) before unlocking the green payment tick mark.
- **Unverified Bank Payment Warning**: Orders submitted via UPI start with **`⏳ UPI Pending Verification`** status.
- **Watermarked Unverified Receipts**: Invoice receipts display **`TOTAL PAYABLE (UNVERIFIED): ₹21.00`** and state **`Order Submitted - Awaiting Bank Verification`**.

### 3. 🛡️ Admin Store Owner Verification Portal
- **Dashboard Alert Box**: Store owner sees a prominent **"Pending Bank UTR Verifications"** banner upon opening the Admin Portal.
- **1-Click Bank Match Verification**:
  - **`✓ UTR MATCHED (Confirm Money Received)`**: Store owner verifies funds in their SBI / PhonePe Business app, clicks confirm, and updates status to **`✓ PAID & VERIFIED`** and **`Processing`**.
  - **`❌ DID NOT MATCH (Reject Fake UTR)`**: Rejects invalid/fake UTR numbers, cancels the order, and automatically restores product inventory.
- **PIN Protected Portal**: Default Store Owner Admin PIN is **`1234`**.

### 4. 🛒 Product Catalog & Smart Inventory Management
- **120+ Unique Grocery Products**: 6 core categories (*Produce, Dairy & Eggs, Bakery, Beverages, Snacks & Staples, Meats & Seafood*).
- **Indian Rupee (₹) Pricing**: Realistic pricing (*e.g., Honeycrisp Apples ₹180/kg, Amul Butter ₹275, Sona Masoori Rice ₹340/5kg*).
- **Real-Time Stock Deductions**: Deducts stock quantity atomically in SQLite upon order placement.
- **Restock & Low Stock Alerts**: Instant notifications when stock drops below threshold, with quick `+5 Restock` / `-1` controls.

### 5. 📊 Real-Time Sales & Revenue Analytics
- **Daily Revenue Metrics**: Tracks total revenue in **₹**, total checkouts, low stock count, and out-of-stock items.
- **Top Selling Products & Revenue Charts**: Visual breakdown of top-selling products and category sales distribution.

### 6. 🧾 GST Tax Invoice & Printable Receipts
- **Official GSTIN Tax Invoice**: Includes Store GSTIN (**`29AABCU9603R1ZM`**), itemized subtotals, tax breakdown, and customer delivery address.
- **Print & Download**: `@media print` styling for crisp physical or PDF receipts.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Custom CSS Glassmorphism Design System.
- **Backend**: Node.js, Express.js (ES Modules), CORS, Body-Parser.
- **Database**: SQLite3 (`sqlite3` with promise wrappers and atomic transactions).
- **Hosting / Deployment**: Vercel (Client Web App) & Render (Backend REST API).

---

## 📂 Repository Structure

```
Local Grocery Shop/
├── client/                     # Frontend React (Vite) Application
│   ├── src/
│   │   ├── components/        # UI Components (AdminDashboard, CheckoutModal, UserAuthModal, ReceiptModal, etc.)
│   │   ├── utils/             # API Fetch Helpers & Constants
│   │   ├── App.jsx            # Main React App Container
│   │   └── index.css          # Global Design System & Styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Node.js Express API Server
│   ├── db/                    # SQLite Database Storage
│   ├── index.js               # Express Server & Endpoints (Orders, Products, OTP, Analytics)
│   ├── test-flow.js           # Automated End-to-End Test Suite
│   └── package.json
│
└── README.md                   # Project Documentation
```

---

## 🚀 How to Run Locally

### 1. Start the Backend API Server
```powershell
cd server
npm install
node index.js
```
*Backend API server runs at `http://localhost:5000`*

### 2. Start the Frontend Application
```powershell
cd client
npm install
npm run dev
```
*Frontend application runs at `http://localhost:5173`*

### 3. Run Automated End-to-End Test Suite
```powershell
cd server
node test-flow.js
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all products in catalog |
| `POST` | `/api/products` | Create a new product (Admin) |
| `PUT` | `/api/products/:id` | Update product details or stock |
| `DELETE` | `/api/products/:id` | Delete product from catalog |
| `GET` | `/api/orders` | Fetch customer orders |
| `POST` | `/api/orders` | Place a new customer order |
| `PATCH` | `/api/orders/:id/status` | Update order fulfillment status (*Pending, Processing, Completed, Cancelled*) |
| `PATCH` | `/api/orders/:id/payment-status` | Update payment verification (*Paid, Rejected, UPI Pending Verification*) |
| `POST` | `/api/auth/send-otp` | Dispatch 6-digit SMS & Email OTP code |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit OTP code |
| `GET` | `/api/reports/daily-sales` | Fetch sales analytics & low stock metrics |

---

## 📄 License & Attribution

Built for **FreshBasket Local Grocery Shop**. All rights reserved. 🛒
