import type { PageServerLoad } from './$types';
import { subsections, sections } from '$lib/structure/learn/h2/fns/sections';

export const prerender = true;
//import { practices } from '$content/learn/practices';

const modules = import.meta.glob(['/src/content/learn/**/*.ts', '!**/*.state.ts']);
console.log('hello');
console.log(Object.keys(modules));

export const load: PageServerLoad = async ({ params }) => {
	const { syllabus, chapter, section, subsection } = params;
	const practice =
		await modules[`/src/content/learn/${syllabus}/${chapter}/${section}/${subsection}.ts`]();
	//console.log(`hihi`, x.generateState());
	const index = subsections.findIndex((s) => s.slug === subsection && s.sectionSlug === section);
	//const state = practices[syllabus][chapter][section][subsection].generateState();

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
