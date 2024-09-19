import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { h2_tys_questionsSequential as sequential } from '$lib/components/nav';
import { turso } from '$db';
import { tysQuestionsTexts } from '$db/turso/qns-techniques';
import { questionSchema } from '$lib/classes/question';
import { z } from 'zod';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { topicalDirectory, questionsToTopic } from '../../../../../topical';
import type { NavNodePlusColor } from '$lib/components/mathlified/Nav.svelte';
import { capitalizeFirstLetter } from '$lib/typesetting/utils';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { year, paper, question } = params;
	const slugPath = path.join('h2_tys_questions', year, paper, question);
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
	const results =
		locals.auth?.sessionClaims === null
			? [{ text: '{}' }]
			: await turso
					.select({ text: tysQuestionsTexts.text })
					.from(tysQuestionsTexts)
					.where(eq(tysQuestionsTexts.id, `${year}/${paper}/${question}`));
	if (results[0]) {
		const text = z.string().parse(results[0].text);
		const questionObject = questionSchema.parse(JSON.parse(text));
		const questionNo = Number(question.slice(1));
		const topics = questionsToTopic[`${year} P${paper.slice(1)} Q${questionNo}`];
		const topicalNav: NavNodePlusColor[] = [];
		for (const topic of topics) {
			topicalNav.push({
				name: capitalizeFirstLetter(topic),
				children: topicalDirectory[topic]?.map((x) => ({
					...x,
					slug: `/h2/questions/tys/${x.slug}`
				})),
				slug: '',
				fileSlug: ''
			});
		}
		const data = {
			role,
			year,
			paper: paper.slice(1),
			questionNo,
			sequential: { prev: sequentialFixed[index - 1], next: sequentialFixed[index + 1] },
			question: questionObject,
			topicalNav
		} as const;
		return {
			data
		};
	}
	throw error(404, 'Question not found');
};
