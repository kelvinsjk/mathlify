import type { PageServerLoad } from './$types';
import path from 'node:path';
import { normalizePath } from 'vite';
import { error } from '@sveltejs/kit';

import { directory } from '../../../../../../h2_tys_questions/directory';
import { preprocess } from '$lib/server/h2_tys_questions';
import { topicalDirectory, questionsToTopic } from '../../../../../topical';
import type { NavNodePlusColor } from '$lib/components/mathlified/Nav.svelte';
import { capitalizeFirstLetter } from '$lib/typesetting/utils';

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	const { year, paper, question } = params;
	const slugPath = path.join('h2_tys_questions', year, paper, question);
	let filePath = path.join('src/content', directory[slugPath]);
	// ts file
	const modules = import.meta.glob('/src/content/h2-3_h2_tys_questions/**/[^_]*.ts');
	const keys = Object.keys(modules);
	filePath = normalizePath(path.join('/', filePath + '.ts'));
	if (!keys.includes(filePath)) throw error(404, 'file not found');
	const module = await modules[filePath]();
	const questionNo = Number(question.slice(1));
	const topics = questionsToTopic[`${year} P${paper.slice(1)} Q${questionNo}`];
	const topicalNav: NavNodePlusColor[] = [];
	for (const topic of topics ?? []) {
		topicalNav.push({
			name: capitalizeFirstLetter(topic),
			children: topicalDirectory[topic]
				?.filter((x) => x.color !== 'red')
				?.map((x) => ({
					...x,
					slug: `/h2/questions/tys/${x.slug}`
				})),
			slug: '',
			fileSlug: ''
		});
	}
	if (preprocess['module']) {
		const data = {
			...preprocess.module(module),
			year,
			paper: paper.slice(1),
			questionNo,
			topicalNav
		} as const;
		return {
			data,
			filePath
		};
	}
	throw error(404, 'preprocess module not found');
};
