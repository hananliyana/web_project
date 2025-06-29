document.addEventListener('DOMContentLoaded', function () {
    let ordersData = [];

    fetch('../php/orderinprogress.php')
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
                    <button type="button" class="mark-ready-btn" data-order-id="${order.order_id}">Mark as Ready</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Attach event listeners for Mark as Ready buttons
        document.querySelectorAll('.mark-ready-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = btn.getAttribute('data-order-id');
                if (!confirm('Are you sure you want to mark this order as ready?')) return;

                fetch('../php/markasready.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ order_id: orderId })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        btn.closest('tr').remove();
                        alert('Order marked as Ready and will appear in Order To Pickup!');
                    } else {
                        alert('Failed to mark order as Ready: ' + (result.error || 'Unknown error'));
                    }
                })
                .catch(() => alert('Failed to communicate with server.'));
            });
        });
    }

    // Search bar function: Only search by order_id
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