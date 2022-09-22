import { Fraction, Imaginary, Term, Expression, numberToFraction, SquareRoot, numberToSquareRoot } from '../core';
import { Angle } from '../trigo';

/**
 * ComplexExp class representing r e^{i theta}
 */
export class ComplexExp extends Term {
	/** modulus of the complex number */
	mod: SquareRoot;
	/** argument of the complex number */
	arg: Angle;

	/**
	 * Creates a new ComplexExp instance
	 *
	 * @param theta type number will be interpreted as in degrees, type Fraction will be interpreted as k in k pi
	 */
	constructor(r: number | Fraction | SquareRoot, theta: number | Fraction | Angle = 0) {
		r = numberToSquareRoot(r);
		if (r.valueOf() < 0) {
			throw new Error(`negative modulus ${r} provided`);
		}
		if (!(theta instanceof Angle)) {
			theta = new Angle(theta);
		}
		if (theta.isEqualTo(0)) {
			super(r);
		} else {
			const argumentTerm = new Term(1).times(theta).times('i');
			super(r, `\\mathrm{e}^{${argumentTerm}}`);
		}
		if (r.coeff.isLessThan(0)) {
			throw new Error(`r ${r} must be non-negative`);
		}
		this.mod = r.clone();
		this.arg = theta.clone();
	}

	/**
	 * negative of this complex number
	 */
	negative(): ComplexExp {
		return new ComplexExp(this.mod, this.arg.plus(new Fraction(1))); // multiplies by e^i pi
	}
	/**
	 * complex number multiplication
	 */
	times(z: number | Fraction | ComplexExp): ComplexExp {
		if (z instanceof ComplexExp) {
			return new ComplexExp(this.mod.times(z.mod), this.arg.plus(z.arg));
		}
		return (typeof z === 'number' && z > 0) || (z instanceof Fraction && z.isGreaterThan(0))
			? new ComplexExp(this.mod.times(z), this.arg)
			: typeof z === 'number'
			? new ComplexExp(this.mod.times(Math.abs(z)), this.arg.plus(Fraction.ONE))
			: new ComplexExp(this.mod.times(z.abs()), this.arg.plus(Fraction.ONE));
	}
	/**
	 * complex conjugation
	 */
	conjugate(): ComplexExp {
		return new ComplexExp(this.mod, this.arg.negative());
	}
	reciprocal(): ComplexExp {
		if (this.mod.isEqualTo(0)) {
			throw new Error('division by zero');
		}
		return new ComplexExp(this.mod.reciprocal(), this.arg.negative());
	}
	/**
	 * complex division
	 */
	divide(z: number | Fraction | ComplexExp): ComplexExp {
		if (typeof z === 'number') {
			return this.times(new Fraction(1, z));
		}
		return this.times(z.reciprocal());
	}
	/**
	 * complex exponentiation
	 */
	pow(n: number): ComplexExp {
		return new ComplexExp(this.mod.pow(n), this.arg.times(n));
	}
	/**
	 * z^2
	 */
	square(): ComplexExp {
		return this.pow(2);
	}
	/**
	 * returns the polar form r (cos theta + i sin theta)
	 */
	toPolarString(): string {
		const trigoString = this.arg.k.isLessThan(0)
			? `\\cos \\left( ${this.arg} \\right) + \\mathrm{i} \\sin \\left( ${this.arg} \\right)`
			: `\\cos ${this.arg} + \\mathrm{i} \\sin ${this.arg}`;
		return this.mod.isEqualTo(1) ? trigoString : `${this.mod} \\left( ${trigoString} \\right)`;
	}
	clone(): ComplexExp {
		return new ComplexExp(this.mod, this.arg);
	}

	/**
	 * returns the standard form r e^(i theta)
	 */
	static FORM(r = 'r', theta = '\\theta'): string {
		return theta === '\\theta' ? `${r} \\mathrm{e}^{\\mathrm{i}${theta}}` : `${r} \\mathrm{e}^{${theta}\\mathrm{i}}`;
	}
	/**
	 * returns the standard form r e^(i theta)
	 */
	static POLAR_FORM(r = 'r', theta = '\\theta'): string {
		return r === ''
			? `\\cos ${theta} + \\mathrm{i} \\sin ${theta}`
			: `${r} (\\cos ${theta} + \\mathrm{i} \\sin ${theta})`;
	}
}
