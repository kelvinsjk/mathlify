import { h2_solutionsNav } from '$lib/components/nav';
import { replaceSlug } from '$lib/utils/slug';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	console.log();
	replaceSlug(h2_solutionsNav, 'h2_solutions', 'h2/solutions');
	return {
		nav: h2_solutionsNav.children
	};
};
