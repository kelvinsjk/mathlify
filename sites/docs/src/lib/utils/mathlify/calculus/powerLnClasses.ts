import { NthRoot, Polynomial, Term, toFraction, type Fraction } from 'mathlify';
import { PolynomialFn } from './polynomialFnClass';

/**
 * k ( f(x) )^n function, where f(x) is a polynomial
 */
export class PowerFn {
	coefficient: Fraction;
	n: Fraction;
	numericalFn: (x: number) => number;
	fx: PolynomialFn;

	constructor(
		n: number | Fraction,
		fx: string | Polynomial | PolynomialFn = 'x',
		coefficient: number | Fraction = 1
	) {
		this.n = toFraction(n);
		this.coefficient = toFraction(coefficient);
		let fxFn: PolynomialFn;
		if (typeof fx === 'string') {
			fxFn = new PolynomialFn([1, 0], { variableAtom: fx });
		} else if (fx instanceof Polynomial) {
			fxFn = new PolynomialFn(fx.coefficients, { variableAtom: fx.variableAtom, ascending: true });
			if (fx instanceof Polynomial && !fx.ascending) {
				fxFn.changeAscending();
			}
		} else {
			fxFn = fx;
		}
		this.numericalFn = (x: number) =>
			Math.pow(fxFn.numericalFn(x), this.n.valueOf()) * this.coefficient.valueOf();
		this.fx = fxFn;
	}

	/**
	 * negative
	 */
	negative(): PowerFn {
		return new PowerFn(this.n.clone(), this.fx.clone(), this.coefficient.negative());
	}

	/**
	 * differentiates the power function
	 */
	derivative(): PowerFn | [PolynomialFn, PowerFn] {
		if (this.fx.degree === 1) {
			return new PowerFn(
				this.n.minus(1),
				this.fx.clone(),
				this.coefficient.times(this.fx.coefficients[1]).times(this.n)
			);
		}
		return [
			this.fx.derivative(),
			new PowerFn(this.n.minus(1), this.fx.clone(), this.coefficient.clone())
		];
	}

	/**
	 * integrates the power expression
	 *
	 * only valid if f(x) is a linear function
	 *
	 * assumes constant of integration is 0
	 */
	integral(): LnFn | PowerFn {
		if (this.fx.degree !== 1) {
			throw new Error(`integral only valid for linear fx. ${this.fx} invalid`);
		}
		if (this.n.isEqualTo(-1)) {
			return new LnFn(this.fx.clone(), this.coefficient.divide(this.fx.coefficients[1]));
		}
		return new PowerFn(
			this.n.plus(1),
			this.fx.clone(),
			this.coefficient.divide(this.n.plus(1)).divide(this.fx.coefficients[1])
		);
	}

	/**
	 * @returns the definite integral
	 */
	definiteIntegral(lower: number | Fraction, upper: number | Fraction): number {
		return (
			this.integral().numericalFn(upper.valueOf()) - this.integral().numericalFn(lower.valueOf())
		);
	}

	/**
	 *
	 */
	subXAs(x: number | Fraction): Fraction | undefined {
		x = toFraction(x);
		if (this.n.isEqualTo(0)) {
			return this.coefficient;
		}
		if (this.n.isInteger()) {
			return this.coefficient.times(x.pow(this.n.valueOf()));
		}
		x = this.n.isLessThan(0) ? x.reciprocal() : x;
		const radical = new NthRoot(this.n.den, x.pow(this.n.num), this.coefficient);
		return radical.isRational() ? radical.coeff : undefined;
	}

	/**
	 * returns latex string
	 */
	toString(options?: { brackets?: boolean }): string {
		const { brackets } = { brackets: false, ...options };
		if (this.n.isEqualTo(0)) {
			return this.coefficient.toString();
		}
		if (this.n.isLessThan(0)) {
			const term = brackets ? `\\left(${this.fx.toString()}\\right)` : this.fx.toString();
			const sign = this.coefficient.isLessThan(0) ? '-' : '';
			return this.n.isEqualTo(-1)
				? `${sign} \\frac{${this.coefficient.abs()}}{${term}}`
				: `${sign} \\frac{${this.coefficient.abs()}}{${term}^{${this.n.abs()}}}`;
		}
		const variableAtom = brackets ? `\\left(${this.fx.toString()}\\right)` : this.fx.toString();
		const variable = this.n.isEqualTo(1) ? variableAtom : `${variableAtom}^{${this.n}}`;
		const term = new Term(this.coefficient, variable);
		return term.toString();
	}

	multiply(k: number | Fraction): PowerFn {
		return new PowerFn(this.n.clone(), this.fx.clone(), this.coefficient.times(k));
	}

	/**
	 * clone
	 */
	clone(): PowerFn {
		return new PowerFn(this.n.clone(), this.fx.clone(), this.coefficient.clone());
	}
}

/**
 * k ln f(x) function, where f(x) is a polynomial
 */
export class LnFn {
	coefficient: Fraction;
	numericalFn: (x: number) => number;
	fx: PolynomialFn;

	constructor(fx: string | Polynomial | PolynomialFn = 'x', coefficient: number | Fraction = 1) {
		this.coefficient = toFraction(coefficient);
		let fxFn: PolynomialFn;
		if (typeof fx === 'string') {
			fxFn = new PolynomialFn([1, 0], { variableAtom: fx });
		} else if (fx instanceof Polynomial) {
			fxFn = new PolynomialFn(fx.coefficients, { variableAtom: fx.variableAtom, ascending: true });
			if (fx instanceof Polynomial && !fx.ascending) {
				fxFn.changeAscending();
			}
		} else {
			fxFn = fx;
		}
		this.numericalFn = (x: number) => Math.log(fxFn.numericalFn(x)) * this.coefficient.valueOf();
		this.fx = fxFn;
	}

	/**
	 * differentiates the logarithm term
	 */
	derivative(): PowerFn | [PolynomialFn, PowerFn] {
		if (this.fx.degree === 1) {
			return new PowerFn(-1, this.fx.clone(), this.coefficient.times(this.fx.coefficients[1]));
		}
		return [this.fx.derivative(), new PowerFn(-1, this.fx.clone(), this.coefficient)];
	}

	/**
	 * returns latex string
	 */
	toString(options?: { brackets?: boolean; modulus?: boolean }): string {
		const { brackets, modulus } = { brackets: false, modulus: false, ...options };
		const lBracket = brackets ? '\\left( ' : modulus ? '\\left| ' : '';
		const rBracket = brackets ? '\\right)' : modulus ? '\\right|' : '';
		const term = new Term(this.coefficient, `\\ln ${lBracket}${this.fx}${rBracket}`);
		return term.toString();
	}

	multiply(k: number | Fraction): LnFn {
		return new LnFn(this.fx.clone(), this.coefficient.times(k));
	}

	/**
	 * clone
	 */
	clone(): LnFn {
		return new LnFn(this.fx.clone(), this.coefficient.clone());
	}
}
