import type { NavNode } from '$lib/components/nav';

export function toReplacedSlug(node: NavNode, str: string, replacement: string): NavNode {
	const newNode: NavNode = {
		name: node.name,
		slug: node.slug.replace(str, replacement),
		fileSlug: node.fileSlug
	};
	if (node.children) {
		newNode.children = node.children.map((child) => toReplacedSlug(child, str, replacement));
	}
	return newNode;
}
