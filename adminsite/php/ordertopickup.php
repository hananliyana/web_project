<?php
require '../../dbConnection.php';

// Fetch all 'ready' orders and join with order_item and menuitem tables
$sql = "
    SELECT 
        o.order_id,
        o.status,
        o.order_time,
        oi.item_id,
        oi.quantity,
        mi.name AS item_name
    FROM `order` o
    JOIN orderitem oi ON o.order_id = oi.order_id
    JOIN menuitem mi ON oi.item_id = mi.item_id
    WHERE o.status = 'ready'
    ORDER BY o.order_id DESC, oi.item_id ASC
";

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