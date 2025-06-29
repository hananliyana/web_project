<?php
require '../../dbConnection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $order_id = $_POST['order_id'] ?? '';

    if ($order_id !== '') {
        $stmt = $conn->prepare("UPDATE `order` SET status = 'completed' WHERE order_id = ?");
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
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
?>