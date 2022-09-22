import { Fraction, Polynomial, VariableTerm, numberToFraction, BasicTerm } from '../core/index';
import { Rational } from '../algebra';

/**
 * function representing k ( f(x) )^n
 */
export class PowerFn {
	/** coefficient k in k( f(x) )^n */
	coeff: Fraction;
	/** "inner" function f(x) */
	fx: Polynomial | SinFn | CosFn | LnFn; //TODO: Exp|Ln|Sin|Cos
	/** Exponent */
	n: Fraction;
	/**
	 * Creates a new PowerFn class
	 * @param options defaults to `{ fx: "x", coeff: 1 }`
	 */
	constructor(
		n: number | Fraction,
		options?: {
			fx?: string | VariableTerm | Polynomial | CosFn | SinFn | LnFn;
			coeff?: number | Fraction;
		},
	) {
		let { fx, coeff } = {
			fx: 'x',
			coeff: 1,
			...options,
		};
		if (typeof fx === 'string') {
			fx = new Polynomial([1, 0], { variable: fx });
		} else if (fx instanceof VariableTerm) {
			fx = new Polynomial([fx.coeff, 0], { variable: fx.variable });
		}
		this.fx = fx;
		this.coeff = numberToFraction(coeff);
		this.n = numberToFraction(n);
	}

	/**
	 * differentiates this expression using chain rule
	 * @return `{ string, power, fPrime }` where string is an attempted string representation of the derivative,
	 * power is the PowerFn n ( f(x) )^(n-1) and fPrime is f'(x)
	 */
	differentiate(): { string: string; power: PowerFn; fPrime: Polynomial | CosFn | SinFn | RationalFn } {
		const power = new PowerFn(this.n.minus(1), { fx: this.fx, coeff: this.coeff.times(this.n) });
		const fPrime = this.fx.differentiate();
		const fPrimeTwo = this.fx.differentiate();
		const coeff =
			fPrime instanceof Polynomial || fPrime instanceof RationalFn
				? this.coeff.times(this.n)
				: this.coeff.times(this.n).times(fPrime.coeff);
		if (!(fPrimeTwo instanceof Polynomial || fPrimeTwo instanceof RationalFn)) {
			fPrimeTwo.coeff = new Fraction(1);
		}
		const term = `${fPrimeTwo} ${new PowerFn(this.n.minus(1), { fx: this.fx })}`;
		const string = `${new BasicTerm(coeff, term)}`;
		return { power, fPrime, string };
	}

	/**
	 * integration of this expression, using the f'(x) ( f(x) )^n formula
	 * by assuming that f'(x) is present
	 */
	integrate(): PowerFn | LnFn {
		if (this.n.isEqualTo(-1)) {
			if (!(this.fx instanceof Polynomial && this.fx.degree === 1)) {
				throw new Error(`Only polynomials of degree 1 supported for inner integrand ${this.fx}`);
			}
			return new LnFn({ fx: this.fx, coeff: this.coeff.divide(this.fx.coeffs[1]), modulus: true });
		} else {
			return new PowerFn(this.n.plus(1), { fx: this.fx, coeff: this.coeff.divide(this.n.plus(1)) });
		}
	}

	times(x: number | Fraction): PowerFn {
		return new PowerFn(this.n, { fx: this.fx, coeff: this.coeff.times(x) });
	}

	divide(x: number | Fraction): PowerFn {
		return new PowerFn(this.n, { fx: this.fx, coeff: this.coeff.divide(x) });
	}

	/**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */
	toString(): string {
		let fxN: string;
		if (this.n.isEqualTo(0)) {
			fxN = '';
		} else if (this.n.isEqualTo(1)) {
			fxN = `${this.fx}`;
		} else {
			const nString = `${this.n}`.length === 1 ? `${this.n}` : `{${this.n}}`;
			if (this.fx instanceof CosFn || this.fx instanceof SinFn) {
				const cos = this.fx instanceof CosFn ? '\\cos' : '\\sin';
				const fxString = this.fx.fx.terms.length === 1 ? `${this.fx.fx}` : `\\left( ${this.fx.fx} \\right)`;
				fxN = `${cos}^${nString} ${fxString}`;
			} else {
				fxN = `${this.fx}`.length === 1 ? `${this.fx}^${nString}` : `\\left( ${this.fx} \\right)^${nString}`;
			}
		}
		return `${new BasicTerm(this.coeff, fxN)}`;
	}
}

/**
 * function representing k sin ( f(x) )
 */
export class SinFn {
	/** coefficient k in k sin ( f(x) ) */
	coeff: Fraction;
	/** "inner" function f(x) */
	fx: Polynomial; //TODO: Exp|Ln|Sin|Cos
	/**
	 * Creates a new SinFn class
	 * @param options defaults to `{ fx: "x", coeff: 1 }`
	 */
	constructor(options?: { fx?: string | VariableTerm | Polynomial; coeff?: number | Fraction }) {
		let { fx, coeff } = {
			fx: 'x',
			coeff: 1,
			...options,
		};
		if (typeof fx === 'string') {
			fx = new Polynomial([1, 0], { variable: fx });
		} else if (fx instanceof VariableTerm) {
			fx = new Polynomial([fx.coeff, 0], { variable: fx.variable });
		}
		this.fx = fx;
		this.coeff = numberToFraction(coeff);
	}

