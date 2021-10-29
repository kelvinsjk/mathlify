/**
 * Generates a random integer between `min` and `max` (inclusive)
 *
 * @param min defaults to -9
 * @param max defaults to 9
 * @param options `{avoid: []}` array of numbers to be avoided
 *
 * warning: we do not check if the avoid array prevents us from returning a value (leading to an infinite loop)
 */
export function getRandomInt(min: number = -9, max: number = 9, options?: randomIntOptions): number {
	min = Math.ceil(min); // in case min is non-integer
	max = Math.floor(max); // in case max is non-integer
	let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
	if (options !== undefined && options.avoid.length !== 0) {
		while (options.avoid.includes(randomInt)) {
			randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
		}
	}
	return randomInt;
}

/**
 * options for `getRandomInt`
 * 
 * of the form `{ avoid: [] }`;
 */
interface randomIntOptions {
	/** array of numbers to be avoided */
	avoid: number[]
}