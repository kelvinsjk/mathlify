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
	} else if (isDecimal(x)[0]) {
		return [true, { type: 'decimal', fraction: isDecimal(x)[1], simplified: true }];
	} else {
		return [false];
	}
};
function isDecimal(x: string): [boolean, Fraction?] {
	const regex = /^(-?\d*)(\.)(\d+)/;
	const match = x.match(regex);
	if (match === null) {
		return [false];
	}
	const [integerString, decimal] = [match[1], Number(match[3])];
	const integer = integerString === '-' ? 0 : Number(integerString);
	let fractionalPart = new Fraction(decimal, Math.pow(10, decimal.toString().length));
	if (integerString[0] === '-') {
		fractionalPart = fractionalPart.negative();
	}
	const fraction = fractionalPart.plus(integer);
	return [true, fraction];
}

function isInteger(x: string): boolean {
	const regex = /^[1-9]\d*$/;
	const negativeRegex = /^-[1-9]\d*$/;
	return regex.test(x) || x === '0' || negativeRegex.test(x);
}
