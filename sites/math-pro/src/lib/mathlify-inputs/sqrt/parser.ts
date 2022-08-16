import { Fraction, gcd, SquareRoot } from 'mathlify';

/**
 * checks if input is valid, as an integer string, a decimal string, a fraction latex string '\\frac{}{},
 * or a squareRoot
 * '
 *
 * @returns [validity, type(int/decimal/fraction/mixedFraction), Fraction]
 */
export const isValidSqrt = (
	x: string,
): [boolean, { type?: string; sqrt?: SquareRoot; simplified?: boolean }?] => {
	if (typeof x === 'string') {
		x = x.trim();
		if (x.length === 0) {
			return [false];
		}
	} else {
		return [false];
	}
	if (isSquareRoot(x)[0]) {
		return [true, { type: 'sqrt', sqrt: isSquareRoot(x)[1], simplified: isSquareRoot(x)[2] }];
	}
	if (isSquareRootFrac(x)[0]) {
		return [true, { type: 'sqrt', sqrt: isSquareRootFrac(x)[1], simplified: isSquareRoot(x)[2] }];
	}
	if (isInteger(x)) {
		return [true, { type: 'int', sqrt: new SquareRoot(1, Number(x)), simplified: true }];
	} else if (isDecimal(x)[0]) {
		return [true, { type: 'decimal', sqrt: new SquareRoot(1, isDecimal(x)[1]), simplified: true }];
	} else if (isFraction(x)[0]) {
		return [
			true,
			{ type: 'fraction', sqrt: new SquareRoot(1, isFraction(x)[1]), simplified: isFraction(x)[2] },
		];
	} else if (isMixedFraction(x)[0]) {
		return [
			true,
			{
				type: 'mixedFraction',
				sqrt: new SquareRoot(1, isMixedFraction(x)[1]),
				simplified: isMixedFraction(x)[2],
			},
		];
	} else {
		return [false];
	}
};

function isSquareRoot(x: string): [boolean, SquareRoot?, boolean?] {
	const sqrtRegex = /^(.*)\\sqrt\{(.*)\}$/;
	if (!sqrtRegex.test(x)) {
		return [false];
	}
	const match = x.match(sqrtRegex);
	const coeff = match[1];
	const radicand = match[2];
	if (coeff === '') {
		if (isValidFraction(radicand)[0]) {
			return [
				true,
				new SquareRoot(isValidFraction(radicand)[1].fraction),
				isValidFraction(radicand)[1].simplified,
			];
		}
	}
	if (isValidFraction(coeff)[0] && isValidFraction(radicand)[0]) {
		const simplified =
			isValidFraction(radicand)[1].simplified && isValidFraction(coeff)[1].simplified;
		return [
			true,
			new SquareRoot(isValidFraction(radicand)[1].fraction, isValidFraction(coeff)[1].fraction),
			simplified,
		];
	}
	return [false];
}
function isSquareRootFrac(x: string): [boolean, SquareRoot?, boolean?] {
	const sqrtRegex = /^(-?)\\frac\{(.*)\\sqrt\{(.+)\}\}\{(.+)\}$/;
	if (!sqrtRegex.test(x)) {
		return [false];
	}
	const match = x.match(sqrtRegex);
	const negative = match[1];
	const coeff = match[2];
	const radicand = match[3];
	const den = match[4];
	if (
		((isInteger(coeff) && Number(coeff) !== 0) || coeff === '') &&
		isInteger(radicand) &&
		Number(radicand) > 0 &&
		isInteger(den) &&
		Number(den) > 0
	) {
		const coeffNum = coeff === '' ? 1 : Number(coeff);
		const sqrt = new SquareRoot(Number(radicand), new Fraction(coeffNum, Number(den)));
		return [
			true,
			negative === '-' ? sqrt.negative() : sqrt,
			true, // We do not check for simplified version of square root yet
		];
	}
	return [false];
}

/**
 * checks if input is valid, as an integer string, or a fraction latex string '\\frac{}{}'
 *
 * decimals not allowed
 *
 * @returns [validity, type(decimal/fraction/mixedFraction), Fraction]
 */
const isValidFraction = (
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
		return [false];
	} else if (isFraction(x)[0]) {
		return [true, { type: 'fraction', fraction: isFraction(x)[1], simplified: isFraction(x)[2] }];
	} else if (isMixedFraction(x)[0]) {
		return [
			true,
			{ type: 'mixedFraction', fraction: isMixedFraction(x)[1], simplified: isMixedFraction(x)[2] },
		];
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
