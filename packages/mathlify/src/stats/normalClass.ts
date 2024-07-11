import { normCdf, invNorm } from './normalFns';

export class Normal {
	/**
	 * class representing normally distributed random variable X ~ N(mu, sigma^2)
	 */
	mean: number;
	sd: number;
	variance: number;
	sdMode: boolean;
	name: string;

	////
	// constructor
	////
	/**
	 * Creates a new normal r.v. instance
	 *
	 * @param mean population mean mu
	 * @param variance population variance sigma^2
	 * @param options default to {name: 'X', sdMode: false} where sdMode indicate sd instead of
	 * variance is provided
	 *
	 */
	constructor(mean: number, variance = 1, options?: { name?: string; sdMode?: boolean }) {
		const { name, sdMode } = {
			name: 'X',
			sdMode: false,
			...options,
		};
		this.mean = mean;
		if (variance < 0) {
			throw new RangeError('variance must be non-negative');
		}
		this.variance = sdMode ? variance * variance : variance;
		this.sd = sdMode ? variance : Math.sqrt(variance);
		this.sdMode = sdMode;
		this.name = name;
	}

	/**
	 * adds two independently distributed normal r.v.
	 *
	 */
	plus(Y: number | Normal, options?: { name?: string }): Normal {
		if (typeof Y === 'number') {
			Y = new Normal(Y, 0);
		}
		const { name } = {
			name: `${this.name}+${Y.name}`,
			...options,
		};
		return new Normal(this.mean + Y.mean, this.variance + Y.variance, { name });
	}
	/**
	 * multiplies by a scalar, nX ~ (n mu, n^2 sigma^2)
	 *
	 */
	times(n: number, options?: { name?: string }): Normal {
		const { name } = {
			name: `${n}${this.name}`,
			...options,
		};
		return new Normal(this.mean * n, this.variance * n * n, { name });
	}
	/**
	 * divides by a scalar, 1/n X ~ (mu/n, sigma^2/n^2)
	 *
	 */
	divide(n: number, options?: { name?: string }): Normal {
		if (n === 0) {
			throw new RangeError('cannot divide by 0');
		}
		const { name } = {
			name: `\\frac{1}{${n}} ${this.name}`,
			...options,
		};
		return this.times(1 / n, { name });
	}
	/**
	 * subtracts independently distributed normal r.v., this - Y
	 *
	 */
	minus(Y: number | Normal, options?: { name?: string }): Normal {
		if (typeof Y === 'number') {
			Y = new Normal(Y, 0);
		}
		const { name } = {
			name: `${this.name}-${Y.name}`,
			...options,
		};
		return this.plus(Y.times(-1), { name });
	}
	/**
	 * sum X1 + ... + Xn ~ N(n mu, n sigma^2)
	 */
	sum(n: number, options?: { name?: string }): Normal {
		const { name } = {
			name: `${this.name}_1 + \\cdots + ${this.name}_{${n}}`,
			...options,
		};
		return new Normal(this.mean * n, this.variance * n, { name });
	}
	/**
	 * sample mean XBar ~ N (mu, sigma^2 / n)
	 */
	bar(n: number): Normal {
		return new Normal(this.mean, this.variance / n);
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
	invNorm(p: number, mode: 'center' | 'left' | 'right' | 'l' | 'c' | 'r' = 'left'): number {
		return invNorm(p, this.mean, Math.sqrt(this.variance), mode);
	}

	/**
	 * toString: returns `X ~ N(mu, sigma^2)`
	 *
	 * @param name symbol representing the r.v. (default `X`)
	 */
	toString(): string {
		const mean = `${this.mean}`.length > 5 ? this.mean.toPrecision(5) : this.mean;
		let variance: string | number;
		if (this.sdMode) {
			variance = `${this.sd}^2`;
		} else {
			variance = `${this.variance}`.length > 5 ? this.variance.toPrecision(5) : this.variance;
		}
		return `${this.name} \\sim N( ${mean},${variance} )`;
	}
}
