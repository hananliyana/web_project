// Fetch and render menu items, then attach cart logic
document.addEventListener('DOMContentLoaded', function () {
    fetch('../php/menu.php')
        .then(response => response.json())
        .then(menu => {
            const grid = document.getElementById('menu-grid');
            grid.innerHTML = '';
            if (!menu.length) {
                grid.innerHTML = '<p>No menu items available.</p>';
                return;
            }

menu.forEach(item => {
    grid.innerHTML += `
    <div class="menu-item" 
         data-id="${item.item_id}" 
         data-name="${item.name}" 
         data-price="${item.price}" 
         data-img="${item.img}">
        <img src="../images/${item.img}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <span>RM${Number(item.price).toFixed(2)}</span>
        <div class="add-cart-controls">
            <button class="qty-btn minus">-</button>
            <span class="qty-number">1</span>
            <button class="qty-btn plus">+</button>
            <button class="add-cart-btn">Add to Cart</button>
        </div>
    </div>
    `;
});

            setupMenuCartLogic(); // Attach event handlers after rendering
        });
});

// Define all cart and quantity logic here
function setupMenuCartLogic() {
    document.querySelectorAll('.menu-item').forEach(function(menuItem) {
        let qtyNumber = menuItem.querySelector('.qty-number');
        let minusBtn = menuItem.querySelector('.qty-btn.minus');
        let plusBtn = menuItem.querySelector('.qty-btn.plus');
        let addBtn = menuItem.querySelector('.add-cart-btn');
        let qty = 1;

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
