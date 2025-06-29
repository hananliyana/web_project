<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input) || !isset($input['phone']) || empty($input['phone'])) {

    echo json_encode(["success" => false, "message" => "Phone number is missing."]);
    exit;
}

$phone = $input['phone'];

include("dbConnection.php"); // adjust if path is different

// Optional: Check if user already exists
$stmt = $conn->prepare("SELECT user_id FROM user WHERE phone_number = ?");
$stmt->bind_param("s", $phone);
$stmt->execute();
$stmt->bind_result($existingId);
if ($stmt->fetch()) {
    echo json_encode(["success" => true, "user_id" => $existingId]);
    exit;
}
$stmt->close();

// Insert new user
$stmt = $conn->prepare("INSERT INTO user (phone_number) VALUES (?)");
$stmt->bind_param("s", $phone);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "user_id" => $conn->insert_id]);
} else {
    echo json_encode(["success" => false, "message" => "Insert failed: " . $stmt->error]);
}
$stmt->close();
?>
