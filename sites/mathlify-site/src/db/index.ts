import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import {
	tysQuestions,
	techniques,
	tysQuestionsToTechniques,
	tysQuestionsTexts
} from './turso/qns-techniques';

config({ path: '.env' }); // or .env.local

const client = createClient({
	url: process.env.TURSO_CONNECTION_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN!
});

export const turso = drizzle(client, {
	schema: { ...tysQuestions, ...techniques, ...tysQuestionsToTechniques, ...tysQuestionsTexts }
});
