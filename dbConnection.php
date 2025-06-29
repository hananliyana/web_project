<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "webdev";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $database);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Connection successful
// Remove the line below in production to avoid exposing connection status
// echo "Connected to database";
?>