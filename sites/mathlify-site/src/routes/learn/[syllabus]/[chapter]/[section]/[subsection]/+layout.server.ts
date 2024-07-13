import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { syllabuses } from '$lib/structure/learn';

export const prerender = true;

export const load: LayoutServerLoad = async ({ params }) => {
	const { syllabus, chapter, section, subsection } = params;
	const sections = syllabuses[syllabus][chapter].sections;
	if (!sections) error(404, 'Not Found');
	return {
		section,
		sections,
	};
};
