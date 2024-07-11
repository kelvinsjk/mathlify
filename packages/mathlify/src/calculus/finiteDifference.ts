export function finiteDifference(f: (x: number) => number, x: number, precision = 5): number {
	const h = Math.pow(10, -precision);
	return (f(x + h) - f(x - h)) / 2 / h;
}
