/** @typedef {import('../../core/fraction.js').Fraction} Fraction */
/**
 * determinant of a 2x2 [[a b], [c d]] matrix
 * or a 3x3 [[a b c], [d e f], [g h i]] matrix
 * or a 4x4 matrix
 * @param {(number|Fraction)[]} args - matrix elements
 * @returns {Fraction} determinant of the matrix
 */
export function determinant(...args: (number | Fraction)[]): Fraction;
/**
 * determinant of a 2x2 [[a b], [c d]] matrix
 * or a 3x3 [[a b c], [d e f], [g h i]] matrix
 * @param {(number|Fraction)[]} args - matrix elements
 * @returns {number} determinant of the matrix
 */
export function determinantNumerical(...args: (number | Fraction)[]): number;
export type Fraction = import('../../core/fraction.js').Fraction;
//# sourceMappingURL=determinant.d.ts.map