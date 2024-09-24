import { h2_learnNav } from '$lib/components/nav';
import { toReplacedSlug } from '$lib/utils/slug';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const topics = toReplacedSlug(h2_learnNav, 'h2_learn', 'h2/learn').children;
	return {
		topics
	};
};
