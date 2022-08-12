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
	u(n: number): Fraction {
		if (!Number.isInteger(n) || n < 1) {
			throw new Error(`Only valid for positive integers n ${n}`);
		}
		return this.a.times(this.r.pow(n - 1));
	}

	/**
	 * sum of n terms, S_n = a (1 - r^n)/(1-r)
	 */
	S(n: number): Fraction {
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
	SInfty(): Fraction {
		if (this.r.abs().isAtLeast(1)) {
			throw new Error(`GP does not converge for  |r| >= 1, ${this.r}`);
		}
		return this.a.divide(Fraction.ONE.minus(this.r));
	}

	/**
	 * u_n formula to be used for floats
	 */
	static u(a: number, r: number, n: number): number {
		if (!Number.isInteger(n) || n < 1) {
			throw new Error(`GP error: n must be positive integer, ${n} received.`);
		}
		return a * Math.pow(r, n - 1);
	}
	/**
	 * S_n formula to be used for floats
	 */
	static S(a: number, r: number, n: number): number {
		if (!Number.isInteger(n) || n < 1) {
			throw new Error(`GP error: n must be positive integer, ${n} received.`);
		}
		if (r === 1) {
			throw new Error(`GP Sum error: r must not be 1.`);
		}
		return (a * (Math.pow(r, n) - 1)) / (r - 1);
	}
	/**
	 * S_infty formula to be used for floats
	 */
	static SInfty(a: number, r: number): number {
		if (Math.abs(r) >= 1) {
			throw new Error(`GP S_Infty error: |r| must not be less than 1.`);
		}
		return a / (1 - r);
	}
}
