document.getElementById('checkHistoryBtn').addEventListener('click', function() {
    const email = document.getElementById('emailInput').value.trim();
    if (!email) {
        alert('Please enter your email.');
        return;
    }

    fetch('../php/get_order_history.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => {
        const box = document.getElementById('historyBox');
        const notFound = document.getElementById('historyNotFound');
        const timeline = document.getElementById('orderTimeline');
        timeline.innerHTML = '';
        if (data.orders && data.orders.length > 0) {
            data.orders.forEach(order => {
                // Choose color class based on status
                let statusClass = 'status-pending';
                if (order.status === 'success' || order.status === 'completed') statusClass = 'status-success';
                if (order.status === 'failed' || order.status === 'cancelled') statusClass = 'status-failed';

                const div = document.createElement('div');
                div.className = 'timeline-card';
                div.innerHTML = `
                    <span class="timeline-dot ${statusClass}"></span>
                    <div class="timeline-status-badge ${statusClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
                    <div class="timeline-amount">RM${Number(order.total_amount).toFixed(2)}</div>
                    <div class="timeline-date">${order.order_time}</div>
                    <div class="timeline-order-id">Order #${order.order_id}</div>
                `;
                timeline.appendChild(div);
            });
            box.style.display = '';
            notFound.style.display = 'none';
        } else {
            box.style.display = 'none';
            notFound.style.display = '';
        }
    })
    .catch(() => {
        alert('Failed to fetch order history.');
    });
});