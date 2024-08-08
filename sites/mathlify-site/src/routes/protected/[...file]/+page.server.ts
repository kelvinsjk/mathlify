import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { file } = params;
	const res = await fetch(`/db/protected?file=${file}`);
	if (!res.ok) throw error(404, 'Not Found');
	const data = (await res.json()) as {
		slug: string;
		created_at: string;
		djot: string;
		title: string;
		type: string;
	}[];
	const { title, djot } = data[0];
	return {
		title,
		djot,
	};
};
