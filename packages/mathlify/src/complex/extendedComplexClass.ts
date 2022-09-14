import { Fraction, Imaginary, Expression, numberToFraction, SquareRoot, Term, VariableTerm } from '../core';
import { Complex } from './complexClass';

/**
 * xComplex class representing x + yi
 * where x,y can be expressions
 */
export class xComplex extends Expression {
	/** real part of the complex number */
	real: Expression;
	/** imaginary part of the complex number */
	imag: Expression;

	/**
	 * Creates a new Complex instance
	 */
	constructor(
		real: number | Fraction | string | Imaginary | VariableTerm | SquareRoot | Term | Expression,
		imag: number | Fraction | string | Imaginary | VariableTerm | SquareRoot | Term | Expression = 0,
	) {
		real = real instanceof Expression ? real.clone() : new Expression(real);
		imag = imag instanceof Expression ? imag.clone() : new Expression(imag);
		super(...real.terms, ...imag.times('i').terms);
		this.real = real;
		this.imag = imag;
	}

	/**
	 * adds two complex numbers
	 */
	plus(z: number | Fraction | Complex | xComplex): xComplex {
		if (z instanceof xComplex || z instanceof Complex) {
			return new xComplex(this.real.plus(z.real), this.imag.plus(z.imag));
		}
		return new xComplex(this.real.plus(z), this.imag);
	}
	/**
	 * negative of this complex number
	 */
	negative(): xComplex {
		return new xComplex(this.real.negative(), this.imag.negative());
	}
	/**
	 * complex number subtraction
	 */
	minus(z: number | Fraction | Complex | xComplex): xComplex {
		if (typeof z === 'number') {
			return this.plus(new xComplex(-z, 0));
		}
		return this.plus(z.negative());
	}
	/**
	 * complex number multiplication
	 */
	times(z: number | Fraction | Complex | xComplex): xComplex {
		if (z instanceof xComplex || z instanceof Complex) {
			return new xComplex(
				this.real.times(z.real).minus(this.imag.times(z.imag)),
				this.real.times(z.imag).plus(this.imag.times(z.real)),
			);
		}
		return new xComplex(this.real.times(z), this.imag.times(z));
	}
	/**
	 * complex conjugation
	 */
	conjugate(): xComplex {
		return new xComplex(this.real, this.imag.negative());
	}
	/**
	 * r^2 = |z|^2
	 */
	rSquared(): Expression {
		return this.times(this.conjugate()).real.clone();
	}
	/**
	 * z^n
	 */
	pow(n: number): xComplex {
		if (!Number.isInteger(n) || n < 0) {
			throw new Error(`invalid exponent ${n}: only non-negative integers supported`);
		}
		let result = new xComplex(1, 0);
		for (let i = 0; i < n; i++) {
			result = result.times(this);
		}
		return result;
	}
	/**
	 * z^2
	 */
	square(): xComplex {
		return this.times(this);
	}
	clone(): xComplex {
		return new xComplex(this.real, this.imag);
	}
}
