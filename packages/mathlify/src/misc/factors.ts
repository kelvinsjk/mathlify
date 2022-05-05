/**
 * returns all factor pairs of a positive integer
 */
export function factorPairs(n: number): [number, number][] {
	if (n <= 0 || !Number.isInteger(n)) {
		throw new Error(`Only valid for positive integers ${n}`);
	}
	let result: [number, number][] = [[1, n]];
	for (let i = 2; i <= Math.floor(Math.sqrt(n)); i++) {
		if (n % i === 0) {
			result.push([i, n / i]);
		}
	}
	return result;
}
