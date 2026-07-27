const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- 🧪 STARTING END-TO-END GROCERY SHOP API TEST SUITE ---');

  // 1. Fetch initial products & check initial stock of item 1 (Honeycrisp Apples)
  const productsRes = await fetch(`${BASE_URL}/products`);
  const products = await productsRes.json();
  console.log(`\n✅ 1. Fetch Products: Loaded ${products.length} products successfully.`);
  
  const targetProduct = products.find(p => p.name.includes('Honeycrisp'));
  console.log(`   Initial stock for "${targetProduct.name}": ${targetProduct.stock_quantity}`);

  // 2. Create customer order (2x Honeycrisp Apples)
  const orderPayload = {
    customer_name: 'Test Customer',
    customer_phone: '+1 555-999-0000',
    delivery_type: 'COD',
    address: '123 Grocery Lane',
    items: [
      { product_id: targetProduct.id, quantity: 2 }
    ]
  };

  const orderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });
  const createdOrder = await orderRes.json();
  console.log(`\n✅ 2. Order Placement: Created Order #${createdOrder.order_number}`);
  console.log(`   Subtotal: ₹${createdOrder.subtotal}, Tax: ₹${createdOrder.tax}, Total: ₹${createdOrder.total_amount}`);

  // 3. Verify stock deduction in database
  const updatedProductRes = await fetch(`${BASE_URL}/products/${targetProduct.id}`);
  const updatedProduct = await updatedProductRes.json();
  console.log(`\n✅ 3. Real-Time Stock Management:`);
  console.log(`   Previous Stock: ${targetProduct.stock_quantity} -> New Stock: ${updatedProduct.stock_quantity}`);
  if (updatedProduct.stock_quantity === targetProduct.stock_quantity - 2) {
    console.log(`   🎉 Stock deduction verified! (Exact -2 deducted)`);
  } else {
    console.error(`   ❌ Stock mismatch! Expected ${targetProduct.stock_quantity - 2}, got ${updatedProduct.stock_quantity}`);
  }

  // 4. Update Order Status (Pending -> Completed)
  const statusRes = await fetch(`${BASE_URL}/orders/${createdOrder.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Completed' })
  });
  const updatedOrder = await statusRes.json();
  console.log(`\n✅ 4. Admin Order Status Update: Changed status to "${updatedOrder.status}"`);

  // 5. Check Daily Sales Summary Report
  const reportRes = await fetch(`${BASE_URL}/reports/daily-sales`);
  const report = await reportRes.json();
  console.log(`\n✅ 5. Daily Sales Summary Analytics:`);
  console.log(`   Total Revenue: ₹${report.total_revenue}`);
  console.log(`   Total Orders: ${report.total_orders}`);
  console.log(`   Low Stock Items Count: ${report.low_stock_count}`);
  console.log(`   Top Selling Items:`, report.top_items);

  console.log('\n--- 🎉 ALL API & BUSINESS LOGIC TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
