/**
 * Generates a random integer between `min` and `max` (inclusive)
 *
 * will swap min and max around if min > max
 * will use ceil and floor if min and max are not integers
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
	[min, max] = [min, max].sort((a, b) => a - b);
	[min, max] = [Math.ceil(min), Math.floor(max)];
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

export function coinFlip(p: number = 0.5): boolean {
	return Math.random() < p;
}

export function getRandomSign(): number {
	return coinFlip() ? 1 : -1;
}

export function getRandomNonZeroInt(min: number = 1, max: number = 9): number {
	const [a, b] = [Math.abs(min), Math.abs(max)].sort((a, b) => a - b);
	return getRandomInt(a, b) * getRandomSign();
}

export const chooseRandom = <T>(array: T[] | readonly T[]): T =>
	array.at(getRandomInt(0, array.length - 1))!;
