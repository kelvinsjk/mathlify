CREATE TABLE `techniques` (
	`id` text PRIMARY KEY NOT NULL,
	`topic` text NOT NULL,
	`section` text NOT NULL,
	`subsection` text NOT NULL,
	`variant` integer
);
--> statement-breakpoint
CREATE TABLE `tys_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`paper` integer NOT NULL,
	`question` integer NOT NULL,
	`part` integer NOT NULL,
	`subpart` integer
);
--> statement-breakpoint
CREATE TABLE `tys_questions_to_techniques` (
	`id` text PRIMARY KEY NOT NULL,
	`question` text,
	`technique` text,
	FOREIGN KEY (`question`) REFERENCES `tys_questions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`technique`) REFERENCES `techniques`(`id`) ON UPDATE no action ON DELETE no action
);
