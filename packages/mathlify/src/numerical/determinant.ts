import { numberToFraction, type Fraction } from '../core';

/**
 * determinant of [[a b], [c d]] 2x2 matrix or [[a b c], [d e f], [g h i]] 3x3 matrix
 *
 * WARNING: does not work for any other sizes
 */
export function determinant(...args: number[]): number {
	if (args.length === 4) {
		return args[0] * args[3] - args[1] * args[2];
	} else if (args.length === 9) {
		return (
			args[0] * determinant(args[4], args[5], args[7], args[8]) -
			args[1] * determinant(args[3], args[5], args[6], args[8]) +
			args[2] * determinant(args[3], args[4], args[6], args[7])
		);
	} else {
		throw new Error('determinant: only 2x2 or 3x3 matrices supported');
	}
}

export function determinantFrac4x4(...args: (number | Fraction)[]): Fraction {
	// 0 1 2   3
	// 4 5 6   7
	// 8 9 10 11
	// 12 13 14 15 - + - +
	const argsFrac = args.map((arg) => numberToFraction(arg));
	const a = argsFrac[12].times(
		determinantFrac(...argsFrac.slice(1, 4), ...argsFrac.slice(5, 8), ...argsFrac.slice(9, 12)),
	);
	const b = argsFrac[13].times(
		determinantFrac(argsFrac[0], ...argsFrac.slice(2, 5), ...argsFrac.slice(6, 9), ...argsFrac.slice(10, 12)),
	);
	const c = argsFrac[14].times(
		determinantFrac(
			...argsFrac.slice(0, 2),
			...argsFrac.slice(3, 6),
			...argsFrac.slice(7, 10),
			...argsFrac.slice(11, 12),
		),
	);
	const d = argsFrac[15].times(
		determinantFrac(...argsFrac.slice(0, 3), ...argsFrac.slice(4, 7), ...argsFrac.slice(8, 11)),
	);
	return a.negative().plus(b).minus(c).plus(d);
}

/**
 * determinant of [[a b], [c d]] 2x2 matrix or [[a b c], [d e f], [g h i]] 3x3 matrix
 *
 * WARNING: does not work for any other sizes
 */
export function determinantFrac(...args: (number | Fraction)[]): Fraction {
	const argsFrac = args.map((arg) => numberToFraction(arg));
	if (argsFrac.length === 4) {
		return argsFrac[0].times(argsFrac[3]).minus(argsFrac[1].times(argsFrac[2]));
	} else if (argsFrac.length === 9) {
		const a = argsFrac[0].times(determinantFrac(argsFrac[4], argsFrac[5], argsFrac[7], argsFrac[8]));
		const b = argsFrac[1].times(determinantFrac(argsFrac[3], argsFrac[5], argsFrac[6], argsFrac[8]));
		const c = argsFrac[2].times(determinantFrac(argsFrac[3], argsFrac[4], argsFrac[6], argsFrac[7]));
		return a.minus(b).plus(c);
	} else {
		throw new Error('determinant: only 2x2 or 3x3 matrices supported');
	}
}
