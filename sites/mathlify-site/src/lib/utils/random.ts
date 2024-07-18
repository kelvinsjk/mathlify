/**
 * Generates a random integer between `min` and `max` (inclusive)
 *
 * @param min defaults to -9
 * @param max defaults to 9
 * @param options `{avoid: []}` array of numbers to be avoided
 *
 */
export function getRandomInt(
	min: number = -9,
	max: number = 9,
	options?: { avoid?: number | number[] },
): number {
	min = Math.ceil(min); // in case min is non-integer
	max = Math.floor(max); // in case max is non-integer
	[min, max] = [Math.min(min, max), Math.max(min, max)];
	let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
	let { avoid } = {
		avoid: [],
		...options,
	};
	if (typeof avoid === 'number') {
		avoid = [avoid];
	}
	if (avoid.length !== 0) {
		let avoidArray = avoid.filter((num) => num >= min && num <= max);
		avoidArray = avoidArray.filter((num, i) => avoidArray.indexOf(num) === i);
		if (avoidArray.length >= max - min + 1) {
			throw new Error(`no integer exists between ${min} and ${max} that avoids ${avoid}`);
		}
		while (avoidArray.includes(randomInt)) {
			randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
		}
	}
	return randomInt;
}

export function coinFlip(): boolean {
	return Math.random() < 0.5;
}

export const chooseRandom = <T>(array: T[]): T => array.at(getRandomInt(0, array.length - 1))!;
