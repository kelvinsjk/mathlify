import { h2_tys_questionsNav } from '$lib/components/nav';
import type { NavNodePlusColor } from '$lib/components/mathlified/Nav.svelte';
import { toReplacedSlug } from '$lib/utils/slug';
import type { LayoutServerLoad } from './$types';
import { match as matchOpen } from '$params/openYear';
import { match as matchMember } from '$params/memberYear';
import { match as matchPremium } from '$params/premiumYear';

export const load: LayoutServerLoad = async () => {
	const items = toReplacedSlug(
		h2_tys_questionsNav,
		'h2_tys_questions',
		'h2/questions/tys'
	).children;
	const main: NavNodePlusColor[] = [];
	for (const item of items ?? []) {
		if (matchOpen(item.name)) {
			main.push(item);
		} else if (matchMember(item.name)) {
			main.push({ ...item, color: 'blue' });
		} else if (matchPremium(item.name)) {
			main.push({ ...item, color: 'green' });
		}
	}
	return {
		nav: [...main]
	};
};
