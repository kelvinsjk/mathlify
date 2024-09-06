/**
 * Mathlified Generic Page Server version 0.0.1
 * generated on 9/4/2024, 9:34:40 PM
 */

import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

import { directory } from '../../../../../../h2_learn/directory';

const fnDirectory: Record<string, string> = {};
for (const [key, value] of Object.entries(directory)) {
	if (key.startsWith('h2_learn/functions')) {
		fnDirectory[key.split('/functions/')[1]] = value;
	}
}
import { existsSync } from 'node:fs';
import path from 'node:path';
import { normalizePath } from 'vite';

// TODO
//export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
	const slugPath = path.join(params.section, params.subsection, 'practice');
	let filePath = path.join('src/content', fnDirectory[slugPath]);
	let title: string | undefined;
	if (existsSync(`${filePath}.md`)) {
		throw error(400, 'Did not expect an md file');
	} else {
		// ts file
		const modules = import.meta.glob('/src/content/h2-1_h2_learn/**/*.ts');
		const keys = Object.keys(modules);
		filePath = normalizePath(path.join('/', filePath + '.ts'));
		if (!keys.includes(filePath)) throw error(404, 'Not Found');
		const module = await modules[filePath]();
		if (
			!(
				typeof module === 'object' &&
				module !== null &&
				'generateState' in module &&
				typeof module.generateState === 'function'
			)
		)
			throw error(400, 'Module not found');
		const moduleTitle =
			'title' in module && typeof module.title === 'string' ? module.title : undefined;
		if (moduleTitle) {
			title = moduleTitle;
		}

		title = title ? title[0].toLocaleUpperCase() + title.slice(1) : undefined;
		const state: null | Record<string, unknown> = module.generateState();
		return {
			state,
			title,
			filePath,
			slugPath
		};
	}
};
