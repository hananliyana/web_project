<?php
include '../../dbConnection.php';

$order_id = $_GET['order_id'] ?? '';
if (!$order_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing order_id']);
    exit;
}

$sql = "SELECT * FROM `order` WHERE order_id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $order_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    echo json_encode($row);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Order not found']);
}
?>