import { gcd } from './gcd';

/**
 * Given a,b,...n,
 * returns
 * `{ k: sign*gcd(a,b,...,n), numbers: [a1,b1,...n1]}`
 * such that a+b+...+n = k(a1+b1+...+n1)
 */
export function factorize(...args: number[]): { k: number; numbers: number[] } {
	let k = gcd(...args);
	if (args.filter((e) => e > 0).length === 0) {
		k = -k;
	}
	return {
		k,
		numbers: args.map((x) => x / k),
	};
}
