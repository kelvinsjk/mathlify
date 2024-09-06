import { h2_learnNav } from '$lib/components/nav';
import { replaceSlug } from '$lib/utils/slug';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
const topicToNumber: Record<string, number> = {
	functions: 0
};

export const load: LayoutServerLoad = async (event) => {
	const topicFromSlug = event.url.pathname.split('learn/').at(1)?.split('/').at(0);
	const topicNo = topicToNumber[topicFromSlug ?? ''];
	if (topicNo === undefined) error(404, 'Topic number not found');
	const topic = h2_learnNav.children?.at(topicNo);
	if (!topic) error(404, 'Topic not found');
	const { fileSlug: folder, name: topicName } = topic;
	replaceSlug(topic, 'h2_learn', 'h2/learn');
	return {
		topicName,
		folder,
		nav: [topic]
	};
};
