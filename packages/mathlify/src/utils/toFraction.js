import { Fraction } from "../fraction.js";

/**
 * converts number or fraction to Fraction class
 * @param {number|Fraction} x - number or fraction to be converted
 * @returns the Fraction class representation of x
 */
export function numberToFraction(x) {
	return typeof x === "number" ? new Fraction(x) : x;
}
