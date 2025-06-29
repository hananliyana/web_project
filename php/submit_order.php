<?php
require_once("dbConnection.php");

// DEBUGGING ENABLED
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Read JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Check and extract order data
$customer_name    = $data['custName'] ?? '';
$customer_email   = $data['email'] ?? '';
$pickup_time      = $data['pickupTime'] ?? '';
$customer_address = $data['address'] ?? '';
$payment_method   = $data['paymentMethod'] ?? '';
$orderItems       = $data['cart'] ?? [];
$order_time       = date("Y-m-d H:i:s");
$status           = "pending";
$order_type       = "online";

// Validate order items
if (!$orderItems || !is_array($orderItems) || count($orderItems) === 0) {
    echo json_encode(['error' => 'No items in order or invalid cart data.']);
    exit;
}

// Calculate total amount
$total_amount = 0;
foreach ($orderItems as $item) {
    if (!isset($item['price'], $item['qty'])) {
        echo json_encode(['error' => 'Missing item data in cart.']);
        exit;
    }
    $total_amount += $item['price'] * $item['qty'];
}

// Insert order into `order` table (use backticks!)
$user_id = null;
$staff_id = null;
$table_id = null;

$stmt = $conn->prepare("INSERT INTO `order` 
    (user_id, staff_id, table_id, order_type, order_time, pickup_time, status, total_amount, customer_name, customer_email, customer_address, payment_method) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(['error' => 'Order insert prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param(
    "iiissssdssss", 
    $user_id, $staff_id, $table_id, $order_type, $order_time, $pickup_time, $status, $total_amount, 
    $customer_name, $customer_email, $customer_address, $payment_method
);

if (!$stmt->execute()) {
    echo json_encode(['error' => 'Order insert execute failed: ' . $stmt->error]);
    exit;
}
$order_id = $stmt->insert_id;
$stmt->close();

// Insert each item into orderitem table
foreach ($orderItems as $item) {
    $item_id = $item['item_id'] ?? null; // Should match your cart key
    $quantity = $item['qty'];
    $subtotal = $item['price'] * $quantity;

    if (!$item_id) {
        echo json_encode(['error' => 'Missing menu item ID.']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO orderitem (order_id, item_id, quantity, subtotal) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(['error' => 'Order item prepare failed: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param("iiid", $order_id, $item_id, $quantity, $subtotal);
    if (!$stmt->execute()) {
        echo json_encode(['error' => 'Order item insert failed: ' . $stmt->error]);
        exit;
    }
    $stmt->close();
}

// Respond with order_id
echo json_encode(['order_id' => $order_id]);
exit;
?>