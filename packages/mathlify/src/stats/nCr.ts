import { factorial } from './simple-statistics/factorial';

/**
 * n choose r
 *
 * uses a multiplication algorithm: beware of potential overflow for large numbers;
 */
export function nCr(n: number, r: number): number {
	if (!(Number.isInteger(n) && n >= 0 && Number.isInteger(r) && r >= 0 && r <= n)) {
		throw new Error(`${n}C${r} not valid`);
	}
	if (r > n - r) {
		r = n - r;
	}
	let ans = 1;
	for (let i = 1; i <= r; i++) {
		ans = (ans * (n - r + i)) / i;
	}
	return ans;
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
