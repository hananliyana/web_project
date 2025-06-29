function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
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
        orderItemsElem.appendChild(div);
    });

    orderTotalElem.textContent = `Total: RM${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    renderOrderSummary();
    
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const cart = getCart();
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Verify all items have IDs
        if (cart.some(item => !item.item_id)) {
            console.error('Cart items missing IDs:', cart);
            alert('Some items in your cart are invalid. Please refresh and try again.');
            return;
        }

        const formData = new FormData(this);
        const orderData = {
            custName: formData.get('custName'),
            email: formData.get('email'),
            pickupTime: formData.get('pickupTime'),
            address: formData.get('address'),
            paymentMethod: formData.get('paymentMethod'),
            cart: cart
        };

        console.log('Submitting order:', orderData); // Debug log

        fetch('../php/submit_order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.order_id) {
                sessionStorage.setItem('lastCart', JSON.stringify(cart));
                localStorage.removeItem('cart');
                window.location.href = `confirmation.html?order_id=${data.order_id}`;
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Order failed: ' + error.message);
        });
    });
});