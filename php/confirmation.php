<?php
require_once("dbConnection.php");
header('Content-Type: application/json');

$order_id = $_GET['order_id'] ?? null;

if (!$order_id) {
    echo json_encode(['error' => 'Missing order ID']);
    exit;
}

// Fetch order
$stmt = $conn->prepare("SELECT * FROM `order` WHERE order_id = ?");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();
$order = $result->fetch_assoc();
$stmt->close();

if (!$order) {
    echo json_encode(['error' => 'Order not found']);
    exit;
}

// Fetch order items
$stmt = $conn->prepare("
    SELECT oi.quantity, oi.subtotal, mi.name 
    FROM orderitem oi 
    JOIN menuitem mi ON oi.item_id = mi.item_id 
    WHERE oi.order_id = ?
");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$items_result = $stmt->get_result();

$order_items = [];
while ($row = $items_result->fetch_assoc()) {
    $order_items[] = $row;
}

echo json_encode([
    'order' => $order,
    'order_items' => $order_items
]);
?>
