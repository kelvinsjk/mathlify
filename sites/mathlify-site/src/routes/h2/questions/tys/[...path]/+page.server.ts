import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { h2_tys_questionsSequential as sequential } from '$lib/components/nav';
import { turso } from '$db';
import { tysQuestionsTexts } from '$db/turso/qns-techniques';
import { questionSchema } from '$lib/classes/question';
import { z } from 'zod';
import path from 'node:path';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params, locals }) => {
	const slugPath = path.join('h2_tys_questions', params.path);
	let index = sequential.findIndex((x) => x.slug === path.join('/', slugPath));
	const onlyCurrentPaper = sequential.filter((x) =>
		x.slug.startsWith(sequential[index]?.slug.slice(0, -3))
	);
	index = onlyCurrentPaper.findIndex((x) => x.slug === path.join('/', slugPath));
	const sequentialFixed = onlyCurrentPaper.map((x) => ({
		...x,
		slug: x.slug.replace('h2_solutions', 'h2/solutions')
	}));
	const role = locals.auth?.sessionClaims?.metadata.role;
	if (!(role === 'admin' || role === 'super')) {
		throw error(401, 'Unauthorized access or question not found');
	}
	const [year, paper, question] = params.path.split('/');
	const results = await turso
		.select({ text: tysQuestionsTexts.text })
		.from(tysQuestionsTexts)
		.where(eq(tysQuestionsTexts.id, params.path));
	if (results[0]) {
		const text = z.string().parse(results[0].text);
		const questionObject = questionSchema.parse(JSON.parse(text));
		const data = {
			role,
			year,
			paper: paper.slice(1),
			questionNo: question.slice(1),
			sequential: { prev: sequentialFixed[index - 1], next: sequentialFixed[index + 1] },
			question: questionObject
		} as const;
		return {
			data
		};
	}
	throw error(404, 'Question not found');
};
