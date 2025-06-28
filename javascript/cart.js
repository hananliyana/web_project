function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function setupMenuCartLogic() {
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
            const item_id = Number(menuItem.getAttribute('data-id')); // Ensure item_id is a number
            const name = menuItem.getAttribute('data-name');
            const price = parseFloat(menuItem.getAttribute('data-price'));
            const img = menuItem.getAttribute('data-img');

            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.find(item => Number(item.item_id) === item_id); // Compare as numbers

            if (existing) {
                existing.qty += qty;
            } else {
                cart.push({ item_id, name, price, qty, img });
            }

            localStorage.setItem('cart', JSON.stringify(cart));

            alert(`${qty} x ${name} added to cart!`);

            qty = 1;
            qtyNumber.textContent = qty;
        });
    });
}

function renderCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary h2');
    let cart = getCart();

    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartSummary.textContent = "Total: RM0.00";
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-details">
                <h3>${item.name}</h3>
                <p>Price: RM${item.price.toFixed(2)}</p>
                <p>Qty: ${item.qty}</p>
                <p>Subtotal: RM${(item.price * item.qty).toFixed(2)}</p>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;
        cartContainer.appendChild(itemDiv);
    });

    // Attach remove button handler
    cartContainer.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-index'));
            cart.splice(idx, 1);
            saveCart(cart);
            renderCartItems();
        });
    });

    cartSummary.textContent = `Total: RM${total.toFixed(2)}`;
}

// Only run on cart.html
if (document.querySelector('.cart-items')) {
    renderCartItems();
}