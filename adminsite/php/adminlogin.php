<?php
session_start();
require_once '../../dbConnection.php';
// ...rest of your code...

// For debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $stmt = $conn->prepare("SELECT * FROM staff WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows === 1) {
        $row = $result->fetch_assoc();

        // Plain text password comparison (since your DB is not hashed)
        if ($row['password'] === $password) {
            $_SESSION['username'] = $row['username'];
            header("Location: ../html/admindashboard.html");
            exit();
        } else {
            $error = "Invalid password!";
        }
    } else {
        $error = "Username not found!";
    }

    $stmt->close();
    $conn->close();

    header("Location: ../html/login.html?error=" . urlencode($error));
    exit();
} else {
    header("Location: ../html/login.html?error=" . urlencode("Invalid request"));
    exit();
}
?>