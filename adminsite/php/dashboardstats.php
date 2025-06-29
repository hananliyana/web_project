<?php
// dashboardstats.php - returns dashboard summary stats as JSON
include '../../dbConnection.php';

// Today's date (adjust for your timezone if needed)
$today = date('Y-m-d');

// Total orders today
$totalOrdersRes = mysqli_query($conn, "SELECT COUNT(*) AS total FROM `order` WHERE DATE(order_time) = '$today'");
$totalOrders = mysqli_fetch_assoc($totalOrdersRes)['total'] ?? 0;

// Pending orders
$pendingOrdersRes = mysqli_query($conn, "SELECT COUNT(*) AS total FROM `order` WHERE status = 'pending' AND DATE(order_time) = '$today'");
$pendingOrders = mysqli_fetch_assoc($pendingOrdersRes)['total'] ?? 0;

// In progress orders
$inprogressOrdersRes = mysqli_query($conn, "SELECT COUNT(*) AS total FROM `order` WHERE (status = 'in_progress' OR status = 'in progress') AND DATE(order_time) = '$today'");
$inprogressOrders = mysqli_fetch_assoc($inprogressOrdersRes)['total'] ?? 0;

// Ready for pickup
$readyOrdersRes = mysqli_query($conn, "SELECT COUNT(*) AS total FROM `order` WHERE (status = 'ready' OR status = 'Ready for Pickup' OR status = 'To Pickup') AND DATE(order_time) = '$today'");
$readyOrders = mysqli_fetch_assoc($readyOrdersRes)['total'] ?? 0;

// Total revenue today
$totalRevenueRes = mysqli_query($conn, "SELECT SUM(total_amount) AS total FROM `order` WHERE DATE(order_time) = '$today'");
$totalRevenue = mysqli_fetch_assoc($totalRevenueRes)['total'] ?? 0;

echo json_encode([
    'total_orders_today' => $totalOrders,
    'pending_orders' => $pendingOrders,
    'inprogress_orders' => $inprogressOrders,
    'ready_orders' => $readyOrders,
    'total_revenue_today' => $totalRevenue
]);
?>