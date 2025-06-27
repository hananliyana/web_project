// Get order_id from URL
// Example: Get order info from localStorage or sessionStorage (simulate after submit)
function getOrderData() {
    // For demo, populate this in your checkout JS after form submit!
    return JSON.parse(localStorage.getItem('lastOrder')) || {};
}
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}


function renderReceipt() {
    const receipt = document.getElementById('receipt');
    const order = getOrderData();
    const cart = getCart();


    if (!order || cart.length === 0) {
        receipt.innerHTML = "<p>No recent order found.</p>";
        return;
    }


    let itemsHtml = '';
    let total = 0;
    cart.forEach(item => {
        const line = (item.price * item.qty);
        total += line;
        itemsHtml += `<tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>RM${item.price.toFixed(2)}</td>
            <td>RM${line.toFixed(2)}</td>
        </tr>`;
    });


    receipt.innerHTML = `
        <div class="receipt-details">
            <p><strong>Name:</strong> ${order.custName || '-'}</p>
            <p><strong>Email:</strong> ${order.email || '-'}</p>
            ${order.pickupTime ? `<p><strong>Pickup Time:</strong> ${order.pickupTime}</p>` : ''}
            ${order.address ? `<p><strong>Address:</strong> ${order.address}</p>` : ''}
            <p><strong>Payment Method:</strong> ${order.paymentMethod === "qr" ? "QR Code" : "Cash on Delivery"}</p>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Menu Item</th><th>Qty</th><th>Unit Price</th><th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3">Total</td>
                    <td>RM${total.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
        <p style="margin-top:18px;color:green;font-weight:bold;">Thank you for your order!</p>
    `;


    // Only clear after rendering
    localStorage.removeItem('cart');
    localStorage.removeItem('lastOrder');
}


document.addEventListener('DOMContentLoaded', renderReceipt);
