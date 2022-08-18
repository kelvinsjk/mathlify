import { Polynomial } from '../core';
import { PowerFn, CosFn, SinFn } from './classes';

/**
 * Parametric Eqn class
 */
export class Parametric {
	x: Polynomial | PowerFn | CosFn | SinFn;
	y: Polynomial | PowerFn | CosFn | SinFn;

	constructor(x: Polynomial | PowerFn | CosFn | SinFn, y: Polynomial | PowerFn | CosFn | SinFn) {
		this.x = x;
		this.y = y;
	}

	/**
	 * the derivative dydx
	 * @return `{num, den, string}`
	 */
	dydx(): string {
		const dydt = this.y instanceof PowerFn ? this.y.derivative().string : `${this.y.differentiate()}`;
		const dxdt = this.x instanceof PowerFn ? this.x.derivative().string : `${this.x.differentiate()}`;
		return `\\frac{${dydt}}{${dxdt}}`;
	}
}
