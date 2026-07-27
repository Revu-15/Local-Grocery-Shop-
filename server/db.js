import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialProducts } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'grocery.db');

const verboseSqlite = sqlite3.verbose();
export const db = new verboseSqlite.Database(dbPath);

// Promisified database helpers
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const initDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        // Products Table
        db.run(`
          CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            unit TEXT NOT NULL,
            stock_quantity INTEGER NOT NULL DEFAULT 0,
            low_stock_threshold INTEGER NOT NULL DEFAULT 10,
            image_url TEXT,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Orders Table
        db.run(`
          CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number TEXT UNIQUE NOT NULL,
            user_id TEXT,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            delivery_type TEXT NOT NULL, -- 'COD' or 'Pickup'
            address TEXT,
            subtotal REAL NOT NULL,
            tax REAL NOT NULL,
            total_amount REAL NOT NULL,
            payment_status TEXT NOT NULL DEFAULT 'Paid', -- 'Paid' or 'Pending COD'
            transaction_ref TEXT, -- UPI UTR or Card Ref No.
            status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Processing', 'Completed', 'Cancelled'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Migration helpers for table updates
        db.run(`ALTER TABLE orders ADD COLUMN user_id TEXT`, (err) => {});
        db.run(`ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'Paid'`, (err) => {});
        db.run(`ALTER TABLE orders ADD COLUMN transaction_ref TEXT`, (err) => {});

        // Order Items Table
        db.run(`
          CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            unit_price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            subtotal REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id)
          )
        `);

        // Check if database needs initial seeding
        db.get('SELECT COUNT(*) as count FROM products', async (err, row) => {
          if (err) {
            console.error('Error checking products count:', err);
            return reject(err);
          }

          if (row && row.count === 0) {
            console.log('Seeding initial grocery products into database...');
            const insertStmt = db.prepare(`
              INSERT INTO products (name, category, price, unit, stock_quantity, low_stock_threshold, image_url, description)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            for (const item of initialProducts) {
              insertStmt.run(
                item.name,
                item.category,
                item.price,
                item.unit,
                item.stock_quantity,
                item.low_stock_threshold,
                item.image_url,
                item.description
              );
            }

            insertStmt.finalize((err) => {
              if (err) reject(err);
              else {
                console.log(`Successfully seeded ${initialProducts.length} grocery items!`);
                resolve();
              }
            });
          } else {
            console.log(`Database ready. Existing products count: ${row ? row.count : 0}`);
            resolve();
          }
        });
      } catch (error) {
        console.error('Database initialization error:', error);
        reject(error);
      }
    });
  });
};
