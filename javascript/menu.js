document.addEventListener('DOMContentLoaded', function () {
    fetch('../php/menu.php')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(menu => {
            const grid = document.getElementById('menu-grid');
            grid.innerHTML = '';
            if (!menu.length) {
                grid.innerHTML = '<p>No menu items available.</p>';
                return;
            }
            menu.forEach(item => {
                grid.innerHTML += `
                <div class="menu-item" data-name="${item.name}" data-price="${item.price}" data-img="${item.img}">
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
        })
        .catch(error => {
            document.getElementById('menu-grid').innerHTML = '<p>Failed to load menu.</p>';
            console.error('Error fetching menu:', error);
        });
});