<?php
require_once("dbConnection.php");

$order_id = $_GET['order_id'] ?? 0;
$order_id = intval($order_id);

$order = null;
if ($order_id > 0) {
    // Get order info
    $stmt = $conn->prepare("SELECT order_id, order_time, pickup_time, status, total_amount FROM `order` WHERE order_id = ?");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $stmt->bind_result($oid, $order_time, $pickup_time, $status, $total_amount);
    if ($stmt->fetch()) {
        $order = [
            "order_id" => $oid,
            "order_time" => $order_time,
            "pickup_time" => $pickup_time,
            "status" => $status,
            "total_amount" => floatval($total_amount),
            "items" => []
        ];
    }
    $stmt->close();

    if ($order) {
        // Get order items
        $stmt = $conn->prepare(
            "SELECT m.name, oi.quantity, m.price
             FROM orderitem oi
             JOIN menuitem m ON oi.menuitem_id = m.menuitem_id
             WHERE oi.order_id = ?"
        );
        $stmt->bind_param("i", $order_id);
        $stmt->execute();
        $stmt->bind_result($item_name, $qty, $price);
        while ($stmt->fetch()) {
            $order["items"][] = [
                "name" => $item_name,
                "qty" => intval($qty),
                "price" => floatval($price)
            ];
        }
        $stmt->close();
    }
}

// Optionally add customer name if you store it in the order table
header('Content-Type: application/json');
echo json_encode($order);
?>