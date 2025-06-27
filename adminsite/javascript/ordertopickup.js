document.addEventListener('DOMContentLoaded', function () {
    fetch('../php/ordertopickup.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('.orders-table tbody');
            tbody.innerHTML = '';
            const now = new Date();

            data.forEach(row => {
                // Calculate waiting time in minutes
                const orderTime = new Date(row.order_time);
                const waitingMin = Math.max(0, Math.floor((now - orderTime)/60000));
                let badgeClass = waitingMin > 10 ? "badge-red" : "badge-green";

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.order_id}</td>
                    <td>${row.item_id}</td>
                    <td>${row.item_name}</td>
                    <td>${row.quantity}</td>
                    <td><span class="badge ${badgeClass}">${waitingMin.toString().padStart(2,'0')} mins</span></td>
                    <td>${row.status}</td>
                    <td>
                        <button type="button" class="pickedup-btn" data-order-id="${row.order_id}">Mark as Complete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Optional: Handle button clicks
            document.querySelectorAll('.pickedup-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const orderId = btn.getAttribute('data-order-id');
                    // Add AJAX call to mark picked up here
                    alert('Mark as Picked Up clicked for order ID: ' + orderId);
                });
            });
        });
});