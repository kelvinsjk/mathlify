import { Fraction, Term, toFraction } from 'mathlify';

/**
 * angle class
 *
 * @degrees angle in degrees (between -180 to 180)
 *
 */
export class Angle {
	/** angle in degrees */
	degrees: Fraction;
	/** radians coeff (k in k pi) */
	radiansCoeff: Fraction;

	//// constructor
	/**
	 * Creates a new angle instance
	 *
	 * @degrees angle in degrees
	 *
	 */
	constructor(degrees: number | Fraction, complexMode = true) {
		degrees = toFraction(degrees);
		if (complexMode) {
			while (degrees.isGreaterThan(180)) {
				degrees = degrees.minus(360);
			}
			while (degrees.isAtMost(-180)) {
				degrees = degrees.plus(360);
			}
		}
		this.degrees = degrees.clone();
		this.radiansCoeff = degrees.divide(180);
	}

	toTerm(): Term {
		return new Term(this.radiansCoeff, '\\pi');
	}

	/**
	 * typesets to \\frac{num \\pi}{den}
	 */
	toString(): string {
		const num = new Term(this.radiansCoeff.num, '\\pi');
		if (this.degrees.isEqualTo(0)) {
			return '0';
		}
		return this.radiansCoeff.den === 1 ? `\\pi` : `\\frac{${num}}{${this.radiansCoeff.den}}`;
	}

	/**
	 * addition
	 */
	plus(B: Angle | number | Fraction): Angle {
		B = B instanceof Angle ? B : new Angle(B);
		return new Angle(this.degrees.plus(B.degrees));
	}

	/**
	 * negative
	 */
	negative(): Angle {
		return new Angle(this.degrees.negative());
	}

	/**
	 * subtraction
	 *
	 * @return this minus B
	 */
	minus(B: Angle | number | Fraction): Angle {
		B = B instanceof Angle ? B : new Angle(B);
		return this.plus(B.negative());
	}

	/**
	 * multiplication
	 */
	times(k: number): Angle {
		return new Angle(this.degrees.times(k));
	}

	/**
	 * multiplication
	 */
	divide(k: number): Angle {
		if (k === 0) {
			throw new Error('angle ERROR: division by 0 is not allowed');
		}
		return new Angle(this.degrees.divide(k));
	}

	clone(): Angle {
		return new Angle(this.degrees);
	}

	supplement(): Angle {
		return new Angle(180).minus(this);
	}
}
