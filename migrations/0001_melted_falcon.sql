ALTER TABLE `voters` RENAME COLUMN "fingerptint" TO "fingerprint";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`voter_id` text,
	`wrestler_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`voter_id`) REFERENCES `voters`(`fingerprint`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`wrestler_id`) REFERENCES `wrestlers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_votes`("id", "voter_id", "wrestler_id", "created_at") SELECT "id", "voter_id", "wrestler_id", "created_at" FROM `votes`;--> statement-breakpoint
DROP TABLE `votes`;--> statement-breakpoint
ALTER TABLE `__new_votes` RENAME TO `votes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;