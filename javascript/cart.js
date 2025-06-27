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
    const item_id = parseInt(menuItem.getAttribute('data-id'));
    const name = menuItem.getAttribute('data-name');
    const price = parseFloat(menuItem.getAttribute('data-price'));
    const img = menuItem.getAttribute('data-img');

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.item_id === item_id);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ item_id, name, price, qty, img });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    qty = 1;
    qtyNumber.textContent = qty;

    alert(`${qty} x ${name} added to cart!`);
});
    });
}
