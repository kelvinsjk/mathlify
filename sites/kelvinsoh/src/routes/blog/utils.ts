// modified from
// https://github.com/sveltejs/site-kit/blob/master/packages/site-kit/src/lib/markdown/utils.js
// on 2024-01-11

export function extractFrontmatter(markdown: string) {
	const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
	if (!match) return { metadata: {}, body: markdown };

	const frontmatter = match[1];
	const body = markdown.slice(match[0].length);

	const metadata: Record<string, string> = {};
	frontmatter.split('\n').forEach((pair) => {
		const i = pair.indexOf(':');
		metadata[pair.slice(0, i).trim()] = removeQuotes(pair.slice(i + 1).trim());
	});

	return { metadata, body };
}

function removeQuotes(str: string) {
	return str.replace(/(^["']|["']$)/g, '');
}
