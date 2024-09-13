import type { NavNode } from '$lib/components/nav';
export function replaceSlug(node: NavNode, str: string, replacement: string): void {
	node.slug = node.slug.replace(str, replacement);
	if (node.children) {
		node.children.forEach((child) => replaceSlug(child, str, replacement));
	}
}

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
