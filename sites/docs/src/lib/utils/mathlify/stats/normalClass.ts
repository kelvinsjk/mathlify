import { normCdf, invNorm } from './normal';
import { Fraction } from 'mathlify';

export class Normal {
	/**
	 * class representing normally distributed random variable X ~ N(mu, sigma^2)
	 */
	mean: number;
	variance: number;
	name: string;

	////
	// constructor
	////
	/**
	 * Creates a new normal r.v. instance
	 *
	 * @param mean population mean mu
	 * @param variance population variance sigma^2
	 *
	 */
	constructor(mean: number, variance = 1, name = 'X') {
		this.mean = mean;
		if (variance < 0) {
			throw new RangeError('variance must be non-negative');
		}
		this.variance = variance;
		this.name = name;
	}

	/**
	 * adds two independently distributed normal r.v.
	 *
	 */
	plus(Y: number | Normal, name?: string): Normal {
		if (typeof Y === 'number') {
			Y = new Normal(Y, 0);
		}
		name = name || `${this.name} + ${Y.name}`;
		return new Normal(this.mean + Y.mean, this.variance + Y.variance, name);
	}
	/**
	 * multiplies by a scalar, nX ~ (n mu, n^2 sigma^2)
	 *
	 */
	times(n: number | Fraction, name?: string): Normal {
		let mean: number, variance: number;
		if (typeof n === 'number') {
			mean = this.mean * n;
			variance = this.variance * n * n;
		} else {
			const oldMean = new Fraction(this.mean * 10000, 10000);
			const oldVariance = new Fraction(this.variance * 10000, 10000);
			mean = n.times(oldMean).valueOf();
			variance = n.square().times(oldVariance).valueOf();
		}
		name = name || `${n} ${this.name}`;
		return new Normal(mean, variance, name);
	}
	/**
	 * divides by a scalar, 1/n X ~ (mu/n, sigma^2/n^2)
	 *
	 */
	divide(n: number, name?: string): Normal {
		if (n === 0) {
			throw new RangeError('cannot divide by 0');
		}
		name = name || `\\frac{1}{${n}} ${this.name}`;
		return this.times(1 / n, name);
	}
	/**
	 * subtracts independently distributed normal r.v., this - Y
	 *
	 */
	minus(Y: number | Normal, name?: string): Normal {
		if (typeof Y === 'number') {
			Y = new Normal(Y, 0);
		}
		name = name || `${this.name} - ${Y.name}`;
		return this.plus(Y.times(-1), name);
	}
	/**
	 * sum X1 + ... + Xn ~ N(n mu, n sigma^2)
	 */
	sum(n: number, name?: string): Normal {
		if (name === undefined) {
			if (n > 3) {
				name = `${this.name}_1 + ${this.name}_2 + \\ldots + ${this.name}_{${n}}`;
			} else {
				name =
					n === 2
						? `${this.name}_1 + ${this.name}_2`
						: `${this.name}_1 + ${this.name}_2 + ${this.name}_3`;
			}
		}
		return new Normal(this.mean * n, this.variance * n, name);
	}
	/**
	 * sample mean XBar ~ N (mu, sigma^2 / n)
	 */
	bar(n: number, name?: string): Normal {
		name = name || `\\overline{${this.name}}`;
		return new Normal(this.mean, this.variance / n, name);
	}

	//// probability methods
	/**
	 * less than
	 *
	 * @returns P(X < x)
	 */
	lessThan(x: number): number {
		return normCdf(this.mean, Math.sqrt(this.variance), { upper: x });
	}
	/**
	 * more than
	 *
	 * @returns P(X > x)
	 */
	moreThan(x: number): number {
		return normCdf(this.mean, Math.sqrt(this.variance), { lower: x });
	}
	/**
	 * between
	 *
	 * @returns P(x1 < X < x2)
	 */
	between(x1: number, x2: number): number {
		return normCdf(this.mean, Math.sqrt(this.variance), { lower: x1, upper: x2 });
	}
	/**
	 * invNorm
	 *
	 * @mode defaults to 'left' for left tail, accepts 'right' or 'center'
	 *
	 * @return x such that P(X < x) = p
	 */
	invNorm(p: number, mode = 'left'): number {
		return invNorm(p, this.mean, Math.sqrt(this.variance), mode);
	}

	/**
	 * toString: returns `X ~ N(mu, sigma^2)`
	 *
	 * @param name symbol representing the r.v. (default `X`)
	 */
	toString(options?: { name?: string; align?: boolean }): string {
		options = { align: false, ...options };
		const name = options['name'] || this.name;
		const { align } = { align: false, ...options };
		const alignChar = align ? '&' : ' ';
		const mean = `${this.mean}`.length > 5 ? this.mean.toPrecision(5) : `${this.mean}`;
		const variance =
			`${this.variance}`.length > 5 ? this.variance.toPrecision(5) : `${this.variance}`;
		return `${name} ${alignChar}\\sim \\textrm{N}( ${mean}, ${variance} )`;
	}
}
