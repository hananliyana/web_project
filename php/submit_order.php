<?php
require_once("dbConnection.php");

// DEBUGGING ENABLED
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get POST data
$customer_name    = $_POST['custName'] ?? '';
$customer_email   = $_POST['email'] ?? '';
$pickup_time      = $_POST['pickupTime'] ?? '';
$customer_address = $_POST['address'] ?? '';
$payment_method   = $_POST['paymentMethod'] ?? '';
$orderData        = $_POST['orderData'] ?? '';
$orderitem       = json_decode($orderData, true);
$order_time       = date("Y-m-d H:i:s");
$status           = "pending";
$order_type       = "online";

// Validate order items
if (!$orderitem || !is_array($orderitem) || count($orderitem) === 0) {
    echo json_encode(['error' => 'No items in order or invalid cart data.']);
    exit;
}

// Calculate total amount
$total_amount = 0;
foreach ($orderitem as $item) {
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
    $item_id = $item['item_id'] ?? null; // changed from 'id' to 'item_id'
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

// OPTIONAL: Email receipt
$subject = "Restoran Order Receipt";
$message = "Thank you for your order!\n\n";
$message .= "Order Date: $order_time\n";
$message .= "Pickup Time: $pickup_time\n";
if ($customer_address) $message .= "Shipping Address: $customer_address\n";
$message .= "Payment Method: " . ($payment_method == "qr" ? "QR Code" : "Cash on Delivery") . "\n";
$message .= "Order Status: $status\n\n";
$message .= "Items:\n";
foreach ($orderItems as $item) {
    $message .= $item['name'] . " x" . $item['qty'] . " - RM" . number_format($item['price'] * $item['qty'], 2) . "\n";
}
$message .= "\nTotal: RM" . number_format($total_amount, 2);

// mail($customer_email, $subject, $message); // optional

// Respond with order_id
echo json_encode(['order_id' => $order_id]);
exit;
?>
