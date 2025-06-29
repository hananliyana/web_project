document.addEventListener('DOMContentLoaded', function () {
    let ordersData = [];
    let currentSort = 'date';

    fetch('../php/orderhistory.php')
        .then(response => response.json())
        .then(data => {
            ordersData = data;
            renderTable(sortOrders(ordersData, currentSort));
        });

    function renderTable(data) {
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
                // Show modal
                const modalOverlay = document.getElementById('modal-overlay');
                if (modalOverlay) {
                    modalOverlay.style.display = 'flex';
                    document.getElementById('modal-order-id').textContent = '#' + orderId;
                    // Only show items, clear others if they exist
                    const itemsList = document.getElementById('modal-items-list');
                    itemsList.innerHTML = '<li>Loading...</li>';
                    // Hide or clear other sections if your modal has them
                    if(document.getElementById('modal-time-taken')) document.getElementById('modal-time-taken').textContent = '';
                    if(document.getElementById('modal-notes')) document.getElementById('modal-notes').textContent = '';
                    if(document.getElementById('modal-payment')) document.getElementById('modal-payment').textContent = '';
                    // Fetch order item details
                    fetch(`../php/orderitems.php?order_id=${encodeURIComponent(orderId)}`)
                        .then(res => res.json())
                        .then(items => {
                            itemsList.innerHTML = '';
                            if (Array.isArray(items) && items.length > 0) {
                                items.forEach(item => {
                                    const li = document.createElement('li');
                                    li.innerHTML = `
                                        <strong>${item.name}</strong> x${item.quantity} 
                                        (${item.price ? 'RM' + parseFloat(item.price).toFixed(2) : ''})
                                        <br>
                                        <em>${item.description ?? ''}</em>
                                    `;
                                    itemsList.appendChild(li);
                                });
                            } else {
                                itemsList.innerHTML = '<li>No items info available</li>';
                            }
                        })
                        .catch(() => {
                            itemsList.innerHTML = '<li>Failed to load items</li>';
                        });
                }
            });
        });

        const closeModal = document.getElementById('close-modal');
        if(closeModal) {
            closeModal.onclick = function() {
                document.getElementById('modal-overlay').style.display = 'none';
            };
        }
    }

    function sortOrders(data, sortBy) {
        const sorted = [...data];
        switch(sortBy) {
            case 'date':
                sorted.sort((a, b) => new Date(b.order_time) - new Date(a.order_time));
                break;
            case 'price':
                sorted.sort((a, b) => parseFloat(b.total_amount) - parseFloat(a.total_amount));
                break;
            case 'type':
                sorted.sort((a, b) => {
                    if ((a.order_type ?? '') < (b.order_type ?? '')) return -1;
                    if ((a.order_type ?? '') > (b.order_type ?? '')) return 1;
                    return 0;
                });
                break;
        }
        return sorted;
    }

    // Search bar function: Only search by order_id
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim();
        let filtered = ordersData;
        if (searchTerm !== '') {
            filtered = ordersData.filter(order =>
                order.order_id && order.order_id.toString().includes(searchTerm)
            );
        }
        renderTable(sortOrders(filtered, currentSort));
    });

    // Sort dropdown handler
    const sortSelect = document.querySelector('.sort-select');
    sortSelect.addEventListener('change', function () {
        currentSort = sortSelect.value;
        const searchTerm = searchInput.value.trim();
        let filtered = ordersData;
        if (searchTerm !== '') {
            filtered = ordersData.filter(order =>
                order.order_id && order.order_id.toString().includes(searchTerm)
            );
        }
        renderTable(sortOrders(filtered, currentSort));
    });
});