import { determinant, determinantFrac, determinantFrac4x4 } from './determinant';
import type { Fraction } from 'mathlify';

/**
 * apply Cramer's rule to 2x2 [[a b], [d e]] = [[c], [f]]
 * or to 3x3 [[a b c], [e f g], [i j k] = [[d], [h], [l]]]
 */
export function cramers(...args: number[]): number[] {
	if (args.length === 6) {
		const detA = determinant(...args.slice(0, 2), ...args.slice(3, 5));
		if (detA === 0) {
			throw new Error('determinant 0: no roots found');
		}
		const detX = determinant(args[2], args[1], args[5], args[4]);
		const detY = determinant(args[0], args[2], args[3], args[5]);
		return [detX / detA, detY / detA];
	} else if (args.length === 12) {
		const detA = determinant(...args.slice(0, 3), ...args.slice(4, 7), ...args.slice(8, 11));
		if (detA === 0) {
			throw new Error('determinant 0: no roots found');
		}
		const detX = determinant(
			args[3],
			...args.slice(1, 3),
			args[7],
			...args.slice(5, 7),
			args[11],
			...args.slice(9, 11),
		);
		const detY = determinant(
			args[0],
			args[3],
			args[2],
			args[4],
			args[7],
			args[6],
			args[8],
			args[11],
			args[10],
		);
		const detZ = determinant(
			...args.slice(0, 2),
			args[3],
			...args.slice(4, 6),
			args[7],
			...args.slice(8, 10),
			args[11],
		);
		return [detX / detA, detY / detA, detZ / detA];
	} else {
		throw new Error('only 2x2 (6 arguments) and 3x3 (12 arguments) equations are supported');
	}
}

/**
 * apply Cramer's rule to 2x2 [[a b], [d e]] = [[c], [f]]
 * or to 3x3 [[a b c], [e f g], [i j k] = [[d], [h], [l]]]
 */
export function cramersFrac(...args: (Fraction | number)[]): Fraction[] {
	if (args.length === 6) {
		const detA = determinantFrac(...args.slice(0, 2), ...args.slice(3, 5));
		if (detA.isEqualTo(0)) {
			throw new Error('determinant 0: no roots found');
		}
		const detX = determinantFrac(args[2], args[1], args[5], args[4]);
		const detY = determinantFrac(args[0], args[2], args[3], args[5]);
		return [detX.divide(detA), detY.divide(detA)];
	} else if (args.length === 12) {
		const detA = determinantFrac(...args.slice(0, 3), ...args.slice(4, 7), ...args.slice(8, 11));
		if (detA.isEqualTo(0)) {
			throw new Error('determinant 0: no roots found');
		}
		const detX = determinantFrac(
			args[3],
			...args.slice(1, 3),
			args[7],
			...args.slice(5, 7),
			args[11],
			...args.slice(9, 11),
		);
		const detY = determinantFrac(
			args[0],
			args[3],
			args[2],
			args[4],
			args[7],
			args[6],
			args[8],
			args[11],
			args[10],
		);
		const detZ = determinantFrac(
			...args.slice(0, 2),
			args[3],
			...args.slice(4, 6),
			args[7],
			...args.slice(8, 10),
			args[11],
		);
		return [detX.divide(detA), detY.divide(detA), detZ.divide(detA)];
	} else {
		throw new Error('only 2x2 (6 arguments) and 3x3 (12 arguments) equations are supported');
	}
}

/**
 * apply Cramer's rule to 4x4
 *
 */
export function cramersFrac4x4(...args: (Fraction | number)[]): Fraction[] {
	if (args.length !== 20) {
		throw new Error('only 4x4 equations are supported');
	}
	const det = determinantFrac4x4(
		...args.slice(0, 4),
		...args.slice(5, 9),
		...args.slice(10, 14),
		...args.slice(15, 19),
	);
	if (det.isEqualTo(0)) {
		throw new Error('determinant 0: no roots found');
	}
	// 0  1  2  3  4
	// 5  6  7  8  9
	// 10 11 12 13 14
	// 15 16 17 18 19
	const detA = determinantFrac4x4(
		args[4],
		...args.slice(1, 4),
		args[9],
		...args.slice(6, 9),
		args[14],
		...args.slice(11, 14),
		args[19],
		...args.slice(16, 19),
	);
	const detB = determinantFrac4x4(
		args[0],
		args[4],
		...args.slice(2, 4),
		args[5],
		args[9],
		...args.slice(7, 9),
		args[10],
		args[14],
		...args.slice(12, 14),
		args[15],
		args[19],
		...args.slice(17, 19),
	);
	// 0  1  2  3  4
	// 5  6  7  8  9
	// 10 11 12 13 14
	// 15 16 17 18 19
	const detC = determinantFrac4x4(
		...args.slice(0, 2),
		args[4],
		args[3],
		...args.slice(5, 7),
		args[9],
		args[8],
		...args.slice(10, 12),
		args[14],
		args[13],
		...args.slice(15, 17),
		args[19],
		args[18],
	);
	const detD = determinantFrac4x4(
		...args.slice(0, 3),
		args[4],
		...args.slice(5, 8),
		args[9],
		...args.slice(10, 13),
		args[14],
		...args.slice(15, 18),
		args[19],
	);
	return [detA.divide(det), detB.divide(det), detC.divide(det), detD.divide(det)];
}
