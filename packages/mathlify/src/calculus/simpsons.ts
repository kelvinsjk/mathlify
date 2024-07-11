/**
 * implementation of Simpson's 1/3 rule for numerical integration.
 *
 * @param intervals number of intervals (defaults to 100)
 */
export function simpsons(f: (x: number) => number, lower: number, upper: number, intervals = 100): number {
	let result = 0;
	const stepSize = (upper - lower) / intervals;
	let i: number;
	for (i = 0; i < intervals; i++) {
		result += simpson_step(f, lower + i * stepSize, lower + (i + 1) * stepSize);
	}
	return result;
}

const simpson_step = function (f: (x: number) => number, a: number, b: number): number {
	return ((b - a) / 8) * (f(a) + 3 * f((2 * a + b) / 3) + 3 * f((a + 2 * b) / 3) + f(b));
};
