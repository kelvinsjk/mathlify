import { h2_learnNav } from '$lib/components/nav';
import type { PageServerLoad } from './$types';

export const prerender = true;
export const load: PageServerLoad = async () => {
	const nav = h2_learnNav.children;
	return {
		nav
	};
};
