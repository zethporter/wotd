CREATE TABLE `voters` (
	`id` text PRIMARY KEY NOT NULL,
	`fingerptint` text NOT NULL,
	`email` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`voted_on` text
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` text PRIMARY KEY NOT NULL,
	`voter_id` text,
	`wrestler_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`voter_id`) REFERENCES `voters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`wrestler_id`) REFERENCES `wrestlers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `wrestlers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`school` text NOT NULL
);
