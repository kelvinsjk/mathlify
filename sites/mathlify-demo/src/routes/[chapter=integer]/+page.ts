import type { PageLoad } from './$types';

import { chapters } from '$lib/chapters';

export const load = (({ params }) => {
	const i = Number(params.chapter);
	return {
		i,
		...chapters[i]
	};
}) satisfies PageLoad;
