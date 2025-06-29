-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 27, 2025 at 05:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webdev`
--

-- --------------------------------------------------------

--
-- Table structure for table `menuitem`
--

CREATE TABLE `menuitem` (
  `item_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menuitem`
--

INSERT INTO `menuitem` (`item_id`, `name`, `description`, `price`, `img`) VALUES
(1, 'Grilled Steak', 'Juicy grilled steak with rosemary', 19.99, 'steak.jpg'),
(2, 'Cheeseburger', 'Classic beef cheeseburger with fries', 12.99, 'burger.jpg'),
(3, 'Fresh Salad', 'Mixed greens with vinaigrette dressing', 9.99, 'salad.jpg'),
(4, 'BBQ Skewers', 'Grilled meat and veggie skewers', 14.99, 'skewers.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `table_id` int(11) DEFAULT NULL,
  `order_type` enum('walk-in','online') NOT NULL,
  `order_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `pickup_time` timestamp NULL DEFAULT NULL,
  `status` enum('pending','in_progress','ready','completed') DEFAULT 'pending',
  `total_amount` decimal(10,2) DEFAULT 0.00,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `customer_address` varchar(255) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`order_id`, `user_id`, `staff_id`, `table_id`, `order_type`, `order_time`, `pickup_time`, `status`, `total_amount`, `customer_name`, `customer_email`, `customer_address`, `payment_method`) VALUES
