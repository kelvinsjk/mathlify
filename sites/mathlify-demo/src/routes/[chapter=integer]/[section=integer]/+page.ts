import type { PageLoad } from './$types';

import { chapters } from '$lib/chapters';

export const load = (({ params }) => {
	const i = Number(params.chapter);
	const j = Number(params.section);
	const chapter = chapters[i];
	return {
		i,
		j,
		chapterShortTitle: chapter.shortTitle,
		...chapter.sections[j - 1]
	};
}) satisfies PageLoad;
