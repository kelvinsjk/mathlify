import type { PageServerLoad } from './$types';
import { subsections, sections } from '$lib/structure/learn/h2/fns/sections';

//export const prerender = true;
import { practices } from '$content/learn/practices';

export const load: PageServerLoad = async ({ params }) => {
	const { syllabus, chapter, section, subsection } = params;
	const index = subsections.findIndex((s) => s.slug === subsection && s.sectionSlug === section);
	const state = practices[syllabus][chapter][section][subsection].generateState();
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
