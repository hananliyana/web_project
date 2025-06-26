// Utility to get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function renderOrderSummary() {
    const orderItemsElem = document.querySelector('.order-items');
    const orderTotalElem = document.getElementById('order-total-rm');
    let cart = getCart();
    let total = 0;

    orderItemsElem.innerHTML = '';

    if (cart.length === 0) {
        orderItemsElem.innerHTML = '<p>Your cart is empty.</p>';
        orderTotalElem.textContent = "Total: RM0.00";
        return;
    }

    cart.forEach(item => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-qty">x${item.qty}</span>
            <span class="item-price">RM${(item.price * item.qty).toFixed(2)}</span>
        `;
        orderItemsElem.appendChild(div);
    });

    orderTotalElem.textContent = `Total: RM${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    renderOrderSummary();

    // Payment method logic
    var paySelect = document.getElementById('paymentMethod');
    var qrSection = document.getElementById('qrSection');
    paySelect.addEventListener('change', function() {
        if (this.value === "qr") {
            qrSection.style.display = "block";
        } else {
            qrSection.style.display = "none";
        }
    });
    paySelect.dispatchEvent(new Event('change'));

    // Before submit, put cart JSON into hidden input
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const cart = getCart();
            document.getElementById('orderData').value = JSON.stringify(cart);
            // Let form submit to PHP
        });
    }
});