	/** differentiates this expression */
	differentiate(): CosFn {
		//TODO: chain rule version
		return new CosFn({ fx: this.fx, coeff: this.coeff });
	}

	/** integrates this expression */
	integrate(): CosFn {
		//TODO: chain rule version
		return new CosFn({ fx: this.fx, coeff: this.coeff.negative() });
	}

	/**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */
	toString(): string {
		let fxString: string = '';
		if (this.fx instanceof Polynomial) {
			fxString = this.fx.terms.length === 1 ? `${this.fx}` : `\\left( ${this.fx} \\right)`;
		}
		return `${new BasicTerm(this.coeff, `\\sin ${fxString}`)}`;
	}
}

/**
 * function representing k cos ( f(x) )
 */
export class CosFn {
	/** coefficient k in k cos ( f(x) ) */
	coeff: Fraction;
	/** "inner" function f(x) */
	fx: Polynomial; //TODO: Exp|Ln|Sin|Cos
	/**
	 * Creates a new CosFn class
	 * @param options defaults to `{ fx: "x", coeff: 1 }`
	 */
	constructor(options?: { fx?: string | VariableTerm | Polynomial; coeff?: number | Fraction }) {
		let { fx, coeff } = {
			fx: 'x',
			coeff: 1,
			...options,
		};
		if (typeof fx === 'string') {
			fx = new Polynomial([1, 0], { variable: fx });
		} else if (fx instanceof VariableTerm) {
			fx = new Polynomial([fx.coeff, 0], { variable: fx.variable });
		}
		this.fx = fx;
		this.coeff = numberToFraction(coeff);
	}

	/** differentiates this expression */
	differentiate(): SinFn {
		//TODO: chain rule version
		return new SinFn({ fx: this.fx, coeff: this.coeff.negative() });
	}

	/** integrates this expression */
	integrate(): SinFn {
		//TODO: chain rule version
		return new SinFn({ fx: this.fx, coeff: this.coeff });
	}

	/**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */
	toString(): string {
		let fxString: string = '';
		if (this.fx instanceof Polynomial) {
			fxString = this.fx.terms.length === 1 ? `${this.fx}` : `\\left( ${this.fx} \\right)`;
		}
		return `${new BasicTerm(this.coeff, `\\cos ${fxString}`)}`;
	}
}

/**
 * function representing k ln ( f(x) )
 */
export class LnFn {
	/** coefficient k in k ln ( f(x) ) */
	coeff: Fraction;
	/** "inner" function f(x) */
	fx: Polynomial; //TODO: Exp|Ln|Sin|Cos
	/** modulus allows for k ln |f(x)|*/
	modulus: boolean;
	/**
	 * Creates a new SinFn class
	 * @param options defaults to `{ fx: "x", coeff: 1 }`
	 */
	constructor(options?: { fx?: string | VariableTerm | Polynomial; coeff?: number | Fraction; modulus?: boolean }) {
		let { fx, coeff, modulus } = {
			fx: 'x',
			coeff: 1,
			modulus: false,
			...options,
		};
		if (typeof fx === 'string') {
			fx = new Polynomial([1, 0], { variable: fx });
		} else if (fx instanceof VariableTerm) {
			fx = new Polynomial([fx.coeff, 0], { variable: fx.variable });
		}
		this.fx = fx;
		this.coeff = numberToFraction(coeff);
		this.modulus = modulus;
	}

	/** differentiates this expression */
	differentiate(): RationalFn {
		return new RationalFn(this.fx.differentiate().times(this.coeff), this.fx);
	}

	///** integrates this expression */
	//integrate(): CosFn {
	//	//TODO: chain rule version
	//	return new CosFn({ fx: this.fx, coeff: this.coeff.negative() });
	//}

	/**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */
	toString(): string {
		if (this.modulus) {
			return `${new BasicTerm(this.coeff, `\\ln \\left| ${this.fx} \\right|`)}`;
		}
		let fxString = `${this.fx}`;
		if (this.fx instanceof Polynomial) {
			fxString = this.fx.terms.length === 1 ? `${this.fx}` : `\\left( ${this.fx} \\right)`;
		}
		return `${new BasicTerm(this.coeff, `\\ln ${fxString}`)}`;
	}
}

/**
 * function representing f(x) / g(x)
 * the RationalFn extends the Rational class by allowing differentiation
 */
export class RationalFn extends Rational {
	constructor(
		num: Polynomial | number | Fraction,
		den: Polynomial | Fraction | number = 1,
		options?: { poles?: (number | Fraction)[] },
	) {
		super(num, den, options);
	}

	/** differentiates this expression */
	differentiate(): RationalFn {
		return new RationalFn(
			this.den.times(this.num.differentiate()).minus(this.num.times(this.den.differentiate())),
			this.num.square(),
			{ poles: this.poles },
		);
	}

	///** integrates this expression */
	//integrate(): void {
	//	//TODO: chain rule version
	//
	//}
}