(1, NULL, NULL, NULL, 'online', '2025-06-25 22:09:53', '0000-00-00 00:00:00', 'pending', 0.00, '', '', '', ''),
(2, NULL, NULL, NULL, 'online', '2025-06-26 00:08:42', '0000-00-00 00:00:00', 'pending', 12.99, 'liyana', 'hananiliyana91@gmail.com', '123, jalan mawar', 'cod'),
(3, NULL, NULL, NULL, 'online', '2025-06-26 00:25:16', '0000-00-00 00:00:00', 'pending', 32.98, 'liyana', 'hananiliyana91@gmail.com', '123, Jalan Harmoni', 'cod'),
(4, NULL, NULL, NULL, 'online', '2025-06-26 00:26:28', '0000-00-00 00:00:00', 'pending', 32.98, 'liyana', 'hananiliyana91@gmail.com', '123, Jalan Harmoni', 'cod'),
(5, NULL, NULL, NULL, 'online', '2025-06-26 00:26:39', '0000-00-00 00:00:00', 'pending', 32.98, 'liyana', 'hananiliyana91@gmail.com', '123, Jalan Harmoni', 'cod'),
(6, NULL, NULL, NULL, 'online', '2025-06-26 00:27:57', '0000-00-00 00:00:00', 'pending', 32.98, 'liyana', 'hananiliyana91@gmail.com', '123, Jalan Harmoni', 'cod'),
(7, NULL, NULL, NULL, 'online', '2025-06-26 00:28:18', '0000-00-00 00:00:00', 'pending', 32.98, 'liyana', 'hananiliyana91@gmail.com', '123, Jalan Harmoni', 'cod'),
(8, NULL, NULL, NULL, 'online', '2025-06-26 00:34:30', '0000-00-00 00:00:00', 'pending', 32.98, 'liyana', 'hananiliyana91@gmail.com', '123, Jalan Harmoni', 'cod'),
(9, NULL, NULL, NULL, 'online', '2025-06-26 00:35:50', '0000-00-00 00:00:00', 'pending', 32.98, 'liyana', 'hananiliyana91@gmail.com', '123, Jalan Harmoni', 'cod'),
(10, NULL, NULL, NULL, 'online', '2025-06-26 00:36:54', '0000-00-00 00:00:00', 'pending', 32.98, 'liyana', 'hananiliyana91@gmail.com', '123, Jalan Harmoni', 'cod'),
(11, NULL, NULL, NULL, 'online', '2025-06-26 00:38:51', '0000-00-00 00:00:00', 'pending', 19.99, 'atin', 'hananiliyana91@gmail.com', '123, jalan mawar', 'cod'),
(12, NULL, NULL, NULL, 'online', '2025-06-26 00:42:36', '0000-00-00 00:00:00', 'pending', 19.99, 'atin', 'hananiliyana91@gmail.com', '123, jalan mawar', 'cod'),
(13, NULL, NULL, NULL, 'online', '2025-06-26 01:06:06', '0000-00-00 00:00:00', 'pending', 19.99, 'anis', 'anis@gmail.com', 'krubong', 'cod'),
(14, NULL, NULL, NULL, 'online', '2025-06-26 01:33:13', '0000-00-00 00:00:00', 'pending', 19.99, 'aida', 'aida@gmail.com', 'cheng', 'cod'),
(15, NULL, NULL, NULL, 'online', '2025-06-26 01:33:44', '0000-00-00 00:00:00', 'pending', 19.99, 'aida', 'aida@gmail.com', 'cheng', 'cod'),
(16, NULL, NULL, NULL, 'online', '2025-06-26 03:07:57', '0000-00-00 00:00:00', 'pending', 19.99, 'aida', 'hananiliyana91@gmail.com', '12, Jalan BP', 'cod'),
(17, NULL, NULL, NULL, 'online', '2025-06-26 03:23:16', '0000-00-00 00:00:00', 'pending', 32.98, 'anis', 'hananiliyana91@gmail.com', '12, jalan mawar 14', 'cod'),
(18, NULL, NULL, NULL, 'online', '2025-06-26 03:28:59', '0000-00-00 00:00:00', 'pending', 32.98, 'aida', 'aida@gmail.com', 'jalan bandar', 'cod'),
(19, NULL, NULL, NULL, 'online', '2025-06-26 03:30:14', '0000-00-00 00:00:00', 'pending', 32.98, 'aida', 'aida@gmail.com', 'jalan bandar', 'cod'),
(20, NULL, NULL, NULL, 'online', '2025-06-26 03:33:58', '0000-00-00 00:00:00', 'pending', 32.98, 'aida', 'aida@gmail.com', 'jalan bandar', 'cod'),
(21, NULL, NULL, NULL, 'online', '2025-06-26 03:39:33', '0000-00-00 00:00:00', 'pending', 19.98, 'anis', 'anis@gmail.com', '90, DT Bukit Tambun', 'cod'),
(22, NULL, NULL, NULL, 'online', '2025-06-26 03:43:06', '0000-00-00 00:00:00', 'pending', 19.98, 'anis', 'anis@gmail.com', '12, taman nuri', 'cod'),
(23, NULL, NULL, NULL, 'online', '2025-06-26 03:55:32', '0000-00-00 00:00:00', 'pending', 14.99, 'yana', 'hananiliyana@gmail.com', '78, jalan sp', 'qr'),
(24, NULL, NULL, NULL, 'online', '2025-06-26 03:58:26', '0000-00-00 00:00:00', 'pending', 14.99, 'yana', 'hananiliyana@gmail.com', '78, jalan sp', 'qr'),
(25, NULL, NULL, NULL, 'online', '2025-06-26 03:58:48', '0000-00-00 00:00:00', 'pending', 14.99, 'yana', 'hananiliyana@gmail.com', '78, jalan sp', 'qr'),
(26, NULL, NULL, NULL, 'online', '2025-06-26 04:00:19', '0000-00-00 00:00:00', 'pending', 14.99, 'yana', 'hananiliyana@gmail.com', '78, jalan sp', 'qr'),
(27, NULL, NULL, NULL, 'online', '2025-06-26 04:03:13', '0000-00-00 00:00:00', 'pending', 24.98, 'aida', 'aida@gmail.com', 'paya rumput', 'cod'),
(28, NULL, NULL, NULL, 'online', '2025-06-26 05:57:26', '0000-00-00 00:00:00', 'pending', 47.97, 'yana', 'yana10@gmail.com', 'dt', 'cod'),
(29, NULL, NULL, NULL, 'online', '2025-06-26 05:57:37', '0000-00-00 00:00:00', 'pending', 47.97, 'yana', 'yana10@gmail.com', 'dt', 'cod'),
(30, NULL, NULL, NULL, 'online', '2025-06-26 05:58:26', '0000-00-00 00:00:00', 'pending', 47.97, 'yana', 'yana10@gmail.com', 'dt', 'cod'),
(31, NULL, NULL, NULL, 'online', '2025-06-26 06:01:31', '0000-00-00 00:00:00', 'pending', 47.97, 'hana', 'hana@gmail.com', 'dt', 'qr'),
(32, NULL, NULL, NULL, 'online', '2025-06-26 06:03:13', '0000-00-00 00:00:00', 'pending', 47.97, 'hana', 'hana@gmail.com', 'dt', 'qr'),
(33, NULL, NULL, NULL, 'online', '2025-06-26 06:08:53', '0000-00-00 00:00:00', 'pending', 47.97, 'hana', 'hana@gmail.com', 'hana', 'qr'),
(34, NULL, NULL, NULL, 'online', '2025-06-26 06:10:02', '0000-00-00 00:00:00', 'pending', 47.97, 'hana', 'hana@gmail.com', 'hana', 'qr'),
(35, NULL, NULL, NULL, 'online', '2025-06-26 06:10:05', '0000-00-00 00:00:00', 'pending', 47.97, 'hana', 'hana@gmail.com', 'hana', 'qr'),
(36, NULL, NULL, NULL, 'online', '2025-06-26 06:16:57', '0000-00-00 00:00:00', 'pending', 47.97, 'hana', 'hana@gmail.com', 'hana', 'qr'),
(37, NULL, NULL, NULL, 'online', '2025-06-26 06:17:31', '0000-00-00 00:00:00', 'pending', 47.97, 'hana', 'hana@gmail.com', 'hana', 'qr'),
(38, NULL, NULL, NULL, 'online', '2025-06-26 06:18:43', '0000-00-00 00:00:00', 'pending', 47.97, 'hana', 'hana@gmail.com', 'hana', 'qr'),
(39, NULL, NULL, NULL, 'online', '2025-06-26 06:19:54', '0000-00-00 00:00:00', 'pending', 47.97, 'hana', 'hana@gmail.com', '12, jalan kira', 'cod'),
(40, NULL, NULL, NULL, 'online', '2025-06-26 06:20:42', '0000-00-00 00:00:00', 'pending', 47.97, 'hana', 'hana@gmail.com', '12, jalan kira', 'cod'),
(41, NULL, NULL, NULL, 'online', '2025-06-26 17:05:52', '0000-00-00 00:00:00', 'pending', 34.98, 'fatin', 'hananiliyana91@gmail.com', '78, jalan bukit tambun', 'cod'),
(42, NULL, NULL, NULL, 'online', '2025-06-26 17:17:22', '0000-00-00 00:00:00', 'pending', 34.98, 'fatin', 'fatin@gmail.com', '34, Jalan bukit tambun', 'qr'),
(43, NULL, NULL, NULL, 'online', '2025-06-26 17:22:00', '0000-00-00 00:00:00', 'pending', 12.99, 'yana', 'yana@gmail.com', '85, jlan TAR', 'cod'),
(44, NULL, NULL, NULL, 'online', '2025-06-26 20:57:57', '0000-00-00 00:00:00', 'pending', 27.98, 'Husna', 'husna@test.com', 'DT429', 'qr'),
(45, NULL, NULL, NULL, 'online', '2025-06-26 21:15:52', '0000-00-00 00:00:00', 'pending', 27.98, 'Husna', 'husna@test.com', 'DT429', 'qr'),
(46, NULL, NULL, NULL, 'online', '2025-06-26 21:22:10', '0000-00-00 00:00:00', 'pending', 27.98, 'Husna', 'husna@test.com', 'DT429', 'qr'),
(47, NULL, NULL, NULL, 'online', '2025-06-26 21:31:44', '0000-00-00 00:00:00', 'pending', 27.98, 'Husna', 'husna@test.com', 'DT429', 'qr'),
(48, NULL, NULL, NULL, 'online', '2025-06-26 21:32:30', '0000-00-00 00:00:00', 'pending', 27.98, 'husna', 'husna@gmail.com', 'fksj', 'qr'),
(49, NULL, NULL, NULL, 'online', '2025-06-26 21:39:36', '0000-00-00 00:00:00', 'pending', 27.98, 'husna', 'husna@gmail.com', 'dt429', 'qr'),
(50, NULL, NULL, NULL, 'online', '2025-06-26 21:43:20', '0000-00-00 00:00:00', 'pending', 27.98, 'husna', 'husna@gmail.com', 'dt429', 'qr'),
(51, NULL, NULL, NULL, 'online', '2025-06-26 21:44:17', '0000-00-00 00:00:00', 'pending', 12.99, 'husna', 'husna@gmail.com', 'dt429', 'qr');

