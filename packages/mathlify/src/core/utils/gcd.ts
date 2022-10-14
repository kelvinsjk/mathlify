/**
 * Finds greatest common divisor of n **integers**
 * of which at least one is non-zero
 *
 * @returns the (positive) gcd of the given numbers
 */
export function gcd(...integers: number[]): number {
	if (integers.length === 0) {
		throw new RangeError('gcd ERROR: gcd function must have at least one argument');
	} else if (integers.length === 1) {
		return Math.abs(integers[0]);
	} else if (integers.length === 2) {
		return gcdTwo(integers[0], integers[1]);
	} else {
		// recursively call this method
		const [integer1, integer2, ...restOfIntegers] = integers;
		return integer1 === 0 && integer2 === 0
			? gcd(0, ...restOfIntegers)
			: gcd(gcdTwo(integer1, integer2), ...restOfIntegers);
	}
}

export function lcm(...integers: number[]): number {
	if (integers.length === 0) {
		throw new RangeError('lcm function must have at least one argument');
	} else if (integers.length === 1) {
		return Math.abs(integers[0]);
	} else if (integers.length === 2) {
		return lcmTwo(integers[0], integers[1]);
	} else {
		// recursively call this method
		const [integer1, integer2, ...restOfIntegers] = integers;
		return lcm(lcmTwo(integer1, integer2), ...restOfIntegers);
	}
}

/**
 * Greatest common divisor of two integers
 *
 * @returns the (positive) gcd of two integers
 */
function gcdTwo(a: number, b: number): number {
	a = Math.abs(a);
	b = Math.abs(b);
	if (a === 0 && b === 0) {
		throw new RangeError('gcd(0,0) not defined');
	}
	if (!Number.isInteger(a) || !Number.isInteger(b)) {
		throw new TypeError('gcd not defined for non-integers');
	}
	if (a === 0 || b === 0) {
		// at least one non-zero due to earlier check
		return Math.max(a, b);
	}
	while (b !== 0) {
		[a, b] = [b, a % b];
	}
	return a;
}

function lcmTwo(a: number, b: number): number {
	return Math.abs(a * b) / gcdTwo(a, b);
}
