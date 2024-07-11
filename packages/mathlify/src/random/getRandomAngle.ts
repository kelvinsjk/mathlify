import { getRandomInt } from './getRandomInt';
import { Fraction } from '../core';
import { heads } from './coinFlip';

/**
 * generates k in k pi, such that k pi is a special angle
 * @param options defaults to `{ allowReal: false, allowImag: false }` where we allow angles 0,pi for the first option
 * and \pm pi/2 for the second option
 *
 * @param options.avoid Fraction[] to avoid
 */
export function getRandomAngle(options?: { allowReal?: boolean; allowImag?: boolean; avoid?: Fraction[] }): Fraction {
	// 2: 1/2, 3: k/3, 4: k/4, 5: k/6, 6: 0, pi
	const { allowReal, allowImag, avoid } = {
		allowReal: false,
		allowImag: false,
		avoid: [],
		...options,
	};
	let den = getRandomInt(allowImag ? 2 : 3, allowReal ? 6 : 5);
	if (den === 6) {
		den = 1;
	} else if (den === 5) {
		den = 6;
	}
	if (den === 2 && heads()) {
		// equalizes the probability of getting any angle
		return getRandomAngle(options);
	}
	let num = heads() ? 1 : den - 1;
	if (heads()) {
		num = num * -1;
	}
	const k = new Fraction(num, den);
	if (avoid.some((e) => e.isEqualTo(k))) {
		return getRandomAngle(options);
	}
	return k;
}
