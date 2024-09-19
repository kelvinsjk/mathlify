import type { PageServerLoad } from './$types';
import path from 'node:path';
import { normalizePath } from 'vite';
import { error } from '@sveltejs/kit';

import { directory } from '../../../../../h2_solutions/directory';
import { h2_solutionsSequential as sequential } from '$lib/components/nav';
import { preprocess } from '$lib/server/h2_solutions';
import { topicalDirectory, questionsToTopic } from '../../../../topical';
import type { NavNodePlusColor } from '$lib/components/mathlified/Nav.svelte';
import { capitalizeFirstLetter } from '$lib/typesetting/utils';

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	const { year, paper, question } = params;
	const slugPath = path.join('h2_solutions', year, paper, question);
	let filePath = path.join('src/content', directory[slugPath]);
	// ts file
	const modules = import.meta.glob('/src/content/h2-2_h2_solutions/**/[^_]*.ts');
	const keys = Object.keys(modules);
	filePath = normalizePath(path.join('/', filePath + '.ts'));
	if (!keys.includes(filePath)) throw error(404, 'file not found');
	const module = await modules[filePath]();
	let index = sequential.findIndex((x) => x.slug === path.join('/', slugPath));
	const onlyCurrentPaper = sequential.filter((x) =>
		x.slug.startsWith(sequential[index]?.slug.slice(0, -3))
	);
	index = onlyCurrentPaper.findIndex((x) => x.slug === path.join('/', slugPath));
	const sequentialFixed = onlyCurrentPaper.map((x) => ({
		...x,
		slug: x.slug.replace('h2_solutions', 'h2/solutions')
	}));
	const paperNo = Number(paper.slice(1));
	const questionNo = Number(question.slice(1));
	const topics = questionsToTopic[`${year} P${paperNo} Q${questionNo}`];
	const topicalNav: NavNodePlusColor[] = [];
	for (const topic of topics) {
		topicalNav.push({
			name: capitalizeFirstLetter(topic),
			children: topicalDirectory[topic]?.map((x) => ({
				...x,
				slug: `/h2/solutions/${x.slug}`
			})),
			slug: '',
			fileSlug: ''
		});
	}
	if (preprocess['module']) {
		const data = {
			...preprocess.module(module),
			year: Number(year),
			paperNo,
			questionNo,
			sequential: { prev: sequentialFixed[index - 1], next: sequentialFixed[index + 1] },
			topicalNav
		} as const;
		return {
			data,
			filePath
		};
	}
	throw error(404, 'preprocess module not found');
};
