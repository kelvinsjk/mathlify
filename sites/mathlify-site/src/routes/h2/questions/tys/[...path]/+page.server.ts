import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { turso } from '$db';
import { tysQuestionsTexts } from '$db/turso/qns-techniques';
import { questionSchema } from '$lib/classes/question';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { topicalDirectory, questionsToTopic } from '../../../topical';
import type { NavNodePlusColor } from '$lib/components/mathlified/Nav.svelte';
import { capitalizeFirstLetter } from '$lib/utils/typesetting/utils';

export const load: PageServerLoad = async ({ params, locals }) => {
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
			question: questionObject,
			topicalNav
		} as const;
		return {
			data
		};
	}
	throw error(404, 'Question not found');
};
