import { getStaticContent } from '$lib/server/page';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { renderHTML, getToc } from 'djot-temml';
import { subsections, sections } from '$lib/structure/learn/h2/fns/sections';

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	const results = await getStaticContent('learn/' + params.staticContent);
	if (results === null) throw error(404, 'Not Found');
	const parts = params.staticContent.split('/');
	const chapter = parts.at(-3);
	const section = parts.at(-2);
	const subsection = parts.at(-1);
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
