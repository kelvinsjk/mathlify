import type { PageServerLoad } from './$types';
//import { getStaticContent } from '$lib/server/page';
import { error } from '@sveltejs/kit';
//import { renderHTML, getToc } from 'djot-temml';
//import { subsections, sections } from '$lib/structure/learn/h2/fns/sections';

import type { Answer } from '$content/solutions/answerObject';

//export const prerender = true;

const modules = import.meta.glob('/src/content/solutions/**/*.soln.ts');
const keys = Object.keys(modules);

export const load: PageServerLoad = async ({ params, depends }) => {
	depends('md');
	const { syllabus, year, paper, question } = params;

	const file = `/src/content/solutions/${syllabus}/${year}/${paper}/${question}.soln.ts`;
	if (!keys.includes(file)) throw error(404, 'Not Found');
	const soln = (await modules[file]()) as { answer: Answer };
	const { answer, solution } = soln.answer;

	// TODO: handle topics
	const topics = 'Functions';

	return {
		//metadata: results.metadata,
		syllabus,
		topics,
		title: `${year} Paper ${paper.slice(1)} Question ${question.slice(1)}`,
		//toc: getToc(results.body),
		answer,
		solution,
		//prev: subsections[index - 1],
		//sections: sections,
		//chapter,
		//section,
		//subsection,
	};
};
