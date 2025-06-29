document.addEventListener('DOMContentLoaded', function () {
    fetch('../php/orderhistory.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('.orders-table tbody');
            tbody.innerHTML = '';
            data.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${order.order_id ?? ''}</td>
                    <td>${order.user_id ?? ''}</td>
                    <td>${order.staff_id ?? ''}</td>
                    <td>${order.table_id ?? ''}</td>
                    <td>${order.order_type ?? ''}</td>
                    <td>${order.order_time ?? ''}</td>
                    <td class="status-td">${order.status ?? ''}</td>
                    <td>${order.total_amount ?? ''}</td>
                    <td>${order.payment_method ?? ''}</td>
                    <td>
                        <button type="button" class="view-details-btn" data-order-id="${order.order_id}">View Details</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            document.querySelectorAll('.view-details-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const orderId = btn.getAttribute('data-order-id');
                    // If a modal exists, show order details in the modal
                    const modalOverlay = document.getElementById('modal-overlay');
                    if(modalOverlay) {
                        modalOverlay.style.display = 'flex';
                        // Fill modal with order details (implement this based on your modal structure)
                        document.getElementById('modal-order-id').textContent = '#' + orderId;
                        // You can add extra logic here to fill in items, notes, etc.
                    } else {
                        alert('Order details for order ID: ' + orderId);
                    }
                });
            });

            // Modal close handler (if modal exists)
            const closeModal = document.getElementById('close-modal');
            if(closeModal) {
                closeModal.onclick = function() {
                    document.getElementById('modal-overlay').style.display = 'none';
                };
            }
        });
});