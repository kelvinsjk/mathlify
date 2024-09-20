export function dxString(x = 'x'): string {
	return `\\; \\mathrm{d}${x}`;
}

export function dydxString(options?: { x?: string; y?: string }): string {
	const { x = 'x', y = 'y' } = options ?? {};
	return `\\frac{\\mathrm{d}${y}}{\\mathrm{d}${x}}`;
}

export function definiteIntegralString(
	fx: unknown,
	a: unknown,
	b: unknown,
	options?: { x?: string }
): string {
	return `\\displaystyle \\int_{${a}}^{${b}} ${fx} ${dxString(options?.x ?? 'x')}`;
}
