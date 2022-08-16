/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param: string): boolean {
	return /^[a-f]$/.test(param);
}
