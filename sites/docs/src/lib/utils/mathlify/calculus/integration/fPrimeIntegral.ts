import { PolynomialFn } from '../polynomialFnClass';
import type { PowerFn, LnFn } from '../powerLnClasses';
import type { ExpFn } from '../expFnClass';
import type { SinFn, CosFn } from '../sinCosFnClasses';
import { Fraction, toFraction, Term } from 'mathlify';

// TODO: numerical fn

/**
 * representation of f(x)^n
 */
export class GeneralPowerFn {
	coefficient: Fraction;
	fx: PolynomialFn | LnFn | ExpFn | SinFn | CosFn;
	n: Fraction;

	constructor(
		n: number | Fraction,
		fx: PolynomialFn | LnFn | ExpFn | SinFn | CosFn,
		coefficient: number | Fraction = 1,
	) {
		this.n = toFraction(n);
		this.fx = fx.clone();
		this.coefficient = toFraction(coefficient);
	}

	toString(brackets = false): string {
		const lBracket = brackets ? '\\left( ' : '';
		const rBracket = brackets ? ' \\right)' : '';
		const fxString = `${lBracket}${this.fx}${rBracket}`;
		if (this.n.isEqualTo(0)) {
			return this.coefficient.toString();
		}
		if (this.n.abs().isEqualTo(1)) {
			const sign = this.coefficient.isLessThan(0) ? '-' : '';
			return this.n.isEqualTo(1)
				? `${new Term(this.coefficient, fxString)}`
				: `${sign}\\frac{${this.coefficient.abs().num}}{${new Term(
						this.coefficient.abs().den,
						fxString,
				  )}}`;
		}
		if (this.n.isLessThan(0)) {
			const sign = this.coefficient.isLessThan(0) ? '-' : '';
			return `${sign}\\frac{${this.coefficient.abs().num}}{${new Term(
				this.coefficient.abs().den,
				`${fxString}^{${this.n.abs()}}`,
			)}}`;
		}
		return `${new Term(this.coefficient, `${fxString}^${this.n}`)}`;
	}
}

/**
 * representation of ln f(x)
 */
export class GeneralLnFn {
	coefficient: Fraction;
	fx: PolynomialFn | LnFn | ExpFn | SinFn | CosFn | PowerFn;

	constructor(
		fx: PolynomialFn | LnFn | ExpFn | SinFn | CosFn | PowerFn,
		coefficient: number | Fraction = 1,
	) {
		this.fx = fx.clone();
		this.coefficient = toFraction(coefficient);
	}

	toString(options?: { brackets?: boolean; modulus?: boolean }): string {
		const { brackets, modulus } = { brackets: false, modulus: false, ...options };
		const lBracket = brackets ? '\\left( ' : modulus ? '\\left| ' : '';
		const rBracket = brackets ? ' \\right)' : modulus ? ' \\right|' : '';
		const fxString = `${lBracket}${this.fx}${rBracket}`;
		return `${new Term(this.coefficient, `\\ln ${fxString}`)}`;
	}
}

/**
 * representation of e^f(x)
 */
export class GeneralExpFn {
	coefficient: Fraction;
	fx: PolynomialFn | LnFn | ExpFn | SinFn | CosFn | PowerFn;

	constructor(
		fx: PolynomialFn | LnFn | ExpFn | SinFn | CosFn | PowerFn,
		coefficient: number | Fraction = 1,
	) {
		this.fx = fx.clone();
		this.coefficient = toFraction(coefficient);
	}

	toString(brackets = false): string {
		const lBracket = brackets ? '\\left( ' : '';
		const rBracket = brackets ? ' \\right)' : '';
		const fxString = `${lBracket}${this.fx}${rBracket}`;
		return `${new Term(this.coefficient, `\\mathrm{e}^{${fxString}}`)}`;
	}
}

export const fPrime = {
	/** integration of f'(x) f(x)^n */
	n,
	/** integration of f'(x)/f(x) */
	ln,
	/** integration of f'(x) e^{f(x)} */
	exp,
};

/**
 * integrates f'(x) f(x)^n, where n \neq -1
 */
function n(n: number | Fraction, fx: PolynomialFn | ExpFn | SinFn | CosFn | LnFn): GeneralPowerFn {
	if (n.valueOf() === -1) {
		throw new Error('use the ln function instead for n = -1');
	}
	n = toFraction(n);
	const coeff = fx instanceof PolynomialFn ? Fraction.ONE : fx.coefficient;
	return new GeneralPowerFn(n.plus(1), fx, coeff.divide(n.plus(1)));
}

/**
 * integrates f'(x)/f(x)
 */
function ln(fx: PolynomialFn | PowerFn | ExpFn | SinFn | CosFn | LnFn): GeneralLnFn {
	const coeff = fx instanceof PolynomialFn ? Fraction.ONE : fx.coefficient;
	return new GeneralLnFn(fx, coeff);
}

/**
 * integrates f'(x) e^f(x)
 */
function exp(fx: PolynomialFn | PowerFn | ExpFn | SinFn | CosFn | LnFn): GeneralExpFn {
	const coeff = fx instanceof PolynomialFn ? Fraction.ONE : fx.coefficient;
	return new GeneralExpFn(fx, coeff);
}
