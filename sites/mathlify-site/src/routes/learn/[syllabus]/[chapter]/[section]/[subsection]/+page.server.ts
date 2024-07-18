import { getStaticContent } from '$lib/server/page';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { renderHTML, getToc } from 'djot-temml';
import { subsections, sections } from '$lib/structure/learn/h2/fns/sections';

export const prerender = true;
export const trailingSlash = 'always';

export const load: PageServerLoad = async ({ params, depends }) => {
	depends('md');
	const { syllabus, chapter, section, subsection } = params;
	const results = await getStaticContent(`learn/${syllabus}/${chapter}/${section}/${subsection}`);
	if (results === null) throw error(404, 'Not Found');
	const index = subsections.findIndex((s) => s.slug === subsection && s.sectionSlug === section);
	return {
		metadata: results.metadata,
		title: subsections[index].title,
		toc: getToc(results.body),
		content: renderHTML(results.body),
		prev: subsections[index - 1],
		next: subsections[index + 1],
		sections: sections,
		chapter,
		section,
		subsection,
	};
};
