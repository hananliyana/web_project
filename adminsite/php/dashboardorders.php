<?php
// dashboardorders.php - returns live order activity for today as JSON
include '../../dbConnection.php';

$today = date('Y-m-d');
$sql = "SELECT o.order_id, o.status, o.order_time
        FROM `order` o
        WHERE DATE(o.order_time) = '$today'
        ORDER BY o.order_time DESC
        LIMIT 20";
$result = mysqli_query($conn, $sql);

$orders = [];
while ($row = mysqli_fetch_assoc($result)) {
    // Format time (e.g., 1:32 PM)
    $row['order_time_formatted'] = date('g:i A', strtotime($row['order_time']));
    $orders[] = $row;
}
echo json_encode($orders);
?>