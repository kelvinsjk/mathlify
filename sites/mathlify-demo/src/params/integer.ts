import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	return /^\d\d?$/.test(param);
}) satisfies ParamMatcher;
