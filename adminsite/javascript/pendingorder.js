document.addEventListener('DOMContentLoaded', function () {
    fetch('../php/pendingorder.php')
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
                    <td>${order.table_id}</td>
                    <td>${order.order_time}</td>
                    <td class="status-td">${order.status}</td>
                    <td>${order.total_amount}</td>
                    <td>
                        <button type="button" class="accept-btn" data-order-id="${order.order_id}">Accept</button>
                        <button type="button" class="cancel-btn" data-order-id="${order.order_id}">Cancel</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            attachAcceptListeners();
        });

    function attachAcceptListeners() {
        document.querySelectorAll('.accept-btn').forEach(btn => {
            btn.onclick = function () {
                const orderId = btn.getAttribute('data-order-id');
                fetch('../php/acceptorder.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order_id: orderId })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        const row = btn.closest('tr');
                        row.querySelector('.status-td').textContent = "in progress";
                        btn.disabled = true;
                    } else {
                        alert('Failed to update order status.');
                    }
                })
                .catch(() => alert('Failed to communicate with server.'));
            };
        });
    }
});