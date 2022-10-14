import { getRandomInt } from './getRandomInt';
import { shuffle } from './shuffle';

/**
 * picks a random element in an array
 */
export function sample<T>(arr: T[]): T {
	if (arr.length === 0) {
		throw new Error(`pick does not work with empty array.`);
	}
	return arr[getRandomInt(0, arr.length - 1)];
}

/**
 * picks n random elements *without* replacement
 */
export function sampleN<T>(n: number, arr: T[]): T[] {
	if (!Number.isInteger(n) || n <= 0) {
		throw new Error(`n must be a positive integer.`);
	}
	if (arr.length < n) {
		throw new Error(`n must be bigger than the size of the array.`);
	}
	let arrDuplicate = [...arr];
	const samples: T[] = [];
	for (let i = 0; i < n; i++) {
		arrDuplicate = shuffle(arrDuplicate);
		samples.push(arrDuplicate.pop()!);
	}
	return samples;
}
