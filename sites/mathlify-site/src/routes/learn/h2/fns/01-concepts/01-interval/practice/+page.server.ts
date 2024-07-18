import type { PageServerLoad } from './$types';
import { subsections, sections } from '$lib/structure/learn/h2/fns/sections';

export const prerender = true;
import { generateState } from './generators';

export const load: PageServerLoad = async () => {
	const syllabus = 'h2';
	const chapter = 'fns';
	const section = '01-concepts';
	const subsection = '01-interval';
	const index = subsections.findIndex((s) => s.slug === subsection && s.sectionSlug === section);
	const state = generateState();
	return {
		title: subsections[index].title,
		prev: subsections[index - 1],
		next: subsections[index + 1],
		sections: sections,
		syllabus,
		chapter,
		section,
		subsection,
		state,
	};
};
