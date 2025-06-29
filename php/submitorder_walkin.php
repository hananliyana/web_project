<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once("dbConnection.php");
date_default_timezone_set('Asia/Kuala_Lumpur');
header("Content-Type: application/json");

// Step 0: Parse JSON input safely
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    exit();
}

// Step 1: Extract and validate input data
$table_id = $data['table_id'] ?? null;
$cart = $data['cart'] ?? [];
$total = $data['total_amount'] ?? 0;
$orderTime = date("Y-m-d H:i:s");
$orderType = "walkin";
$status = "pending";
$user_id = $data['user_id'] ?? null;

$staff_id = null;
$pickupTime = null;
$customer_name = null;
$customer_email = null;
$payment_method = "counter";
$customer_address = null;

// Check for required fields
if (!$user_id || !$table_id || empty($cart)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

// Step 2: Insert into `order`
$stmt = $conn->prepare("INSERT INTO `order` 
    (user_id, staff_id, table_id, order_type, pickup_time, order_time, status, total_amount, customer_name, customer_email, payment_method, customer_address) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit();
}

$stmt->bind_param("iiissssdssss", 
    $user_id, 
    $staff_id, 
    $table_id, 
    $orderType,        // Correct position for order_type
    $pickupTime,       // Comes AFTER order_type
    $orderTime, 
    $status, 
    $total, 
    $customer_name, 
    $customer_email, 
    $payment_method, 
    $customer_address
);


if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Execute failed: " . $stmt->error]);
    $stmt->close();
    exit();
}

$order_id = $stmt->insert_id;
$stmt->close();

// Step 3: Insert each order item
foreach ($cart as $item) {
    $itemName = $item['name'];
    $qty = $item['qty'];

    // Lookup item ID and price
    $stmt = $conn->prepare("SELECT item_id, price FROM menuitem WHERE name = ?");
    $stmt->bind_param("s", $itemName);
    $stmt->execute();
    $stmt->bind_result($item_id, $price);
    
    if ($stmt->fetch()) {
        $stmt->close();
        $subtotal = $qty * $price;

        $stmt = $conn->prepare("INSERT INTO orderitem (order_id, item_id, quantity, subtotal) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iiid", $order_id, $item_id, $qty, $subtotal);
        if (!$stmt->execute()) {
            error_log("Failed to insert order item: " . $stmt->error);
        }
        $stmt->close();
    } else {
        error_log("Menu item not found: $itemName");
        $stmt->close();
    }
}

// Step 4: Respond with success
echo json_encode(["success" => true, "order_id" => $order_id]);
exit();
?>
