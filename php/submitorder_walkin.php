<?php
require_once("dbConnection.php");
date_default_timezone_set('Asia/Kuala_Lumpur'); // Add this line
header("Content-Type: application/json");

// Read and decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

$table_id = $data['table_id'] ?? null;
$cart = $data['cart'] ?? [];
$total = $data['total_amount'] ?? 0;

$orderTime = date("Y-m-d H:i:s");
$status = "pending";
$orderType = "walkin";
$user_id = null;
$staff_id = null;
$pickupTime = null;

// Insert into `order`
$stmt = $conn->prepare("INSERT INTO `order` (user_id, staff_id, table_id, order_type, order_time, pickup_time, status, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("iiissssd", $user_id, $staff_id, $table_id, $orderType, $orderTime, $pickupTime, $status, $total);
$stmt->execute();
$order_id = $stmt->insert_id;
$stmt->close();

// Insert order items
foreach ($cart as $item) {
    $stmt = $conn->prepare("SELECT menuitem_id FROM menuitem WHERE name = ?");
    $stmt->bind_param("s", $item['name']);
    $stmt->execute();
    $stmt->bind_result($menuitem_id);
    $stmt->fetch();
    $stmt->close();

    if ($menuitem_id) {
        $stmt = $conn->prepare("INSERT INTO orderitem (order_id, menuitem_id, quantity) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $order_id, $menuitem_id, $item['qty']);
        $stmt->execute();
        $stmt->close();
    }
}

echo json_encode(["success" => true, "order_id" => $order_id]);
exit();
?>
