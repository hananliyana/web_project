<?php
header('Content-Type: application/json');

// Enable error display for debugging (remove/comment out in production!)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection
$conn = new mysqli("localhost", "root", "", "webdev");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$menu = [];
$result = $conn->query("SELECT * FROM menuitem");
if ($result) {
    while($row = $result->fetch_assoc()) {
        $menu[] = $row;
    }
    echo json_encode($menu);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Query failed: ' . $conn->error]);
}
$conn->close();
?>