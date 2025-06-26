document.addEventListener('DOMContentLoaded', function () {
    fetch('../php/orderinprogress.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('.orders-table tbody');
            tbody.innerHTML = '';
            data.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${order.order_id}</td>
                    <td>${order.user_id}</td>
                    <td>${order.staff_id}</td>
                    <td>${order.table_id ?? '-'}</td>
                    <td>${order.order_time}</td>
                    <td>${order.status}</td>
                    <td>${order.total_amount}</td>
                    <td><button type="button" class="mark-ready-btn" data-order-id="${order.order_id}">Mark as Ready</button></td>
                `;
                tbody.appendChild(tr);
            });

            // (Optional) You can add event listeners for the Mark Ready buttons here
            document.querySelectorAll('.mark-ready-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const orderId = btn.getAttribute('data-order-id');
                    // Add your AJAX call to mark the order as ready here
                    alert('Mark Ready clicked for order ID: ' + orderId);
                });
            });
        });
});