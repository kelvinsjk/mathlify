import { h2_learnNav, type NavNode } from '$lib/components/nav';
import { toReplacedSlug } from '$lib/utils/slug';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
const topicNo = 0;

export const load: LayoutServerLoad = async () => {
	const topics = h2_learnNav.children;
	let topic = topics?.at(topicNo);
	if (!topic) error(404, 'Topic not found');
	const { fileSlug: folder, name: topicName } = topic;
	topic = toReplacedSlug(topic, 'h2_learn', 'h2/learn');
	const nav: NavNode[] = [
		topic,
		{
			name: '‹‹ Topic selection',
			slug: '../../..',
			fileSlug: ''
		}
	];
	return {
		topicName,
		folder,
		nav
	};
};
