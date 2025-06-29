let allOrders = [];

function fetchOrders() {
    fetch('../php/get_all_orders.php')
        .then(res => res.json())
        .then(orders => {
            allOrders = orders;
            filterAndSearchOrders();
        });
}

function renderOrders(orders) {
    const tbody = document.getElementById("orders-table-body");
    tbody.innerHTML = '';
    if (!Array.isArray(orders) || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8">No orders found.</td></tr>';
        return;
    }
    orders.forEach(order => {
        // Format date as YYYY-MM-DD
        const dateObj = new Date(order.order_time);
        const dateStr = dateObj.toISOString().slice(0, 10);
        const timeStr = order.order_time_formatted || '-';

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${order.order_id}</td>
            <td>${order.items_summary || '-'}</td>
            <td>${dateStr}</td>
            <td>${timeStr}</td>
            <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
            <td>${order.order_type || '-'}</td>
            <td>${order.payment_method || '-'}</td>
            <td>
                <button class="action-btn view-btn" data-order="${order.order_id}">View</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Modal view
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.onclick = function () {
            const orderId = btn.dataset.order;
            document.getElementById('modal-overlay').style.display = 'flex';
            document.getElementById('modal-order-id').textContent = '#' + orderId;
            document.getElementById('modal-content').innerHTML = "Loading...";
            fetch(`../php/get_full_order.php?order_id=${orderId}`)
                .then(res => res.json())
                .then(order => {
                    if (order.error) {
                        document.getElementById('modal-content').innerHTML = `<div style="color:red;">${order.error}</div>`;
                    } else {
                        // Date & time
                        const dateObj = new Date(order.order_time);
                        const dateStr = dateObj.toISOString().slice(0, 10);
                        document.getElementById('modal-content').innerHTML = `
                            <div class="modal-section">
                                <strong>Items Ordered:</strong>
                                <ul>${
                                    (order.items || []).map(i => `<li>${i.quantity}x ${i.name} - RM${parseFloat(i.price).toFixed(2)}</li>`).join('')
                                }</ul>
                            </div>
                            <div class="modal-section">
                                <strong>Order Date:</strong>
                                <div>${dateStr}</div>
                            </div>
                            <div class="modal-section">
                                <strong>Order Time:</strong>
                                <div>${order.order_time_formatted || '-'}</div>
                            </div>
                            <div class="modal-section">
                                <strong>Status:</strong>
                                <div>${order.status || '-'}</div>
                            </div>
                            <div class="modal-section">
                                <strong>Order Type:</strong>
                                <div>${order.order_type || '-'}</div>
                            </div>
                            <div class="modal-section">
                                <strong>Payment:</strong>
                                <div>${order.payment_method || '-'}</div>
                            </div>
                        `;
                    }
                });
        }
    });
}

// Filtering & search logic
function filterAndSearchOrders() {
    const status = document.getElementById('filter-status').value;
    const type = document.getElementById('filter-type').value;
    const payment = document.getElementById('filter-payment').value;
    const dateFrom = document.getElementById('filter-date-from').value;
    const dateTo = document.getElementById('filter-date-to').value;
    const search = document.getElementById('search-input').value.trim().toLowerCase();

    let filtered = allOrders.filter(order => {
        // Filter by status, order type
        if (status && order.status.toLowerCase() !== status.toLowerCase()) return false;
        if (type && order.order_type.toLowerCase() !== type.toLowerCase()) return false;
        // Payment filter: only filter cod and qr
        if (payment) {
            if (payment === "cod" && order.payment_method.toLowerCase() !== "cod") return false;
            if (payment === "qr" && order.payment_method.toLowerCase() !== "qr") return false;
        }
        // Filter by date
        if (dateFrom && new Date(order.order_time) < new Date(dateFrom + "T00:00:00")) return false;
        if (dateTo && new Date(order.order_time) > new Date(dateTo + "T23:59:59")) return false;
        // Search by order_id, item name
        if (search) {
            const idMatch = order.order_id.toString().includes(search);
            const itemMatch = order.items_summary && order.items_summary.toLowerCase().includes(search);
            return idMatch || itemMatch;
        }
        return true;
    });

    renderOrders(filtered);
}

document.addEventListener('DOMContentLoaded', function () {
    fetchOrders();
    document.getElementById('close-modal').onclick = function () {
        document.getElementById('modal-overlay').style.display = 'none';
    };
    document.getElementById('modal-overlay').addEventListener('click', function (e) {
        if (e.target === this) this.style.display = 'none';
    });

    // Filter & search events
    document.getElementById('filter-status').addEventListener('change', filterAndSearchOrders);
    document.getElementById('filter-type').addEventListener('change', filterAndSearchOrders);
    document.getElementById('filter-payment').addEventListener('change', filterAndSearchOrders);
    document.getElementById('filter-date-from').addEventListener('change', filterAndSearchOrders);
    document.getElementById('filter-date-to').addEventListener('change', filterAndSearchOrders);
    document.getElementById('search-input').addEventListener('input', filterAndSearchOrders);
});