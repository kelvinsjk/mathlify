import { getRandomInt } from './getRandomInt';
import { Vector } from '../../classes/vectors/vectorClass';

/**
 * Generates a random 3D Vector with
 * integer coordinates between `min` and `max` (inclusive)
 *
 * @param options defaults  to `{min: -9, max: 9, simplify: false, nonzero: false}`
 * setting nonzero to true will ensure a non-zero Vector
 * setting simplify to true will return a 'simplified' Vector (such that gcd(x,y,z)=1)
 *
 */
export function getRandomVec(options?: randomVecOptions): Vector {
	const { nonzero, min, max, simplify } = {
		nonzero: false,
		simplify: false,
		min: -9,
		max: 9,
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
