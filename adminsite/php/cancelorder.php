<?php
require '../../dbConnection.php';

// Get the POST data (expects JSON)
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['order_id'])) {
    $order_id = $data['order_id'];

    // Update the status to 'cancel'
    $stmt = $conn->prepare("UPDATE `order` SET status = 'cancel' WHERE order_id = ?");
    $stmt->bind_param("i", $order_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Missing order_id']);
}

$conn->close();
?>