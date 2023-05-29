CREATE TABLE `achievement` (
	`id` int unsigned NOT NULL AUTO_INCREMENT,
	`session_id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`path` varchar(255),
	`created_at` timestamp NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`id`),
	UNIQUE KEY `session_id` (`session_id`, `name`, `category`)
) ENGINE InnoDB,
  CHARSET utf8mb4,
  COLLATE utf8mb4_0900_ai_ci;