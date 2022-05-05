import { getRandomInt } from './getRandomInt';
import { Vector } from '../vectors/index';
import { shuffle } from './shuffle';
import { heads } from './coinFlip';
import { factorPairs } from '../misc/index';

/**
 * Generates a random 3D Vector with
 * integer coordinates between `min` and `max` (inclusive)
 *
 * @param options defaults  to `{min: -5, max: 5, simplify: false, nonzero: true}`
 * setting nonzero to true will ensure a non-zero Vector
 * setting simplify to true will return a 'simplified' Vector (such that gcd(x,y,z)=1)
 *
 */
export function getRandomVec(options?: randomVecOptions): Vector {
	const { nonzero, min, max, simplify } = {
		nonzero: true,
		simplify: false,
		min: -5,
		max: 5,
		...options,
	};
	const x = getRandomInt(min, max);
	const y = getRandomInt(min, max);
	const z = getRandomInt(min, max);
	if (nonzero && x === 0 && y === 0 && z === 0) {
		return getRandomVec(options);
	}
	return new Vector(x, y, z, { stretchable: simplify });
}

/**
 * Generates a random 3D Vector with
 * integral magnitude
 *
 * (1,2,2 | 3) * 2
 * (0,3,4 | 5) * 2
 * (2,3,6 | 7)
 * (1,4,8 | 9)
 * (2,6,9 | 11)
 * (0,5,12 | 13)
 *
 */
export function getNiceVec(options?: { multiplesAllowed?: boolean; max?: number }): Vector {
	const { multiplesAllowed, max } = {
		multiplesAllowed: false,
		max: 13,
		...options,
	};
	const pythagoreanQuads = [
		[1, 2, 2, 3],
		[0, 3, 4, 5],
		[2, 3, 6, 7],
		[1, 4, 8, 9],
		[2, 6, 9, 11],
		[0, 5, 12, 13],
	];
	const choices = pythagoreanQuads.filter((arr) => arr[3] <= max);
	if (choices.length === 0) {
		throw new Error(`max ${max} results in no choices`);
	}
	let choice = choices[getRandomInt(0, choices.length - 1)];
	if (multiplesAllowed && choice[3] * 2 <= max && heads()) {
		choice = choice.map((e) => e * 2);
	}
	const components = choice.slice(0, 3);
	shuffle(components);
	const [x, y, z] = components.map((e) => (heads() ? e * -1 : e));
	return new Vector(x, y, z);
}

/**
 * get two random vectors that are perpendicular to each other
 *
 * this algorithm makes x1 and y2 non-zero
 *
 * options default to `{ min: -5, max: 5, simplify: true}`
 *
 * warning: max should be positive or loop logic may fail
 */
export function getRandomPerps(options?: { min?: number; max?: number; simplify?: boolean }): [Vector, Vector] {
	const { min, max, simplify } = {
		min: -5,
		max: 5,
		simplify: true,
		...options,
	};
	let x1 = getRandomInt(min, max, { avoid: [0] });
	let x2 = getRandomInt(min, max);
	let y1 = getRandomInt(min, max);
	let y2 = getRandomInt(min, max, { avoid: [0] });
	let dot = x1 * x2 + y1 * y2;
	if (dot === 0) {
		const z1 = getRandomInt(min, max, { avoid: [0] });
		const z2 = 0;
		const a = new Vector(x1, y1, z1, { stretchable: simplify });
		const b = new Vector(x2, y2, z2, { stretchable: simplify });
		return [a, b];
	}
	let factors = factorPairs(Math.abs(dot));
	let eligibleFactors = factors.filter((e) => e[0] < max && e[1] < max);
	while (eligibleFactors.length === 0) {
		// ~ 27.2% using default of -5 to 5
		x1 = getRandomInt(min, max, { avoid: [0] });
		x2 = getRandomInt(min, max);
		y1 = getRandomInt(min, max);
		y2 = getRandomInt(min, max, { avoid: [0] });
		dot = x1 * x2 + y1 * y2;
		if (dot === 0) {
			const z1 = heads() ? 0 : getRandomInt(min, max);
			const z2 = z1 === 0 ? getRandomInt(min, max) : 0;
			const a = new Vector(x1, y1, z1, { stretchable: simplify });
			const b = new Vector(x2, y2, z2, { stretchable: simplify });
			return [a, b];
		}
		factors = factorPairs(Math.abs(dot));
		eligibleFactors = factors.filter((e) => e[0] < max && e[1] < max);
	}
	const factorPair = eligibleFactors[getRandomInt(0, eligibleFactors.length - 1)];
	if (heads()) {
		factorPair.reverse();
	}
	let [z1, z2] = factorPair;
	if (dot < 0) {
		// need positive z1*z2
		if (heads()) {
			z1 = -z1;
			z2 = -z2;
		}
	} else {
		// need negative z1*z2
		if (heads()) {
			z1 = -z1;
		} else {
			z2 = -z2;
		}
	}
	const a = new Vector(x1, y1, z1, { stretchable: simplify });
	const b = new Vector(x2, y2, z2, { stretchable: simplify });
	return [a, b];
}

/**
 * options for `getRandomInt`
 *
 * of the form `{ avoid: [] }`;
 */
interface randomVecOptions {
	/** whether the vector must be nonzero */
	nonzero?: boolean;
	/** whether the vector is "simplified" */
	simplify?: boolean;
	/** min */
	min?: number;
	/** max */
	max?: number;
}
