/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param: string): boolean {
	return /^[0-4]$/.test(param);
}
