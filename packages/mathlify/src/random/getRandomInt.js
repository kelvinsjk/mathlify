/**
 * gets a random integer
 * @param  {RandomIntOptions} [options] - defaults to {min: -9, max: 9, avoid: []}
 * @returns {number} a random integer between min and max (inclusive)
 */
export function getRandomInt(options) {
	const { min, max, avoid } = {
		min: -9,
		max: 9,
		avoid: [],
		...options,
	};
	const avoidArr =
		typeof avoid === "number" ? [avoid] : avoid;
	if (min > max) {
		throw new Error(
			`received a bigger min value than max value (${min}, ${max}): no numbers possible`
		);
	}
	const minInt = Math.ceil(min); // in case min is non-integer
	const maxInt = Math.floor(max); // in case max is non-integer
	let randomInt =
		Math.floor(Math.random() * (maxInt - minInt + 1)) +
		minInt;
	while (avoidArr.includes(randomInt)) {
		randomInt =
			Math.floor(Math.random() * (max - min + 1)) + min;
	}
	return randomInt;
}
/**
 * get n random integers
 * @param {number} n
 * @param {RandomIntsOptions} [options] - defaults to {min: -9, max: 9, avoid: [], allowReps: true}
 * @returns {number[]} - n random integers
 */
export function getRandomInts(n, options) {
	const { avoid, allowReps } = {
		avoid: [],
		allowReps: true,
		...options,
	};
	const avoidArr =
		typeof avoid === "number" ? [avoid] : avoid;
	if (!Number.isInteger(n) || n <= 0) {
		throw new Error(
			`invalid ${n} received for getRandomInts. Only positive integers allowed`
		);
	}
	/** @type {number[]} */
	const randomInts = [];
	while (randomInts.length < n) {
		let randomInt = getRandomInt(options);
		randomInts.push(randomInt);
		if (!allowReps) {
			avoidArr.push(randomInt);
			options = {
				...options,
				avoid: avoidArr,
			};
		}
	}
	return randomInts;
}

/**
 * @typedef {Object} RandomIntOptions
 * @property {number} [min=-9] - lower bound (inclusive). defaults to -9.
 * @property {number} [max=9] - upper bound (inclusive). defaults to 9
 * @property {number|number[]} [avoid] - numbers to avoid
 */

/**
 * @typedef {Object} RandomIntsOptions
 * @property {number} [min=-9] - lower bound (inclusive). defaults to -9.
 * @property {number} [max=9] - upper bound (inclusive). defaults to 9
 * @property {number|number[]} [avoid] - numbers to avoid
 * @property {boolean} [allowReps] - allow repetition: defaults to true
 */
