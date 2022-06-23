import { Fraction, numberToFraction, Polynomial } from '../core';

/**
 * Arithmetic progression
 */
export class AP {
	a: Fraction;
	d: Fraction;

	/**
	 * creates new AP instance
	 */
	constructor(a: number | Fraction, d: number | Fraction) {
		this.a = numberToFraction(a);
		this.d = numberToFraction(d);
	}

	/**
	 * nth term, u_n = a + (n-1)d
	 */
	uN(n: number): Fraction {
		if (!Number.isInteger(n) || n < 1) {
			throw new Error(`Only valid for positive integers n ${n}`);
		}
		return this.a.plus(this.d.times(n - 1));
	}

	/**
	 * nth term as a polynomial: u_n = nd + a-d
	 */
	uNPoly(): Polynomial {
		return new Polynomial([this.d, this.a.minus(this.d)], { unknown: 'n' });
	}

	/**
	 * sum of n terms, S_n = n/2 * (2a + (n-1)d)
	 */
	sN(n: number): Fraction {
		if (!Number.isInteger(n) || n < 1) {
			throw new Error(`Only valid for positive integers n ${n}`);
		}
		return this.a.times(n).plus(
			this.d
				.times(n - 1)
				.times(n)
				.divide(2),
		);
	}

	/**
	 * sum of n terms as a polynomial: S_n = n/2 * (2a + (n-1)d)
	 */
	sNPoly(): Polynomial {
		return new Polynomial([this.d.divide(2), this.a.minus(this.d.divide(2)), 0], { unknown: 'n' });
	}
}
