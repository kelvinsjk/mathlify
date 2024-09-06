/**
 * Mathlified Generic Page Server version 0.0.1
 * generated on 9/4/2024, 9:34:40 PM
 */

import { generateState } from '$content/h2-1_h2_learn/01_functions/01_concepts/01_intervals/02_practice';

import type { PageServerLoad } from './$types';

import { directory } from '../../../../../../h2_learn/directory';

const fnDirectory: Record<string, string> = {};
for (const [key, value] of Object.entries(directory)) {
	if (key.startsWith('h2_learn/functions')) {
		fnDirectory[key.split('/functions/')[1]] = value;
	}
}

export const prerender = true;

export const load: PageServerLoad = async () => {
	return {
		state: generateState()
	};
};