-- --------------------------------------------------------

--
-- Table structure for table `orderhistory`
--

CREATE TABLE `orderhistory` (
  `history_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orderitem`
--

CREATE TABLE `orderitem` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitem`
--

INSERT INTO `orderitem` (`order_item_id`, `order_id`, `item_id`, `quantity`, `subtotal`) VALUES
(1, 16, 1, 1, 19.99),
(2, 17, 1, 1, 19.99),
(3, 17, 2, 1, 12.99),
(4, 18, 1, 1, 19.99),
(5, 18, 2, 1, 12.99),
(6, 19, 1, 1, 19.99),
(7, 19, 2, 1, 12.99),
(8, 20, 1, 1, 19.99),
(9, 20, 2, 1, 12.99),
(10, 21, 3, 2, 19.98),
(11, 22, 3, 2, 19.98),
(12, 23, 4, 1, 14.99),
(13, 24, 4, 1, 14.99),
(14, 25, 4, 1, 14.99),
(15, 26, 4, 1, 14.99),
(16, 27, 4, 1, 14.99),
(17, 27, 3, 1, 9.99);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `card_number` int(11) NOT NULL,
  `card_name` varchar(50) NOT NULL,
  `card_type` enum('mastercard','visa') DEFAULT 'mastercard',
  `status` enum('pending','paid') DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `restauranttable`
--

CREATE TABLE `restauranttable` (
  `table_id` int(11) NOT NULL,
  `qr_code` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `password` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tblcomment`
--

CREATE TABLE `tblcomment` (
  `userID` int(6) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `email` varchar(30) NOT NULL,
  `gender` varchar(1) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblcomment`
--

INSERT INTO `tblcomment` (`userID`, `userName`, `email`, `gender`, `comment`) VALUES
(0, 'Ahmad', 'ahmad@utem.edu.my', 'M', 'Congratulations');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `phone_number` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `phone_number`) VALUES
(1, '0123456789');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menuitem`
--
ALTER TABLE `menuitem`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `table_id` (`table_id`);

--
-- Indexes for table `orderhistory`
--
ALTER TABLE `orderhistory`
  ADD PRIMARY KEY (`history_id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `order_id` (`order_id`);

--
-- Indexes for table `restauranttable`
--
ALTER TABLE `restauranttable`
  ADD PRIMARY KEY (`table_id`),
  ADD UNIQUE KEY `qr_code` (`qr_code`) USING HASH;

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`);

--
-- Indexes for table `tblcomment`
--
ALTER TABLE `tblcomment`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menuitem`
--
ALTER TABLE `menuitem`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `orderhistory`
--
ALTER TABLE `orderhistory`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `restauranttable`
--
ALTER TABLE `restauranttable`
  MODIFY `table_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`),
  ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`table_id`) REFERENCES `restauranttable` (`table_id`);

--
-- Constraints for table `orderhistory`
--
ALTER TABLE `orderhistory`
  ADD CONSTRAINT `orderhistory_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`),
  ADD CONSTRAINT `orderhistory_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `orderitem_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`),
  ADD CONSTRAINT `orderitem_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `menuitem` (`item_id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
