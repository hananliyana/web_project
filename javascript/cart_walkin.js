// --- Cart Logic for Walk-In Cart Page ---

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', function () {
    renderCartPage();

    // Menu add-to-cart logic (only applies on menu.html pages)
    document.querySelectorAll('.menu-item').forEach(item => {
        const minusBtn = item.querySelector('.qty-btn.minus');
        const plusBtn = item.querySelector('.qty-btn.plus');
        const qtyElem = item.querySelector('.qty-number');
        const addBtn = item.querySelector('.add-cart-btn');

        let qty = parseInt(qtyElem.textContent);

        minusBtn.addEventListener('click', () => {
            if (qty > 1) {
                qty--;
                qtyElem.textContent = qty;
            }
        });

        plusBtn.addEventListener('click', () => {
            qty++;
            qtyElem.textContent = qty;
        });

        addBtn.addEventListener('click', () => {
            const name = item.getAttribute('data-name');
            const price = parseFloat(item.getAttribute('data-price'));
            const img = item.getAttribute('data-img');

            let cart = getCart();
            const existing = cart.find(i => i.name === name);
            if (existing) {
                existing.qty += qty;
            } else {
                cart.push({ name, price, qty, img });
            }

            saveCart(cart);
            alert(`${qty} x ${name} added to cart!`);
            qty = 1;
            qtyElem.textContent = qty;
        });
    });
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
                <div class="qty-controls">
                    <button class="qty-btn minus" data-idx="${idx}">-</button>
                    <span class="qty-number">${item.qty}</span>
                    <button class="qty-btn plus" data-idx="${idx}">+</button>
                </div>
                <span class="item-price">RM${(item.price * item.qty).toFixed(2)}</span>
                <button class="remove-btn" data-idx="${idx}">Remove</button>
            `;
            cartItemsElem.appendChild(div);
        });
    }

    const summary = document.querySelector('.cart-summary h2');
    if (summary) summary.textContent = `Total: RM${total.toFixed(2)}`;

    // Plus/Minus quantity controls
    cartItemsElem.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', function () {
            const idx = +this.getAttribute('data-idx');
            cart[idx].qty++;
            saveCart(cart);
            renderCartPage();
        });
    });

    cartItemsElem.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', function () {
            const idx = +this.getAttribute('data-idx');
            if (cart[idx].qty > 1) {
                cart[idx].qty--;
                saveCart(cart);
                renderCartPage();
            }
        });
    });

    // Remove item
    cartItemsElem.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const idx = +this.getAttribute('data-idx');
            cart.splice(idx, 1);
            saveCart(cart);
            renderCartPage();
        });
    });

    // Attach Proceed to Checkout button event
    const proceedBtn = document.querySelector('.cta-btn');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const cart = getCart();
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            const orderId = 'WALKIN-' + Date.now();
            let total = 0;
            cart.forEach(item => total += item.price * item.qty);

            // Save to localStorage for use in order summary page
            localStorage.setItem("submitted_cart", JSON.stringify(cart));
            localStorage.setItem("submitted_total", total.toString());
            localStorage.setItem("submitted_order_id", orderId);

            // Redirect to summary page
            window.location.href = "ordersummary_walkin.html";
        });
    }
}
