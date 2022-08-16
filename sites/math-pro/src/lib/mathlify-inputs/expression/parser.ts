import { Fraction, gcd, Polynomial } from 'mathlify';

/**
 * checks if an input is a valid expression a + bx or ax + b or a
 *
 * @returns [validity, {poly}] where polynomial is in descending order
 */
export const isValid = (x: string): [boolean, { poly?: Polynomial }?] => {
	if (typeof x === 'string') {
		x = x.trim();
		if (x.length === 0) {
			return [false];
		}
	} else {
		return [false];
	}
	const complexRegex = /^(.+)(-|[+])(.+)$/;
	if (complexRegex.test(x)) {
		const match = x.match(complexRegex);
		const [firstTerm, secondTerm] = [match[1], match[3]];
		const [realValid, realFraction] = isValidFraction(firstTerm);
		const [xTermValid, xTermCoeff] = isValidXTerm(secondTerm);
		if (realValid && xTermValid) {
			return [
				true,
				{
					poly: new Polynomial(
						[match[2] === '+' ? xTermCoeff : xTermCoeff.negative(), realFraction],
						{ unknown: 'n' },
					),
				},
			];
		}
		const [realValid2, realFraction2] = isValidFraction(secondTerm);
		const [xTermValid2, xTermCoeff2] = isValidXTerm(firstTerm);
		if (realValid2 && xTermValid2) {
			return [
				true,
				{
					poly: new Polynomial(
						[xTermCoeff2, match[2] === '+' ? realFraction2 : realFraction2.negative()],
						{ unknown: 'n' },
					),
				},
			];
		}
	} else {
		// single term
		const frac = isValidFraction(x);
		if (frac[0]) {
			return [true, { poly: new Polynomial([frac[1]], { unknown: 'n' }) }];
		}
		const xTerm = isValidXTerm(x);
		if (xTerm[0]) {
			return [true, { poly: new Polynomial([xTerm[1], 0], { unknown: 'n' }) }];
		}
		if (x === '-n') {
			return [true, { poly: new Polynomial([-1, 0], { unknown: 'n' }) }];
		}
	}
	return [false];
};

// TODO: currently only works for letter n
const isValidXTerm = (term: string): [boolean, Fraction?] => {
	const iRegex = /^(.*)n$/;
	if (iRegex.test(term)) {
		const match = term.match(iRegex);
		const coeff = match[1];
		if (coeff === '') {
			return [true, new Fraction(1)];
		} else if (isValidFraction(coeff)) {
			return isValidFraction(coeff);
		} else {
			return [false];
		}
	} else {
		return [false];
	}
};

/**
 * checks if input is valid, as an integer string, a decimal string, or a fraction latex string '\\frac{}{}'
 *
 * @returns [validity, type(int/decimal/fraction/mixedFraction), Fraction]
 */
const isValidFraction = (x: string): [boolean, Fraction?] => {
	if (isInteger(x)) {
		return [true, new Fraction(Number(x))];
	} else if (isDecimal(x)[0]) {
		return [true, isDecimal(x)[1]];
	} else if (isFraction(x)[0]) {
		return [true, isFraction(x)[1]];
	} else if (isMixedFraction(x)[0]) {
		return [true, isMixedFraction(x)[1]];
	} else {
		return [false];
	}
};

function isMixedFraction(x: string): [boolean, Fraction?, boolean?] {
	const mixedFractionRegex = /^(-?[1-9]\d*)\\frac\{([1-9]\d*)\}\{([1-9]\d*)\}$/;
	if (!mixedFractionRegex.test(x)) {
		return [false];
	}
	const match = x.match(mixedFractionRegex);
	const integer = Number(match[1]);
	const [num, den] = [Number(match[2]), Number(match[3])];
	const fractionalPart = new Fraction(num, den);
	const fraction =
		integer < 0 ? fractionalPart.negative().minus(integer) : fractionalPart.plus(integer);
	const simplified = gcd(num, den) === 1 && num !== 0 && num < den;
	return [true, fraction, simplified];
}

/**
 * @returns [validity, fraction, simplified]
 */
function isFraction(x: string): [boolean, Fraction?, boolean?] {
	const regex = /^(-?)\\frac\{((?:0)|(?:[1-9]\d*))\}\{([1-9]\d*)\}$/;
	const regex2 = /^()\\frac\{(-?(?:0|(?:[1-9]\d*)))\}\{([1-9]\d*)\}$/;
	if (!regex.test(x) && !regex2.test(x)) {
		return [false];
	}
	const match = regex.test(x) ? x.match(regex) : x.match(regex2);
	const [negative, num, den] = [match[1] === '-', Number(match[2]), Number(match[3])];
	const fraction = negative ? new Fraction(num, den).negative() : new Fraction(num, den);
	const simplified = gcd(num, den) === 1 && num !== 0 && den !== 1;
	return [true, fraction, simplified];
}
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
