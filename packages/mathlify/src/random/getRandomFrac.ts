import { getRandomInt } from './getRandomInt';
import { Fraction, numberToFraction } from '../core/index';

/**
 * Generates a random Fraction
 *
 * @param options defaults to `{ numRange: [-9,9], denRange: [1,9], avoid: [] }`
 * where numRange and denRange specifies the minimum and maximum values for the numerator and denominator, respectively
 * and avoid is an Array of numbers/Fractions that will not be generated
 */
export function getRandomFrac(options?: {
	numRange?: [number, number];
	denRange?: [number, number];
	avoid?: number | Fraction | (number | Fraction)[];
}): Fraction {
	let avoidArray = options?.avoid ?? [];
	if (!Array.isArray(avoidArray)) {
		avoidArray = [avoidArray];
	}
	const fractionOptions = {
		numRange: options?.numRange ?? [-9, 9],
		denRange: options?.denRange ?? [1, 9],
		avoid: avoidArray.map((e) => numberToFraction(e)),
	};
	let num = getRandomInt(...fractionOptions.numRange);
	let den = getRandomInt(...fractionOptions.denRange);
	let frac = new Fraction(num, den),
		counter = 0;
	while (fractionOptions.avoid.some((e) => e.isEqualTo(frac))) {
		counter++;
		if (counter > 1000) {
			throw new Error('Could not generate a random Fraction within 1000 attempts that is not in the avoid Array');
		}
		num = getRandomInt(...fractionOptions.numRange);
		den = getRandomInt(...fractionOptions.denRange);
		frac = new Fraction(num, den);
	}
	return frac;
}
