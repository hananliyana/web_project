// Utility to get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

document.addEventListener('DOMContentLoaded', function() {
    const cart = getCart();
    const orderItemsElem = document.querySelector('.order-items');
    const totalElem = document.querySelector('.order-total h2');

    let total = 0;
    orderItemsElem.innerHTML = '';

    if (cart.length === 0) {
        orderItemsElem.innerHTML = '<p style="text-align:center;color:#ccc;">Your cart is empty.</p>';
        totalElem.textContent = 'Total: $0.00';
    } else {
        cart.forEach(item => {
            const price = item.price * item.qty;
            total += price;

            const div = document.createElement('div');
            div.className = 'order-item';
            div.innerHTML = `
                <h3>${item.name}</h3>
                <p>Quantity: ${item.qty}</p>
                <p>Price: $${price.toFixed(2)}</p>
            `;
            orderItemsElem.appendChild(div);
        });
        totalElem.textContent = `Total: $${total.toFixed(2)}`;
    }
});