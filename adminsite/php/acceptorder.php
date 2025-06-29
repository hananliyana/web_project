<?php
require '../../dbConnection.php';

$data = json_decode(file_get_contents("php://input"), true);
$order_id = $data['order_id'];

$stmt = $conn->prepare("UPDATE `order` SET status = 'in_progress' WHERE order_id = ?");
$stmt->bind_param("i", $order_id);
$success = $stmt->execute();

header('Content-Type: application/json');
echo json_encode(['success' => $success]);
?>