/**
 * @returns [xBar, s2]
 */
export function sampling(sumX: number, sumX2: number, n: number, offset = 0): [number, number] {
	const xBar = sumX / n + offset;
	const s2 = (sumX2 - (sumX * sumX) / n) / (n - 1);
	return [xBar, s2];
}
