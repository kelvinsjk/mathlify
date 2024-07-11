import { getStaticContent } from '$lib/server/page';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { renderHTML } from 'djot-temml';

export const prerender = true;
export const load: PageServerLoad = async ({ params }) => {
	const results = await getStaticContent(params.staticContent);
	if (results === null) throw error(404, 'Not Found');
	return {
		content: renderHTML(results.body),
	};
};
