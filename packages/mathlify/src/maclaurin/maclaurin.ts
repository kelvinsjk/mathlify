import { Fraction, Polynomial, numberToFraction } from '../core';
import { factorial } from '../stats/simple-statistics/factorial';

export const Maclaurin = {
	/**
	 * binomial expansion of (1+x)^n
	 *
	 * @param degree: highest power to include in power series
	 * @param options defaults to {x: 'x'}
	 */
	binomial(degree: number, n: number | Fraction, options?: { x?: string | Polynomial }): Polynomial {
		const { x: xOptions } = {
			x: 'x',
			...options,
		};
		const x = typeof xOptions === 'string' ? new Polynomial([1, 0], { variable: xOptions }) : xOptions;
		n = numberToFraction(n);
		const coeffs: Fraction[] = [];
		for (let i = 0; i <= degree; i++) {
			let coeff = Fraction.ONE;
			for (let j = 0; j < i; j++) {
				coeff = coeff.times(n.minus(j)).divide(j + 1);
			}
			coeffs.push(coeff);
		}
		return new Polynomial(coeffs, { ascending: true, variable: x.variable }).replaceXWith(x);
	},

	/**
	 * power series for e^x
	 */
	exp(degree: number, options?: { x?: string | Polynomial }): Polynomial {
		const { x: xOptions } = {
			x: 'x',
			...options,
		};
		const x = typeof xOptions === 'string' ? new Polynomial([1, 0], { variable: xOptions }) : xOptions;
		const coeffs: Fraction[] = [];
		for (let i = 0; i <= degree; i++) {
			const coeff = new Fraction(1, factorial(i));
			coeffs.push(coeff);
		}
		return new Polynomial(coeffs, { ascending: true, variable: x.variable }).replaceXWith(x);
	},

	/**
	 * power series for sin(x)
	 */
	sin(degree: number, options?: { x?: string | Polynomial }): Polynomial {
		const { x: xOptions } = {
			x: 'x',
			...options,
		};
		const x = typeof xOptions === 'string' ? new Polynomial([1, 0], { variable: xOptions }) : xOptions;
		const coeffs: Fraction[] = [];
		for (let i = 0; i <= degree; i++) {
			const coeff = i % 2 === 0 ? Fraction.ZERO : new Fraction(1, factorial(i)).times(Math.pow(-1, (i - 1) / 2));
			coeffs.push(coeff);
		}
		return new Polynomial(coeffs, { ascending: true, variable: x.variable }).replaceXWith(x);
	},

	/**
	 * power series for cos(x)
	 */
	cos(degree: number, options?: { x?: string | Polynomial }): Polynomial {
		const { x: xOptions } = {
			x: 'x',
			...options,
		};
		const x = typeof xOptions === 'string' ? new Polynomial([1, 0], { variable: xOptions }) : xOptions;
		const coeffs: Fraction[] = [];
		for (let i = 0; i <= degree; i++) {
			const coeff = i % 2 === 0 ? new Fraction(1, factorial(i)).times(Math.pow(-1, i / 2)) : Fraction.ZERO;
			coeffs.push(coeff);
		}
		return new Polynomial(coeffs, { ascending: true, variable: x.variable }).replaceXWith(x);
	},

	/**
	 * power series for ln(1+x)
	 */
	ln(degree: number, options?: { x?: string | Polynomial }): Polynomial {
		const { x: xOptions } = {
			x: 'x',
			...options,
		};
		const x = typeof xOptions === 'string' ? new Polynomial([1, 0], { variable: xOptions }) : xOptions;
		const coeffs: Fraction[] = [];
		for (let i = 0; i <= degree; i++) {
			const coeff = i === 0 ? Fraction.ZERO : new Fraction(1, i).times(Math.pow(-1, i + 1));
			coeffs.push(coeff);
		}
		return new Polynomial(coeffs, { ascending: true, variable: x.variable }).replaceXWith(x);
	},
};
