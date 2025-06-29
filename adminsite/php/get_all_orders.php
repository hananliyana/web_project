<?php
include '../../dbConnection.php';

// Fetch all orders
$sql = "SELECT order_id, order_time, status, order_type, payment_method FROM `order` ORDER BY order_time DESC LIMIT 100";
$result = mysqli_query($conn, $sql);

$orders = [];
while ($order = mysqli_fetch_assoc($result)) {
    $order_id = $order['order_id'];
    // Fetch order items for this order
    $item_sql = "SELECT oi.quantity, mi.name AS item_name 
                 FROM orderitem oi
                 JOIN menuitem mi ON oi.item_id = mi.item_id
                 WHERE oi.order_id = " . intval($order_id);
    $item_result = mysqli_query($conn, $item_sql);

    $items = [];
    while ($item = mysqli_fetch_assoc($item_result)) {
        $items[] = $item['quantity'] . "x " . $item['item_name'];
    }
    $order['items_summary'] = implode(', ', $items);

    // Format time
    $order['order_time_formatted'] = date('g:i A', strtotime($order['order_time']));

    $orders[] = $order;
}

echo json_encode($orders);
?>