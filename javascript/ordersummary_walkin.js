document.addEventListener('DOMContentLoaded', async function () {
  const orderItemsElem = document.getElementById('order-items');
  const totalElem = document.getElementById('order-total-rm');

  const cart = JSON.parse(localStorage.getItem('submitted_cart') || '[]');
  const total = parseFloat(localStorage.getItem('submitted_total') || '0.00');
  const userId = localStorage.getItem('user_id');
  const tableId = localStorage.getItem('table_id');

  // Display order items
  if (orderItemsElem) {
    if (cart.length === 0) {
      orderItemsElem.innerHTML = '<p>No items found in your order.</p>';
    } else {
      orderItemsElem.innerHTML = cart.map(item => `
        <div class="order-item" style="margin-bottom: 10px;">
          <span><strong>${item.name}</strong> x${item.qty}</span>
          <span style="float: right;">RM${(item.price * item.qty).toFixed(2)}</span>
        </div>
      `).join('');
    }
  }

  if (totalElem) {
    totalElem.textContent = `Total: RM${total.toFixed(2)}`;
  }
console.log("Debug Info:");
console.log("order_submitted:", localStorage.getItem('order_submitted'));
console.log("cart:", cart);
console.log("cart.length:", cart.length);
console.log("userId:", userId);
console.log("tableId:", tableId);

  // ✅ Submit to PHP only once
  if (!localStorage.getItem('order_submitted') && cart.length > 0 && userId && tableId) {
    try {
      const res = await fetch('../php/submitorder_walkin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(userId),
          table_id: parseInt(tableId),
          cart: cart,
          total_amount: total
        })
      });

      const result = await res.json();
      if (result.success) {
        console.log("Order submitted successfully. Order ID:", result.order_id);
        console.log("Submitting order with:");
console.log("user_id:", userId);
console.log("table_id:", tableId);

        localStorage.setItem('order_submitted', 'true');
      } else {
        console.error("Order submission failed:", result.message);
      }
    } catch (err) {
      console.error("Error submitting order:", err);
    }
  } else {
    console.log("Skipped submitting order (already submitted or missing data)");
  }
});
