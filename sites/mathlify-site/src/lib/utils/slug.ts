import type { NavNode } from '$lib/components/nav';
export function replaceSlug(node: NavNode, str: string, replacement: string) {
	node.slug = node.slug.replace(str, replacement);
	if (node.children) {
		node.children.forEach((child) => replaceSlug(child, str, replacement));
	}
}
