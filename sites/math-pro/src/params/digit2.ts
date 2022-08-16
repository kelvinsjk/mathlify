/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param: string): boolean {
	return /^[5-9]$/.test(param);
}
