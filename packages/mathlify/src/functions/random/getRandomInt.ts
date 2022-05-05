/**
 * Generates a random integer between `min` and `max` (inclusive)
 *
 * @param min defaults to -9
 * @param max defaults to 9
 * @param options `{avoid: []}` array of numbers to be avoided
 *
 */
export function getRandomInt(min: number = -9, max: number = 9, options?: randomIntOptions): number {
	min = Math.ceil(min); // in case min is non-integer
	max = Math.floor(max); // in case max is non-integer
	[min, max] = [Math.min(min, max), Math.max(min, max)];
	let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
	if (options !== undefined && options.avoid.length !== 0) {
		let avoidArray = options.avoid.filter((num) => num >= min && num <= max);
		avoidArray = avoidArray.filter((num, i) => avoidArray.indexOf(num) === i);
		if (avoidArray.length >= max - min + 1) {
			throw new Error(`no integer exists between ${min} and ${max} that avoids ${options.avoid}`);
		}
		while (avoidArray.includes(randomInt)) {
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
	avoid: number[];
}
