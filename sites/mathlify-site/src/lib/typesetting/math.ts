export function dxString(x = 'x'): string {
	return `\\; \\mathrm{d}${x}`;
}

export function definiteIntegralString(
	fx: unknown,
	a: unknown,
	b: unknown,
	options?: { x?: string }
): string {
	return `\\displaystyle \\int_{${a}}^{${b}} ${fx} ${dxString(options?.x ?? 'x')}`;
}
