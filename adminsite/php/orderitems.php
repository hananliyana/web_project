<?php
include '../../dbConnection.php'; // Make sure the path is correct!

$order_id = $_GET['order_id'] ?? '';
if (!$order_id) {
    echo json_encode([]);
    exit;
}

$stmt = $conn->prepare("
    SELECT oi.item_id, oi.quantity, oi.subtotal, mi.name, mi.price, mi.description, mi.img
    FROM orderitem oi
    JOIN menuitem mi ON oi.item_id = mi.item_id
    WHERE oi.order_id = ?
");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}
echo json_encode($items);
?>