/**
 * gives latex representation of dy/dx
 */
export function dydxString(y = 'y', x = 'x', n = 1): string {
	if (n === 0) {
		return `\\frac{\\mathrm{d}}{\\mathrm{d}${x}}`;
	}
	if (n === 1) {
		return `\\frac{\\mathrm{d}${y}}{\\mathrm{d}${x}}`;
	}
	return `\\frac{\\mathrm{d}^{${n}}${y}}{\\mathrm{d}${x}^{${n}}}`;
}
