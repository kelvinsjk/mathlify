import type { Polynomial } from 'mathlify';
import { bisection } from './bisection';

export function polySolver(poly: Polynomial, left: number, right: number, precision = 5): number {
	const f = (x: number) => {
		let y = 0;
		poly.coefficients.forEach((coefficient, index) => {
			y += coefficient.valueOf() * Math.pow(x, index);
		});
		return y;
	};
	return bisection(f, left, right, precision);
}
