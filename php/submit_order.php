<?php
require_once("dbConnection.php");

// ENABLE ERROR REPORTING FOR DEBUGGING (remove for production)
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
$orderItems       = json_decode($orderData, true);
$order_time       = date("Y-m-d H:i:s");
$status           = "pending";
$order_type       = "online";

// Calculate total amount
$total_amount = 0;
foreach ($orderItems as $item) {
    $total_amount += $item['price'] * $item['qty'];
}

// Insert order with customer info and payment method
$user_id  = null; // Set if user is logged in, otherwise NULL
$staff_id = null;
$table_id = null;

$stmt = $conn->prepare("INSERT INTO `order` 
    (user_id, staff_id, table_id, order_type, order_time, pickup_time, status, total_amount, customer_name, customer_email, customer_address, payment_method) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    die("Prepare failed: (" . $conn->errno . ") " . $conn->error);
}
$stmt->bind_param(
    "iiissssdssss", 
    $user_id, $staff_id, $table_id, $order_type, $order_time, $pickup_time, $status, $total_amount, 
    $customer_name, $customer_email, $customer_address, $payment_method
);
if (!$stmt->execute()) {
    die("Order Insert failed: (" . $stmt->errno . ") " . $stmt->error);
}
$order_id = $stmt->insert_id;
$stmt->close();

// Insert order items (orderitem table)
foreach ($orderItems as $item) {
    $menuitem_id = $item['menuitem_id'] ?? null;
    if (!$menuitem_id && !empty($item['name'])) {
        $stmt = $conn->prepare("SELECT item_id FROM menuitem WHERE name = ? LIMIT 1");
        $stmt->bind_param("s", $item['name']);
        $stmt->execute();
        $stmt->bind_result($menuitem_id);
        $stmt->fetch();
        $stmt->close();
    }

    if ($menuitem_id) {
        $itemPrice = $item['price'] * $item['qty']; // subtotal
        $stmt = $conn->prepare("INSERT INTO orderitem (order_id, item_id, quantity, subtotal) VALUES (?, ?, ?, ?)");
        if (!$stmt) {
            die("Prepare failed: (" . $conn->errno . ") " . $conn->error);
        }
        $stmt->bind_param("iiid", $order_id, $menuitem_id, $item['qty'], $itemPrice);
        if (!$stmt->execute()) {
            die("OrderItem Insert failed: (" . $stmt->errno . ") " . $stmt->error);
        }
        $stmt->close();
    }
} // <-- This closes the foreach loop

// Send email receipt to customer (optional)
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

// mail($customer_email, $subject, $message); // Uncomment to send email

// Redirect to a PHP confirmation page with order_id for displaying the receipt
header("Location: ../php/confirmation.php?order_id=" . urlencode($order_id));
exit();
?>