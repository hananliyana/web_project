// Utility to get cart from localStorage
function getCart() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return cart ? JSON.parse(cart) : [];
}

function renderOrderSummary() {
    console.log(getCart());
    const orderItemsElem = document.querySelector('.order-items');
    const orderTotalElem = document.getElementById('order-total-rm');
    let cart = getCart();

    orderItemsElem.innerHTML = '';
    let total = 0;

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
            <span>${item.name}</span>
            <span>Qty: ${item.qty}</span>
            <span>RM${item.price.toFixed(2)}</span>
            <span>Subtotal: RM${(item.price * item.qty).toFixed(2)}</span>
        `;
        orderItemsElem.appendChild(div); // <-- THIS LINE WAS MISSING
    });

    orderTotalElem.textContent = `Total: RM${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    renderOrderSummary();
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Step 1: Prevent default form submission

        // Step 2: Collect form data
        const formData = new FormData(this);

        // Step 3: Add cart data to formData
        formData.set('orderData', JSON.stringify(getCart()));
        console.log("Sending form data with cart:", getCart());


        // Step 4: Send AJAX request
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
fetch('php/submit_order.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `orderData=${encodeURIComponent(JSON.stringify(cart))}`
})
        .then(response => response.json())
        .then(data => {
            // Step 5: Handle response
            if (data.order_id) {
                sessionStorage.setItem('lastCart', JSON.stringify(getCart())); // ✅ save to sessionStorage
                localStorage.removeItem('cart'); // optional if you want cart to be empty next time
                window.location.href = `confirmation.html?order_id=${data.order_id}`;

            } else {
                alert(data.error || 'Order failed!');
            }
        })
        .catch(() => {
            alert('An error occurred. Please try again.');
        });
    });
});