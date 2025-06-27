<?php
require '../../dbConnection.php';

// Fetch only 'in_progress' orders
$sql = "SELECT order_id, user_id, staff_id, table_id, order_time, status, total_amount FROM `order` WHERE status = 'in_progress'";
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