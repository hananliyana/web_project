<?php
require_once("dbConnection.php");
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if (!$email) {
    echo json_encode(['orders' => []]);
    exit;
}

$stmt = $conn->prepare("SELECT order_id, order_time, status, total_amount FROM `order` WHERE customer_email = ? ORDER BY order_time DESC");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}
$stmt->close();

echo json_encode(['orders' => $orders]);
exit;
?>