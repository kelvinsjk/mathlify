import { gcd } from "./gcd.js";

/**
 * finds lowest common multiple (lcm) of n integers,
 * @param  {...number} integers
 * @returns {number} the (absolute) lcm of provided numbers.
 * if any of the arguments are 0, then returns 0
 */
export function lcm(...integers) {
	if (integers.length === 0) {
		throw new Error(
			`no arguments provided to lcm function`
		);
	}
	if (integers.length === 1) {
		const a = integers[0];
		if (!Number.isInteger(a)) {
			throw new Error(
				`non-integer ${a} received in lcm function`
			);
		}
		return Math.abs(a);
	}
	// terminating condition
	if (integers.length === 2) {
		return lcmTwo(integers[0], integers[1]);
	}
	// recursively call this function
	const [int1, int2, ...rest] = integers;
	return lcm(lcmTwo(int1, int2), ...rest);
}

/**
 * finds lcm of two numbers
 * @param {number} a - integer 1
 * @param {number} b - integer 2
 * @returns {number} (absolute) lcm
 */
function lcmTwo(a, b) {
	if (!Number.isInteger(a) || !Number.isInteger(b)) {
		throw new Error(
			`Non-integers (${a}, ${b}) received in lcm function`
		);
	}
	a = Math.abs(a);
	b = Math.abs(b);
	if (a === 0 || b === 0) {
		return 0;
	}
	return (a * b) / gcd(a, b);
}
