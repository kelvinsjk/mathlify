import { getRandomInt } from './getRandomInt';

/**
 * picks a random element in an array
 */
export function sample<T>(arr: T[]): T {
	if (arr.length === 0) {
		throw new Error(`pick does not work with empty array.`);
	}
	return arr[getRandomInt(0, arr.length - 1)];
}
