document.addEventListener('DOMContentLoaded', function () {
    // Load summary statistics and order activity
    fetch('../php/dashboardstats.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('total-orders').textContent = data.total_orders_today ?? 0;
            document.getElementById('pending-orders').textContent = data.pending_orders ?? 0;
            document.getElementById('inprogress-orders').textContent = data.inprogress_orders ?? 0;
            document.getElementById('ready-orders').textContent = data.ready_orders ?? 0;
            document.getElementById('total-revenue').textContent = 'RM ' + (parseFloat(data.total_revenue_today ?? 0).toFixed(2));
        });

    fetch('../php/dashboardorders.php')
        .then(response => response.json())
        .then(orders => {
            const tbody = document.getElementById('activity-table-body');
            tbody.innerHTML = '';
            if (Array.isArray(orders) && orders.length > 0) {
                orders.forEach(order => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>#${order.order_id}</td>
                        <td>${getStatusBadge(order.status)}</td>
                        <td>${order.order_time_formatted ?? order.order_time ?? '-'}</td>
                        <td><button class="action-btn" data-order-id="${order.order_id}">View/Edit</button></td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="4">No orders found.</td></tr>';
            }

            // Add event listeners for "View/Edit" buttons - only popup modal, no redirect
            document.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const orderId = btn.getAttribute('data-order-id');
                    const modalOverlay = document.getElementById('order-modal-overlay');
                    const modalContent = document.getElementById('order-modal-content');
                    modalOverlay.style.display = 'flex';
                    modalContent.innerHTML = "Loading...";
                    fetch(`../php/get_order.php?order_id=${orderId}`)
                        .then(res => res.json())
                        .then(order => {
                            if (order.error) {
                                modalContent.innerHTML = `<div style="color:red;">${order.error}</div>`;
                            } else {
                                modalContent.innerHTML = `
                                    <p><b>Order ID:</b> #${order.order_id}</p>
                                    <p><b>Status:</b> ${order.status}</p>
                                    <p><b>Order Time:</b> ${order.order_time}</p>
                                    <p><b>Total Amount:</b> RM ${parseFloat(order.total_amount).toFixed(2)}</p>
                                    <!-- Add more fields as needed -->
                                `;
                            }
                        })
                        .catch(() => {
                            modalContent.innerHTML = '<div style="color:red;">Failed to load order details.</div>';
                        });
                });
            });
        });

    function getStatusBadge(status) {
        status = (status ?? '').toLowerCase();
        switch (status) {
            case 'pending':
                return '<span class="badge badge-pending">Pending</span>';
            case 'in progress':
            case 'inprogress':
                return '<span class="badge badge-inprogress">In Progress</span>';
            case 'ready':
            case 'ready for pickup':
            case 'to pickup':
                return '<span class="badge badge-ready">Ready for Pickup</span>';
            case 'completed':
                return '<span class="badge badge-completed">Completed</span>';
            default:
                return `<span class="badge">${status}</span>`;
        }
    }

    // Modal close logic
    document.getElementById('close-order-modal').onclick = function() {
        document.getElementById('order-modal-overlay').style.display = 'none';
    };
    document.getElementById('order-modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
    });
});