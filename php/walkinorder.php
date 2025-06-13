<?php
// Connect to your database
$host = "localhost";
$user = "root"; // default for XAMPP
$password = ""; // default is empty
$dbname = "webdev";

$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the qr_code from the URL
if (!isset($_GET['qr_code'])) {
    die("No QR code provided.");
}

$qr_code = $_GET['qr_code'];

// Get the corresponding table_id
$stmt = $conn->prepare("SELECT table_id FROM restauranttable WHERE qr_code = ?");
$stmt->bind_param("s", $qr_code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die("Invalid QR code.");
}

$row = $result->fetch_assoc();
$table_id = $row['table_id'];

// You can now use $table_id to show menu or create order
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dine-In Menu</title>
    <style>
        body {
            background: #111;
            color: white;
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        .container {
            background: #222;
            padding: 30px;
            border-radius: 10px;
            border: 2px solid orange;
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
        }
        a.button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: orange;
            color: white;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
        }
        a.button:hover {
            background-color: darkorange;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome!</h1>
        <p>You're ordering from <strong>Table #<?php echo $table_id; ?></strong></p>

        <!-- Link to menu/order page with table_id -->
        <a href="menu_page.php?table_id=<?php echo $table_id; ?>" class="button">View Menu & Start Order</a>
    </div>
</body>
</html>

