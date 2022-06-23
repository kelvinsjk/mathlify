import { Fraction, numberToFraction } from '../core';

/**
 * Geometric progression
 */
export class GP {
	a: Fraction;
	r: Fraction;

	/**
	 * creates new GP instance
	 */
	constructor(a: number | Fraction, r: number | Fraction) {
		this.a = numberToFraction(a);
		this.r = numberToFraction(r);
	}

	/**
	 * nth term, u_n = a r^(n-1)
	 */
	uN(n: number): Fraction {
		if (!Number.isInteger(n) || n < 1) {
			throw new Error(`Only valid for positive integers n ${n}`);
		}
		return this.a.times(this.r.pow(n - 1));
	}

	/**
	 * sum of n terms, S_n = a (1 - r^n)/(1-r)
	 */
	sN(n: number): Fraction {
		if (!Number.isInteger(n) || n < 1) {
			throw new Error(`Only valid for positive integers n ${n}`);
		}
		if (this.r.abs().isEqualTo(1)) {
			return this.r.isEqualTo(1) ? this.a.times(n) : n % 2 === 0 ? Fraction.ZERO : this.a.clone();
		}
		return this.a.times(Fraction.ONE.minus(this.r.pow(n)).divide(Fraction.ONE.minus(this.r)));
	}

	/**
	 * sum to infinity, S_infty = a / (1-r)
	 */
	sInfty(): Fraction {
		if (this.r.abs().isAtLeast(1)) {
			throw new Error(`GP does not converge for  |r| >= 1, ${this.r}`);
		}
		return this.a.divide(Fraction.ONE.minus(this.r));
	}
}
