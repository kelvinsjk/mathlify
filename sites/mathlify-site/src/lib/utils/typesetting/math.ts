export function dxString(x = 'x'): string {
	return `\\; \\rm{d}${x}`;
}

export function dydxString(options?: { x?: string; y?: string }): string {
	const { x = 'x', y = 'y' } = options ?? {};
	return `\\frac{\\rm{d}${y}}{\\rm{d}${x}}`;
}
export function d2String(options?: { x?: string; y?: string }): string {
	const { x = 'x', y = 'y' } = options ?? {};
	return `\\frac{\\rm{d}^2${y}}{\\rm{d}${x}^2}`;
}

export function definiteIntegralString(
	fx: unknown,
	a: unknown,
	b: unknown,
	options?: { x?: string }
): string {
	return `\\displaystyle \\int_{${a}}^{${b}} ${fx} ${dxString(options?.x ?? 'x')}`;
}

export const xAxis = `x\\text{-axis}`;
export const yAxis = `y\\text{-axis}`;
export const xCoordinate = `x\\text{-coordinate}`;

export function vecAB(v: unknown): string {
	return `\\overrightarrow{${v}}`;
}
export function vec(v: unknown): string {
	return `\\mathbf{${v}}`;
}

export function normal(mean: unknown, variance: unknown): string {
	return `\\mathrm{N} \\left( ${mean}, ${variance} \\right)`;
}
export function binomial(n: unknown, p: unknown): string {
	return `\\mathrm{B} \\left( ${n}, ${p} \\right)`;
}
export function P(event: unknown): string {
	return `\\mathrm{P} \\left( ${event} \\right)`;
}
export function E(X: unknown): string {
	return `\\mathrm{E} \\left( ${X} \\right)`;
}
export function Var(X: unknown): string {
	return `\\mathrm{Var} \\left( ${X} \\right)`;
}
