/**
 * finds greatest common divisor (gcd) of n integers,
 * of which at least one is non-zero
 * @param  {...number} integers
 * @returns {number} the (absolute) gcd of provided numbers
 */
export function gcd(...integers) {
	if (integers.length === 0) {
		throw new Error(`no arguments provided to gcd function`);
	}
	if (integers.length === 1) {
		const a = integers[0];
		if (!Number.isInteger(a)) {
			throw new Error(`non-integer ${a} received in gcd function`);
		}
		if (a === 0) {
			throw new Error(`gcd(0) is undefined`);
		}
		return Math.abs(a);
	}
	// terminating condition
	if (integers.length === 2) {
		return gcdTwo(integers[0], integers[1]);
	}
	// recursively call this function
	const [int1, int2, ...rest] = integers;
	return int1 === 0 && int2 === 0
		? gcd(0, ...rest)
		: gcd(gcdTwo(int1, int2), ...rest);
}

/**
 * finds gcd of two numbers
 * @param {number} a - integer 1
 * @param {number} b - integer 2
 * @returns {number} (absolute) gcd
 */
function gcdTwo(a, b) {
	if (!Number.isInteger(a) || !Number.isInteger(b)) {
		throw new Error(`Non-integers (${a}, ${b}) received in gcd function`);
	}
	a = Math.abs(a);
	b = Math.abs(b);
	if (a === 0 && b === 0) {
		throw new Error(`gcd(0,0) not defined`);
	}
	if (a === 0 || b === 0) {
		return Math.max(a, b);
	}
	// euclidean algorithm
	while (b !== 0) {
		[a, b] = [b, a % b];
	}
	return a;
}
