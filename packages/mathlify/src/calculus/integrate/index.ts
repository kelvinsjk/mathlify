import { trigo, trigoD } from './trigo';
import { mf26 } from './mf26';
import { byParts, byPartsD } from './byParts';
import type { Angle } from '../../trigo';
import type { Fraction, Expression } from '../../core';

export const integrate = {
	/** trigo integrations */
	trigo,
	/** by parts integrations */
	byParts,
	/** integration of 1/(x^2 \\pm a^2) or 1/sqrt(x^2 \\pm a^2) */
	mf26,
};

export const definiteIntegral: {
	trigo: {
		cos2: (
			lower: number | Fraction | Angle,
			upper: number | Fraction | Angle,
			options?: {
				k?: number | Fraction;
				coeff?: number | Fraction;
			},
		) => Expression;
		sin2: (
			lower: number | Fraction | Angle,
			upper: number | Fraction | Angle,
			options?: {
				k?: number | Fraction;
				coeff?: number | Fraction;
			},
		) => Expression;
		cosCos: (
			A: number | Fraction,
			B: number | Fraction,
			lower: number | Fraction | Angle,
			upper: number | Fraction | Angle,
			options?: {
				coeff?: number | Fraction;
			},
		) => Expression;
		cosSin: (
			A: number | Fraction,
			B: number | Fraction,
			lower: number | Fraction | Angle,
			upper: number | Fraction | Angle,
			options?: {
				coeff?: number | Fraction;
			},
		) => Expression;
		sinCos: (
			A: number | Fraction,
			B: number | Fraction,
			lower: number | Fraction | Angle,
			upper: number | Fraction | Angle,
			options?: {
				coeff?: number | Fraction;
			},
		) => Expression;
		sinSin: (
			A: number | Fraction,
			B: number | Fraction,
			lower: number | Fraction | Angle,
			upper: number | Fraction | Angle,
			options?: {
				coeff?: number | Fraction;
			},
		) => Expression;
	};
	byParts: typeof byPartsD;
} = {
	/** trigo integrations */
	trigo: trigoD,
	/** by parts integrations */
	byParts: byPartsD,
};
