import { Fraction, Imaginary, Expression, numberToFraction, SquareRoot, Term } from '../core';

/**
 * Complex class representing x + yi
 */
export class Complex extends Expression {
	/** real part of the complex number */
	real: Fraction;
	/** imaginary part of the complex number */
	imag: Fraction;

	/**
	 * Creates a new Complex instance
	 */
	constructor(real: number | Fraction, imag: number | Fraction = 0) {
		const x = numberToFraction(real);
		// const y = new Imaginary(imag);
		super(x, new Term(imag, 'i'));
		this.real = x;
		this.imag = numberToFraction(imag);
	}

	/**
	 * adds two complex numbers
	 */
	plus(z: number | Fraction | Complex): Complex {
		if (z instanceof Complex) {
			return new Complex(this.real.plus(z.real), this.imag.plus(z.imag));
		}
		return new Complex(this.real.plus(z), this.imag);
	}
	/**
	 * negative of this complex number
	 */
	negative(): Complex {
		return new Complex(this.real.negative(), this.imag.negative());
	}
	/**
	 * complex number subtraction
	 */
	minus(z: number | Fraction | Complex): Complex {
		if (typeof z === 'number') {
			return this.plus(new Complex(-z, 0));
		}
		return this.plus(z.negative());
	}
	/**
	 * complex number multiplication
	 */
	times(z: number | Fraction | Complex): Complex {
		if (z instanceof Complex) {
			return new Complex(
				this.real.times(z.real).minus(this.imag.times(z.imag)),
				this.real.times(z.imag).plus(this.imag.times(z.real)),
			);
		}
		return new Complex(this.real.times(z), this.imag.times(z));
	}
	/**
	 * complex conjugation
	 */
	conjugate(): Complex {
		return new Complex(this.real, this.imag.negative());
	}
	/**
	 * r^2 = |z|^2
	 */
	rSquared(): Fraction {
		return this.times(this.conjugate()).real.clone();
	}
	/**
	 * reciprocal
	 */
	reciprocal(): Complex {
		if (this.rSquared().isEqualTo(0)) {
			throw new Error('division by zero');
		}
		return this.conjugate().times(this.rSquared().reciprocal());
	}
	/**
	 * complex division
	 */
	divide(z: number | Fraction | Complex): Complex {
		if (typeof z === 'number') {
			return this.times(new Fraction(1, z));
		}
		return this.times(z.reciprocal());
	}
	/**
	 * r = |z|
	 */
	r(): SquareRoot {
		return new SquareRoot(this.rSquared());
	}
	/**
	 * z^n
	 */
	pow(n: number): Complex {
		if (!Number.isInteger(n) || n < 0) {
			throw new Error(`invalid exponent ${n}: only non-negative integers supported`);
		}
		let result = new Complex(1, 0);
		for (let i = 0; i < n; i++) {
			result = result.times(this);
		}
		return result;
	}
	/**
	 * z^2
	 */
	square(): Complex {
		return this.times(this);
	}

	isReal(): boolean {
		return this.imag.isEqualTo(0);
	}
	isPurelyImaginary(): boolean {
		return this.real.isEqualTo(0);
	}

	isEqualTo(z: Complex | number): boolean {
		if (typeof z === 'number') {
			return this.isReal() && this.real.isEqualTo(z);
		}
		return this.real.isEqualTo(z.real) && this.imag.isEqualTo(z.imag);
	}

	/**
	 * clones this complex number
	 */
	clone(): Complex {
		return new Complex(this.real, this.imag);
	}

	static I = new Complex(0, 1);
}
