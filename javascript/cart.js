// --- Cart Logic for Menu and Cart Pages ---

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', function () {
    // MENU PAGE: Plus/Minus and Add to Cart
    document.querySelectorAll('.menu-item').forEach(function(menuItem) {
        let qtyNumber = menuItem.querySelector('.qty-number');
        let minusBtn = menuItem.querySelector('.qty-btn.minus');
        let plusBtn = menuItem.querySelector('.qty-btn.plus');
        let addBtn = menuItem.querySelector('.add-cart-btn');
        let qty = 1;

        // Plus/Minus event handlers
        minusBtn.addEventListener('click', function() {
            if (qty > 1) {
                qty--;
                qtyNumber.textContent = qty;
            }
        });

        plusBtn.addEventListener('click', function() {
            qty++;
            qtyNumber.textContent = qty;
        });

        addBtn.addEventListener('click', function () {
            const name = menuItem.getAttribute('data-name');
            const price = parseFloat(menuItem.getAttribute('data-price'));
            const img = menuItem.getAttribute('data-img');

            let cart = getCart();
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty += qty;
            } else {
                cart.push({ name, price, qty, img });
            }
            saveCart(cart);

            // Reset to 1 for better UX
            qty = 1;
            qtyNumber.textContent = qty;

            alert(`${qty} x ${name} added to cart!`);
        });
    });

    // Render cart page if present
    renderCartPage();
});

function renderCartPage() {
    if (!document.querySelector('.cart-page')) return;

    const cartItemsElem = document.querySelector('.cart-items');
    let cart = getCart();
    let total = 0;
    cartItemsElem.innerHTML = '';

    if (cart.length === 0) {
        cartItemsElem.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((item, idx) => {
            total += item.price * item.qty;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <span class="item-name">${item.name}</span>
                <input type="number" value="${item.qty}" min="1" class="item-qty" data-idx="${idx}">
                <span class="item-price">RM${(item.price * item.qty).toFixed(2)}</span>
                <button class="remove-btn" data-idx="${idx}">Remove</button>
            `;
            cartItemsElem.appendChild(div);
        });
    }

    const summary = document.querySelector('.cart-summary h2');
    if (summary) summary.textContent = `Total: RM${total.toFixed(2)}`;

    cartItemsElem.querySelectorAll('.item-qty').forEach(input => {
        input.addEventListener('change', function () {
            const idx = +this.getAttribute('data-idx');
            let val = parseInt(this.value);
            if (isNaN(val) || val < 1) val = 1;
            cart[idx].qty = val;
            saveCart(cart);
            renderCartPage();
        });
    });

    cartItemsElem.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const idx = +this.getAttribute('data-idx');
            cart.splice(idx, 1);
            saveCart(cart);
            renderCartPage();
        });
    });
}