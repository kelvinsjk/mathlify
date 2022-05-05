import { Fraction, SquareRoot } from 'mathlify';
import { Angle } from './angleClass';

/**
 * complex Exp class representing a complex number in the form r e^{i \\theta}
 *
 * @r complex modulus
 * @theta complex argument
 *
 * we currently only support integer/fractional real and imaginary parts
 */
export class ComplexPolar {
	/** complex modulus */
	r: SquareRoot;
	/** complex argument */
	theta: Angle;

	//// constructor
	/**
	 * Creates a new complex instance
	 *
	 * @param r complex modulus
	 * @param theta complex argument (if in number|Fraction class: in degrees)
	 *
	 */
	constructor(r: Fraction | number | SquareRoot, theta: number | Angle | Fraction) {
		r = r instanceof SquareRoot ? r.clone() : new SquareRoot(1, r);
		theta = theta instanceof Angle ? theta.clone() : new Angle(theta);
		this.r = r;
		this.theta = theta;
	}

	///**
	// * complex addition
	// */
	//plus(w: Complex | number | Fraction): Complex {
	//  w = convertToComplex(w);
	//  return new Complex(this.x.plus(w.x), this.y.plus(w.y));
	//}

	/**
	 * negative of this complex number: -r e^{i \\theta} = r e^{i (\\theta + \\pi)}
	 */
	negative(): ComplexPolar {
		return new ComplexPolar(this.r, this.theta.plus(180));
	}

	/**
	 * complex multiplication
	 */
	times(w: ComplexPolar | number | Fraction): ComplexPolar {
		w = toComplexPolar(w);
		const newR = this.r.times(w.r);
		const newTheta = this.theta.plus(w.theta);
		return new ComplexPolar(newR, newTheta);
	}

	/**
	 * square
	 */
	square(): ComplexPolar {
		return this.times(this);
	}

	/**
	 * complex powers
	 *
	 * @returns z^n
	 */
	pow(n: number): ComplexPolar {
		if (!(Number.isInteger(n) && n >= 0)) {
			throw new RangeError('n must be a non-negative integer');
		}
		let w = new ComplexPolar(1, 0);
		for (let i = 0; i < n; i++) {
			w = w.times(this);
		}
		return w;
	}

	/**
	 * complex conjugate
	 */
	conjugate(): ComplexPolar {
		return new ComplexPolar(this.r, this.theta.negative());
	}

	/**
	 * complex division
	 */
	divide(w: ComplexPolar | number | Fraction): ComplexPolar {
		w = toComplexPolar(w);
		const newR = this.r.divide(w.r);
		const newTheta = this.theta.minus(w.theta);
		return new ComplexPolar(newR, newTheta);
	}

	/**
	 * clones a new instance of this complex Exp number
	 */
	clone(): ComplexPolar {
		return new ComplexPolar(this.r, this.theta);
	}

	/**
	 * @returns the LaTeX string of this complex number in exponential form r e^{i theta}
	 */
	toString(): string {
		const rString = this.r.isEqualTo(1) ? '' : `${this.r}\\,`;
		return `${rString}\\mathrm{e}^{ \\mathrm{i} ${this.theta} }`;
	}

	/**
	 * @returns the LaTeX string of this complex number in polar form r (cos theta + i sin theta)
	 */
	toPolarString(): string {
		let polarString = `\\cos ${this.theta} + \\mathrm{i} \\sin ${this.theta}`;
		if (this.r.isEqualTo(0)) {
			return '0';
		}
		polarString = this.r.isEqualTo(1) ? polarString : `${this.r} \\left( ${polarString} \\right)`;
		return polarString;
	}
}

/// convertNumberToComplex
function toComplexPolar(x: number | Fraction | ComplexPolar): ComplexPolar {
	return x instanceof ComplexPolar ? x.clone() : new ComplexPolar(x, 0);
}
