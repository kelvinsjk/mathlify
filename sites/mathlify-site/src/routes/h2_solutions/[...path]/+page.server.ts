/**
 * Mathlified Custom Page Server version 0.0.1
 * generated on 9/4/2024, 9:34:40 PM
 */

import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { directory } from '../directory';

import { preprocess } from '$lib/server/h2_solutions';

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { normalizePath } from 'vite';

//export const prerender = true;

export const load: PageServerLoad = async ({ params, depends }) => {
	const slugPath = path.join('h2_solutions', params.path);
	let filePath = path.join('src/content', directory[slugPath]);
	let content: string;
	let title: string | undefined;
	if (existsSync(`${filePath}.md`)) {
		// md file
		depends('md');
		// default md behavior
		const { metadata, body } = extractFrontmatter(readFileSync(filePath, 'utf-8'));
		if (metadata.title) {
			title = metadata.title;
			content = `# ${metadata.title}\n\n${body}`;
		} else {
			title = params.path.split(path.sep).pop();
			content = body;
		}
		title = title = title ? title[0].toLocaleUpperCase() + title.slice(1) : undefined;
		// 1,2a) prettier workaround: _{} gets converted to \_{}, so we have to change it back in math
		// 1,2b) go from tex $x$ to $`x` djot syntax
		// 3) put punctuation in math inline to prevent awkward line breaks
		// 4) table alignment: prettier-markdown to djot syntax
		// 5) change &dollar;
		content = content
			.replace(
				/(?<!\\)\$\$(?!`)([^]+?)\$\$/g,
				(_, match) => `$$\`${match.replaceAll('\\_', '_')}\``
			)
			.replace(
				/(?<!\\)\$(?!`)(.+?)(?<!\\)\$/g,
				(_, match) => `$\`${match.replaceAll('\\_', '_')}\``
			)
			.replace(/(?<!\$)(\$`)([^`]+)`([.,])/g, '$1$2$3`')
			.replace(/ ?(\|) (-+|:-+|-+:|:-+:) (\|) ?/g, '$1$2$3')
			.replaceAll('&dollar;', '$');
		return {
			data: { title, content, isMd: true },
			filePath
		};
	} else {
		// ts file
		const modules = import.meta.glob('/src/content/h2-2_h2_solutions/**/*.ts');
		const keys = Object.keys(modules);
		filePath = normalizePath(path.join('/', filePath + '.ts'));
		if (!keys.includes(filePath)) throw error(404, 'Not Found');
		const module = await modules[filePath]();
		if (preprocess['module']) {
			return {
				data: { ...preprocess.module(module, { paramsPath: params.path, filePath }), isMd: false },
				filePath
			};
		}
	}
};

// adapted from https://github.com/sveltejs/site-kit/blob/master/packages/site-kit/src/lib/markdown/utils.js
function extractFrontmatter(markdown: string) {
	const match = /^---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
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
