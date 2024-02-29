/**
 * finds greatest common divisor (gcd) of n integers,
 * of which at least one is non-zero
 * @param  {...number} integers
 * @returns {number} the (absolute) gcd of provided numbers
 */
export function gcd(...integers: number[]): number;
/**
 * signed gcd: returns a negative gcd if
 * at least one number is negative,
 * and all numbers are non_positive
 * @param  {...number} integers
 * @returns {number}
 */
export function signed_gcd(...integers: number[]): number;
//# sourceMappingURL=gcd.d.ts.map