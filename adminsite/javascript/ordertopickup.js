document.addEventListener('DOMContentLoaded', function () {
    fetch('../php/ordertopickup.php')
        .then(response => response.json())
        .then(data => {
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
    <button type="button" class="pickedup-btn" data-order-id="${order.order_id}">Mark as Complete</button>
</td>
                `;
                tbody.appendChild(tr);
            });

            // Button event
            document.querySelectorAll('.pickedup-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const orderId = btn.getAttribute('data-order-id');
                    // AJAX to mark as complete
                    fetch('../php/ordercomplete.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `order_id=${encodeURIComponent(orderId)}`
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            alert('Order marked as complete!');
                            window.location.href = 'orderhistory.html';
                        } else {
                            alert('Failed to mark as complete: ' + (result.error || 'Unknown error'));
                        }
                    })
                    .catch(() => alert('Network error. Please try again.'));
                });
            });
        });
});