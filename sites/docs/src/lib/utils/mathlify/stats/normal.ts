import { errorFunction, zScore } from 'simple-statistics';
import inverseErrorFunction from 'math-erfinv';

/**
 * normCdf(mu, sigma, limits)
 *
 * @param limits defaults to {lower: -infinity, upper: infinity} (implemented by the MAX_VALUE property)
 *
 * @returns P(lower < X < upper)
 *
 * uses  the implementation by [simple-statistics package](https://simplestatistics.org/)
 */
export function normCdf(mu: number, sigma: number, limits: Limits): number {
	const defaultLimits = { lower: -Number.MAX_VALUE, upper: Number.MAX_VALUE };
	const { lower, upper } = { ...defaultLimits, ...limits };
	const z1 = zScore(lower, mu, sigma);
	const z2 = zScore(upper, mu, sigma);
	return (errorFunction(z2 / Math.SQRT2) - errorFunction(z1 / Math.SQRT2)) / 2;
}

/**
 * invNorm(p, mu, sigma, mode)
 *
 * @param mu mean. defaults to 0
 * @param sigma standard deviation. defaults to 1
 * @param mode defaults to 'left' for left tail. Alternatives: 'right', 'center' for right and center
 *
 * @returns x such that P(X < x) = p for left tail. for 'center' mode, P(x1 < X < x2) = p, only x2 will be returned.
 *
 * uses the implementation of the inverse error function from [math-erfinv](https://github.com/math-io/erfinv)
 */
export function invNorm(p: number, mu = 0, sigma = 1, mode = 'left'): number {
	if (mode === 'right' || mode === 'r') {
		p = 1 - p;
	} else if (mode === 'center' || mode === 'c') {
		p = p + (1 - p) / 2;
	}
	//const z = (2 * p - 1 > 0.5) ? probit(p) : Math.SQRT2 * inverseErrorFunction(2 * p - 1);
	const z = inverseErrorFunction(2 * p - 1) * Math.SQRT2;
	return z * sigma + mu;
}

/**
 * zTest(mu, sigma, xBar, n, tail)
 *
 * @param tail `'left'`(default), `'right'` or `'two'`
 * @returns p-value
 *
 * uses  the implementation by [simple-statistics package](https://simplestatistics.org/)
 */
export function zTest(mu: number, sigma: number, xBar: number, n: number, tail = 'left'): number {
	if (tail === 'left' || tail === 'l') {
		return normCdf(mu, sigma / Math.sqrt(n), { upper: xBar });
	} else if (tail === 'right' || tail === 'r') {
		return normCdf(mu, sigma / Math.sqrt(n), { lower: xBar });
	} else {
		// tail === 'two'/'center'/'c'
		const halfP = normCdf(mu, sigma / Math.sqrt(n), xBar <= mu ? { upper: xBar } : { lower: xBar });
		return 2 * halfP;
	}
}

interface Limits {
	lower?: number;
	upper?: number;
}
