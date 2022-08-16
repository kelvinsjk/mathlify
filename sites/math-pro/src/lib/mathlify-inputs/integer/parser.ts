import { Fraction } from 'mathlify';

/**
 * checks if input is valid, as an integer string, a decimal string, or a fraction latex string '\\frac{}{}'
 *
 * @returns [validity, type(int/decimal/fraction/mixedFraction), Fraction]
 */
export const isValid = (
	x: string,
): [boolean, { type?: string; fraction?: Fraction; simplified?: boolean }?] => {
	if (typeof x === 'string') {
		x = x.trim();
		if (x.length === 0) {
			return [false];
		}
	} else {
		return [false];
	}
	if (isInteger(x)) {
		return [true, { type: 'int', fraction: new Fraction(Number(x)), simplified: true }];
	} else {
		return [false];
	}
};

function isInteger(x: string): boolean {
	const regex = /^[1-9]\d*$/;
	const negativeRegex = /^-[1-9]\d*$/;
	return regex.test(x) || x === '0' || negativeRegex.test(x);
}
