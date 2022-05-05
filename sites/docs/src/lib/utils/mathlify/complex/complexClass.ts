import { toFraction, Fraction, Term, Expression } from 'mathlify';

/**
 * complex class
 *
 * @x real part (Fraction)
 * @y imaginary part (Fraction)
 *
 * we currently only support integer/fractional real and imaginary parts
 */
export class Complex extends Expression {
	/** real part */
	x: Fraction;
	/** imaginary part */
	y: Fraction;

	//// constructor
	/**
	 * Creates a new complex instance
	 *
	 * @param x real part
	 * @param y imaginary part (default 0)
	 *
	 * we currently only support integer/fractional real and imaginary parts
	 */
	constructor(x: Fraction | number, y: number | Fraction = 0) {
		x = toFraction(x);
		const imaginaryTerm = new Term(y, '\\mathrm{i}');
		super(x, imaginaryTerm);
		this.x = x;
		this.y = toFraction(y);
	}

	/**
	 * complex addition
	 */
	plus(w: Complex | number | Fraction): Complex {
		w = toComplex(w);
		return new Complex(this.x.plus(w.x), this.y.plus(w.y));
	}

	/**
	 * negative of this complex number: -x-yi
	 */
	negative(): Complex {
		return new Complex(this.x.negative(), this.y.negative());
	}

	/**
	 * complex subtraction:
	 *
	 * @returns this minus w
	 */
	minus(w: Complex | number | Fraction): Complex {
		w = toComplex(w);
		return this.plus(w.negative());
	}

	/**
	 * complex multiplication
	 */
	times(w: Complex | number | Fraction): Complex {
		w = toComplex(w);
		const newX = this.x.times(w.x).minus(this.y.times(w.y));
		const newY = this.x.times(w.y).plus(this.y.times(w.x));
		return new Complex(newX, newY);
	}

	/**
	 * complex powers
	 *
	 * @returns z^n
	 */
	pow(n: number): Complex {
		if (!(Number.isInteger(n) && n >= 0)) {
			throw new RangeError('n must be a non-negative integer');
		}
		let w = new Complex(1, 0);
		for (let i = 0; i < n; i++) {
			w = w.times(this);
		}
		return w;
	}

	/**
	 * square
	 *
	 * @returns z^2
	 */
	square(): Complex {
		return this.pow(2);
	}

	/**
	 * complex conjugate
	 */
	conjugate(): Complex {
		return new Complex(this.x, this.y.negative());
	}

	/**
	 * complex division
	 */
	divide(w: Complex | number | Fraction): Complex {
		w = toComplex(w);
		const z_wStar = this.times(w.conjugate());
		const rSquared = w.x.times(w.x).plus(w.y.times(w.y));
		const rSquaredReciprocal = Fraction.ONE.divide(rSquared);
		return z_wStar.times(rSquaredReciprocal);
	}

	clone(): Complex {
		return new Complex(this.x, this.y);
	}

	/**
	 * @returns r^2 in the fraction class
	 */
	modulusSquared(): Fraction {
		const zzStar = this.times(this.conjugate());
		return zzStar.x.clone();
	}

	/**
	 * the purely imaginary unit i (0+1i)
	 */
	static I = new Complex(0, 1);
}

///**
// * options for constructing a complex class instance
// * can be used to set form to 'cartesian'(default), 'polar' or 'exponential'
// * TODO: WARNING: only cartesian mode supported currently
// */
//interface complexOptions{
//  form?: 'cartesian' | 'exponential' | 'polar';
//}

/// convertNumberToFraction
function toComplex(x: number | Fraction | Complex): Complex {
	return x instanceof Complex ? x.clone() : new Complex(x);
}
