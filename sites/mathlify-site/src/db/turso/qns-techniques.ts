import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const tysQuestions = sqliteTable('tys_questions', {
	id: text('id').primaryKey(),
	year: integer('year').notNull(),
	paper: integer('paper').notNull(),
	question: integer('question').notNull(),
	part: integer('part').notNull(),
	subpart: integer('subpart')
});

export const techniques = sqliteTable('techniques', {
	id: text('id').primaryKey(),
	topic: text('topic').notNull(),
	section: text('section').notNull(),
	subsection: text('subsection').notNull(),
	variant: integer('variant')
});

export const tysQuestionsToTechniques = sqliteTable('tys_questions_to_techniques', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	question: text('question').references(() => tysQuestions.id),
	technique: text('technique').references(() => techniques.id)
});
