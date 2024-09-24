import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { directory } from '../../../../../../h2_learn/directory';

const fnDirectory: Record<string, string> = {};
for (const [key, value] of Object.entries(directory)) {
	if (key.startsWith('h2_learn/functions')) {
		fnDirectory[key.split('/functions/')[1]] = value;
	}
}
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { extractFrontmatter, mdToDjotWorkaround } from '$lib/utils/typesetting/md';

export const prerender = true;

export const load: PageServerLoad = async ({ params, depends }) => {
	const slugPath = path.join(params.section, params.subsection, 'theory');
	let filePath = path.join('src/content', fnDirectory[slugPath]);
	let content: string;
	let title: string | undefined;
	if (existsSync(`${filePath}.md`)) {
		// md file
		depends('md');
		filePath = path.join('./', filePath + '.md');
		const { metadata, body } = extractFrontmatter(readFileSync(filePath, 'utf-8'));
		if (metadata.title) {
			title = metadata.title;
			content = `# ${metadata.title}\n\n${body}`;
		} else {
			throw error(404, 'Title not found');
		}
	} else {
		throw error(400, 'Did not expect a non-md file');
	}
	title = title ? title[0].toLocaleUpperCase() + title.slice(1) : undefined;
	// 1,2a) prettier workaround: _{} gets converted to \_{}, so we have to change it back in math
	// 1,2b) go from tex $x$ to $`x` djot syntax
	// 3) put punctuation in math inline to prevent awkward line breaks
	// 4) table alignment: prettier-markdown to djot syntax
	// 5) change &dollar;
	content = mdToDjotWorkaround(content);
	return {
		title,
		content
	};
};
