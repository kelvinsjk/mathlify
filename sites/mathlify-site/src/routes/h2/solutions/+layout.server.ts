import { h2_solutionsNav } from '$lib/components/nav';
import { replaceSlug } from '$lib/utils/slug';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const years = h2_solutionsNav.children?.at(0);
	if (!years) error(404, 'Nav not found');
	replaceSlug(years, 'h2_solutions', 'h2/solutions');
	return {
		nav: [years]
	};
};
