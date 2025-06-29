<?php
include '../../dbConnection.php';

$order_id = $_GET['order_id'] ?? '';
if (!$order_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing order_id']);
    exit;
}

// Fetch order basic info
$sql = "SELECT order_id, order_time, status, order_type, payment_method FROM `order` WHERE order_id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $order_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($order = mysqli_fetch_assoc($result)) {
    $order['order_time_formatted'] = date('g:i A', strtotime($order['order_time']));
    // Fetch items for this order
    $items = [];
    $item_sql = "SELECT oi.quantity, mi.name AS item_name, mi.price 
                 FROM orderitem oi
                 JOIN menuitem mi ON oi.item_id = mi.item_id
                 WHERE oi.order_id = " . intval($order_id);
    $item_result = mysqli_query($conn, $item_sql);

    while ($item = mysqli_fetch_assoc($item_result)) {
        $items[] = [
            'qty' => $item['quantity'],
            'name' => $item['item_name'],
            'price' => $item['price']
        ];
    }
    $order['items'] = $items;

    echo json_encode($order);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Order not found']);
}
?>