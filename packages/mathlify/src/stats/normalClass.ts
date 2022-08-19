import { normCdf, invNorm } from './normalFns';

export class Normal {
	/**
	 * class representing normally distributed random variable X ~ N(mu, sigma^2)
	 */
	mean: number;
	variance: number;

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
	constructor(mean: number, variance = 1) {
		this.mean = mean;
		if (variance < 0) {
			throw new RangeError('variance must be non-negative');
		}
		this.variance = variance;
	}

	/**
	 * adds two independently distributed normal r.v.
	 *
	 */
	plus(Y: number | Normal): Normal {
		if (typeof Y === 'number') {
			Y = new Normal(Y, 0);
		}
		return new Normal(this.mean + Y.mean, this.variance + Y.variance);
	}
	/**
	 * multiplies by a scalar, nX ~ (n mu, n^2 sigma^2)
	 *
	 */
	times(n: number): Normal {
		return new Normal(this.mean * n, this.variance * n * n);
	}
	/**
	 * divides by a scalar, 1/n X ~ (mu/n, sigma^2/n^2)
	 *
	 */
	divide(n: number): Normal {
		if (n === 0) {
			throw new RangeError('cannot divide by 0');
		}
		return this.times(1 / n);
	}
	/**
	 * subtracts independently distributed normal r.v., this - Y
	 *
	 */
	minus(Y: number | Normal): Normal {
		if (typeof Y === 'number') {
			Y = new Normal(Y, 0);
		}
		return this.plus(Y.times(-1));
	}
	/**
	 * sum X1 + ... + Xn ~ N(n mu, n sigma^2)
	 */
	sum(n: number): Normal {
		return new Normal(this.mean * n, this.variance * n);
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
	invNorm(p: number, mode = 'left'): number {
		return invNorm(p, this.mean, Math.sqrt(this.variance), mode);
	}

	/**
	 * toString: returns `X ~ N(mu, sigma^2)`
	 *
	 * @param name symbol representing the r.v. (default `X`)
	 */
	toString(name = 'X'): string {
		return `${name} \\sim N( ${this.mean}, ${this.variance} )`;
	}
}
