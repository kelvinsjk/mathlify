import { nCr } from './nCr';

/**
 * binomPdf(n,p,x)
 *
 * @returns P(X=x)
 *
 */
function binomPdf(n: number, p: number, x: number): number {
	if (Number.isInteger(n) && n > 0 && p >= 0 && p <= 1 && Number.isInteger(x) && x >= 0 && x <= n) {
		return nCr(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
	}
	throw new Error(`unexpected behavior for binomPDF ${n},${p},${x}}`);
}

/**
 * binomCdf(n,p,x)
 *
 * @returns P(X \leq x)
 *
 */
function binomCdf(n: number, p: number, x: number): number {
	const epsilon = 1e-10;
	x = Math.floor(x);
	let sum = 0;
	let i = 0;
	while (i <= x && sum < 1 - epsilon) {
		// second condition stops loop early to prevent possible overflow problems in nCr
		sum += binomPdf(n, p, i);
		i++;
	}
	return sum >= 1 - epsilon ? 1 : sum;
}

/**
 * binomCdfRange(n,p,x1,x2)
 *
 * @returns P(x1 \\leq X \leq x2)
 *
 */
function binomCdfRange(n: number, p: number, lower: number, upper: number): number {
	lower = Math.ceil(lower);
	upper = Math.floor(upper);
	const p2 = binomCdf(n, p, upper);
	const p1 = binomCdf(n, p, lower - 1);
	return p2 - p1;
}

export { binomPdf, binomCdf, binomCdfRange };
