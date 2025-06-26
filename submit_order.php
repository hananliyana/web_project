<?php
require_once("dbConnection.php");

// Get POST data
$name = $_POST['custName'] ?? '';
$email = $_POST['email'] ?? '';
$pickupTime = $_POST['pickupTime'] ?? '';
$address = $_POST['address'] ?? '';
$paymentMethod = $_POST['paymentMethod'] ?? '';
$orderData = $_POST['orderData'] ?? '';
$orderItems = json_decode($orderData, true);
$orderTime = date("Y-m-d H:i:s");
$status = "pending";
$orderType = "online";

// Calculate total
$total = 0;
foreach ($orderItems as $item) {
    $total += $item['price'] * $item['qty'];
}

// Insert order
$stmt = $conn->prepare("INSERT INTO `order` (user_id, staff_id, table_id, order_type, order_time, pickup_time, status, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$user_id = null; // Set if user is logged in, otherwise NULL
$staff_id = null;
$table_id = null;
$stmt->bind_param("iiissssd", $user_id, $staff_id, $table_id, $orderType, $orderTime, $pickupTime, $status, $total);
$stmt->execute();
$order_id = $stmt->insert_id;
$stmt->close();

// Insert order items
foreach ($orderItems as $item) {
    // Get menuitem_id by name
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

// Optionally: Save address and payment method in another table or add columns to `order` table

// Send email receipt to customer
$subject = "Restoran Order Receipt";
$message = "Thank you for your order!\n\n";
$message .= "Order Date: $orderTime\n";
$message .= "Pickup Time: $pickupTime\n";
if ($address) $message .= "Shipping Address: $address\n";
$message .= "Payment Method: " . ($paymentMethod == "qr" ? "QR Code" : "Cash on Delivery") . "\n";
$message .= "Order Status: $status\n\n";
$message .= "Items:\n";
foreach ($orderItems as $item) {
    $message .= "{$item['name']} x{$item['qty']} - RM" . number_format($item['price'] * $item['qty'], 2) . "\n";
}
$message .= "\nWe will notify you when your order is ready for pickup.";

mail($email, $subject, $message);

// Redirect to a confirmation page
header("Location: ../html/confirmation.html?success=1");
exit();
?>