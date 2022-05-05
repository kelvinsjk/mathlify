import { factorial } from 'simple-statistics';
export { Normal } from './normalClass';
export { binomPdf, binomCdf, binomCdfRange } from './binomial';
export { normCdf, invNorm, zTest } from './normal';
export { numberWithCommas } from './numberWithCommas';

/**
 * calculates nCr
 */
export function nCr(n: number, r: number): number {
	// safe integer
	if (n <= 18) {
		return factorial(n) / factorial(r) / factorial(n - r);
	}
	const ans = bigIntFactorial(n) / bigIntFactorial(r) / bigIntFactorial(n - r);
	return Number(ans);
}

function bigIntFactorial(n: number | bigint, product = BigInt(1)): bigint {
	if (n === 1 || n === BigInt(1)) {
		return product;
	}
	n = typeof n === 'number' ? BigInt(n) : n;
	return bigIntFactorial(n - BigInt(1), product * n);
}

/**
 * typesets and calculate nCr via toString and valueOf
 */
export class NCR {
	n: number;
	r: number;
	ordered: boolean;

	constructor(n: number, r: number, ordered = false) {
		this.n = n;
		this.r = r;
		this.ordered = ordered;
	}

	toString(): string {
		return `{${this.n} \\choose ${this.r}}${this.ordered ? `\\times ${this.r}!` : ''}`;
	}

	valueOf(): number {
		let ncr = nCr(this.n, this.r);
		if (this.ordered) {
			ncr *= factorial(this.r);
		}
		return ncr;
	}
}

export { factorial };

/**
 * typesets and calculate identical object permutations
 */
export class Permute {
	n: number;
	identical: number[];

	constructor(n: number, identical: number | number[]) {
		this.n = n;
		this.identical = typeof identical === 'number' ? [identical] : identical;
	}

	toString(): string {
		return `\\frac{${this.n}}{${this.identical.join('!')}!}`;
	}

	valueOf(): number {
		return factorial(this.n) / this.identical.reduce((prev, curr) => prev * factorial(curr), 1);
	}
}

/**
 * @returns \\textrm{P}(A)
 */
export function prob(A: string): string {
	return `\\textrm{P}\\left(${A}\\right)`;
}

/**
 * @returns P(A|B)=P(A\\cap B)/P(B)
 */
export function conditional(A = 'A', B = 'B', lineBreak = false, bigcap = false): string {
	const cap = bigcap ? '\\, \\bigcap \\,' : '\\cap';
	return lineBreak
		? `&${prob(`${A} \\mid ${B}`)} \\\\ &=\\frac{${prob(`${A} ${cap} ${B}`)}}{${prob(B)}}`
		: `${prob(`${A} \\mid ${B}`)} &= \\frac{${prob(`${A} ${cap} ${B}`)}}{${prob(B)}}`;
}
