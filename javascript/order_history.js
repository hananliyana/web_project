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
        const tbody = document.querySelector('#historyTable tbody');
        tbody.innerHTML = '';
        if (data.orders && data.orders.length > 0) {
            data.orders.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${order.order_id}</td>
                    <td>${order.order_time}</td>
                    <td>${order.status}</td>
                    <td>${Number(order.total_amount).toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
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