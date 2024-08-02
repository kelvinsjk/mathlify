import type { PageServerLoad } from './$types';
import { subsections, sections } from '$lib/structure/learn/h2/fns/sections';
import { error } from '@sveltejs/kit';

export const prerender = true;
//import { practices } from '$content/learn/practices';

const modules = import.meta.glob('/src/content/learn/**/*.practice.ts');
const keys = Object.keys(modules);

export const load: PageServerLoad = async ({ params }) => {
	const { syllabus, chapter, section, subsection } = params;
	const file = `/src/content/learn/${syllabus}/${chapter}/${section}/${subsection}.practice.ts`;
	if (import.meta.env.DEV) {
		console.log(keys);
	}
	if (!keys.includes(file)) throw error(404, 'Not Found');
	const practice = await modules[file]();
	const index = subsections.findIndex((s) => s.slug === subsection && s.sectionSlug === section);

	/** @ts-expect-error dynamic import not typed */
	const state = practice.generateState();
	return {
		title: subsections[index].title,
		next: subsections[index + 1],
		sections: sections,
		syllabus,
		chapter,
		section,
		subsection,
		state,
	};
};
