import { h2_solutionsNav } from '$lib/components/nav';
import { toReplacedSlug } from '$lib/utils/slug';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const parent = toReplacedSlug(h2_solutionsNav, 'h2_solutions', 'h2/solutions');
	return {
		nav: parent.children
	};
};
