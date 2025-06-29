<?php
require '../../dbConnection.php';

// Fetch only 'completed' and 'cancel' orders
$sql = "SELECT order_id, user_id, staff_id, table_id, order_type, order_time, status, total_amount, payment_method FROM `order` WHERE status IN ('completed', 'cancel')";
$result = $conn->query($sql);

$orders = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($orders);
?>