import { Fraction, Polynomial, Term, toFraction } from 'mathlify';

/**
 * AP class `{a: first term, d: common difference}`
 *
 */
export class AP {
	//// instance properties
	/** a: first term */
	a: Fraction;
	/** d: common difference */
	d: Fraction;

	//// constructor
	/**
	 * Creates a new AP instance
	 * @param a first term
	 * @param d common difference
	 */
	constructor(a: number | Fraction, d: number | Fraction = 1) {
		this.a = toFraction(a);
		this.d = toFraction(d);
	}

	/**
	 * u_n
	 *
	 * @param n variable name (defaults to `n`)
	 *
	 * returns the nth term a+(n-1)d = a-d + n d as a linear polynomial in n
	 */
	uN(n = 'n'): Polynomial {
		return new Polynomial([this.a.minus(this.d), this.d], { variableAtom: n, ascending: true });
	}

	/**
	 * @returns the value of u_n
	 */
	uNAt(n: number): Fraction {
		return this.uN().subXAs(n);
	}

	/**
	 * S_n
	 *
	 * @param n variable name (defaults to `n`)
	 *
	 * returns the sum of n terms 1/2 (n)(2a + (n-1)d)
	 * = 1/2 (2an + dn^2 - dn)
	 * = d/2 n^2 + (a-d/2) n
	 *  as a linear polynomial in n
	 */
	sN(n = 'n'): Polynomial {
		return new Polynomial([this.d.divide(2), this.a.minus(this.d.divide(2)), 0], {
			variableAtom: n,
		});
	}

	/**
	 * @returns the value of S_n
	 */
	sNAt(n: number): Fraction {
		return this.sN().subXAs(n);
	}
	/**
	 * uN formula
	 */
	static uNFormula(options?: Partial<APParameters>): string {
		options = {
			a: 'a',
			d: 'd',
			n: 'n',
			...options,
		};
		const [a, d, n] = [options.a, options.d, options.n];
		return `${a} + \\left( ${n} - 1 \\right) ${d}`;
	}

	/**
	 * sN formula
	 */
	static sNFormula(options?: Partial<APParameters>): string {
		options = {
			a: 'a',
			d: 'd',
			n: 'n',
			...options,
		};
		const [a, d, n] = [options.a, options.d, options.n];
		return `\\frac{${n}}{2} \\Big( 2${a} + \\left( ${n} - 1 \\right) ${d} \\Big)`;
	}
}

/**
 * GP class `{a: first term, d: common difference}`
 *
 */
export class GP {
	//// instance properties
	/** a: first term */
	a: Fraction;
	/** r: common ratio */
	r: Fraction;

	//// constructor
	/**
	 * Creates a new GP instance
	 * @param a first term
	 * @param r common ratio
	 */
	constructor(a: number | Fraction, r: number | Fraction) {
		this.a = toFraction(a);
		this.r = toFraction(r);
	}

	/**
	 * u_n
	 *
	 * @param n variable name (defaults to `n`)
	 *
	 * returns the nth term as a `Term` class for typesetting
	 */
	uN(n = 'n'): Term {
		const nMinus1 = new Polynomial([1, -1], { variableAtom: n });
		const rPower = `\\left( ${this.r} \\right)^{${nMinus1}}`;
		return new Term(this.a, rPower);
	}

	/**
	 * @returns the value of u_n
	 */
	uNAt(n: number): Fraction {
		return this.a.times(this.r.pow(n - 1));
	}

	/**
	 * S_n
	 *
	 * @param n variable name (defaults to `n`)
	 *
	 * returns the sum of n terms as a `Term` class for typesetting
	 */
	sN(n = 'n'): Term {
		const coeff = this.a.divide(Fraction.ONE.minus(this.r));
		const r = this.r.isInteger() ? this.r : `\\left(${this.r}\\right)`;
		const variable = coeff.isGreaterThan(0)
			? `\\Big( 1 - ${r}^${n} \\Big)`
			: `\\Big( ${r}^${n} -1 \\Big)`;
		return new Term(coeff.abs(), variable);
	}

	/**
	 * @returns the value of S_n
	 */
	sNAt(n: number): Fraction {
		const coeff = this.a.divide(Fraction.ONE.minus(this.r));
		return coeff.times(Fraction.ONE.minus(this.r.pow(n)));
	}

	/**
	 * @return S_infty
	 */
	sInfty(): Fraction {
		return this.a.divide(Fraction.ONE.minus(this.r));
	}

	/**
	 * uN formula
	 */
	static uNFormula(options?: Partial<GPParameters>): string {
		options = {
			a: 'a',
			r: 'r',
			n: 'n',
			...options,
		};
		const [a, r, n] = [options.a, options.r, options.n];
		return `${a}${r}^{${n}-1}`;
	}

	/**
	 * sN formula
	 */
	static sNFormula(options?: Partial<GPParameters>): string {
		options = {
			a: 'a',
			r: 'r',
			n: 'n',
			rFirst: false,
			...options,
		};
		const [a, r, n] = [options.a, options.r, options.n];
		return options.rFirst
			? `\\frac{${a}\\left(${r}^{${n}}-1\\right)}{${r}-1}`
			: `\\frac{${a}\\left(1-${r}^{${n}}\\right)}{1-${r}}`;
	}

	/**
	 * S_infty formula
	 */
	static sInftyFormula(options?: Partial<GPParameters>): string {
		options = {
			a: 'a',
			r: 'r',
			...options,
		};
		const [a, r] = [options.a, options.r];
		return `\\frac{${a}}{1-${r}}`;
	}
}

interface GPParameters {
	a: string;
	r: string;
	n: string;
	rFirst: boolean;
}
interface APParameters {
	a: string;
	d: string;
	n: string;
}
