import type { PageServerLoad } from './$types';
//import { getStaticContent } from '$lib/server/page';
//import { error } from '@sveltejs/kit';
//import { renderHTML, getToc } from 'djot-temml';
//import { subsections, sections } from '$lib/structure/learn/h2/fns/sections';

import { answer } from '$content/solutions/h2/2023/p1/q7';

//export const prerender = true;

export const load: PageServerLoad = async ({ params, depends }) => {
	depends('md');
	const {
		//syllabus,
		year,
		paper,
		question,
	} = params;
	//const results = await getStaticContent(`learn/${syllabus}/${year}/${paper}/${question}`);
	//if (results === null) throw error(404, 'Not Found');
	//const index = subsections.findIndex((s) => s.slug === subsection && s.sectionSlug === section);
	return {
		//metadata: results.metadata,
		title: `${year} H2 Mathematics Paper ${paper.slice(1)} Question ${question.slice(1)}`,
		//toc: getToc(results.body),
		content: answer.solution, //renderHTML(results.body),
		//prev: subsections[index - 1],
		//sections: sections,
		//chapter,
		//section,
		//subsection,
	};
};
