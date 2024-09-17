import { h2_learnNav } from '$lib/components/nav';
import { toReplacedSlug } from '$lib/utils/slug';
import type { PageServerLoad } from './$types';

export const prerender = true;
export const load: PageServerLoad = async () => {
	return {
		nav: toReplacedSlug(h2_learnNav, 'h2_learn', 'h2/learn').children
	};
};
