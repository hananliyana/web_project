<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once("dbConnection.php");

$menu = [];
$result = $conn->query("SELECT item_id, name, price, description, img FROM menuitem");
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
exit;
?>