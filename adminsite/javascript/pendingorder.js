document.addEventListener('DOMContentLoaded', function () {
    let ordersData = [];

    fetch('../php/pendingorder.php')
        .then(response => response.json())
        .then(data => {
            ordersData = data;
            renderTable(ordersData);
        });

    function renderTable(data) {
        const tbody = document.querySelector('.orders-table tbody');
        tbody.innerHTML = '';
        data.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${order.order_id}</td>
                <td>${order.user_id ?? ''}</td>
                <td>${order.staff_id ?? ''}</td>
                <td>${order.table_id ?? ''}</td>
                <td>${order.order_type ?? ''}</td>
                <td>${order.order_time ?? ''}</td>
                <td class="status-td">${order.status ?? ''}</td>
                <td>${order.total_amount ?? ''}</td>
                <td>${order.payment_method ?? ''}</td>
                <td>
                    <button type="button" class="accept-btn" data-order-id="${order.order_id}">Accept</button>
                    <button type="button" class="cancel-btn" data-order-id="${order.order_id}">Cancel</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        attachAcceptListeners();
        attachCancelListeners();
    }

    function attachAcceptListeners() {
        document.querySelectorAll('.accept-btn').forEach(btn => {
            btn.onclick = function () {
                const orderId = btn.getAttribute('data-order-id');
                const confirmed = confirm('Are you sure you want to accept this order?');
                if (!confirmed) return;
                fetch('../php/acceptorder.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order_id: orderId })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        const row = btn.closest('tr');
                        row.parentNode.removeChild(row);
                    } else {
                        alert('Failed to update order status.');
                    }
                })
                .catch(() => alert('Failed to communicate with server.'));
            };
        });
    }

    function attachCancelListeners() {
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.onclick = function () {
                if (!confirm('Are you sure you want to cancel this order?')) return;
                const orderId = btn.getAttribute('data-order-id');
                fetch('../php/cancelorder.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order_id: orderId })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        const row = btn.closest('tr');
                        row.parentNode.removeChild(row);
                        window.location.href = 'orderhistory.html';
                    } else {
                        alert('Failed to cancel order.');
                    }
                })
                .catch(() => alert('Failed to communicate with server.'));
            };
        });
    }

    // Search bar function
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm === '') {
            renderTable(ordersData);
            return;
        }
        // Only filter by order_id (exact or partial match)
        const filtered = ordersData.filter(order =>
            order.order_id && order.order_id.toString().includes(searchTerm)
        );
        renderTable(filtered);
    });
});