/** @typedef {import("../../../core/index.js").Fraction} Fraction */
/**
 * @param {Fraction} x1
 * @param {Fraction} x2
 * @param {'<'|'>'|'\\geq'|'\\leq'} sign
 * @param {string} [x] variable
 * @return {string[]}
 */
export function twoRoots(x1: Fraction, x2: Fraction, sign: '<' | '>' | '\\geq' | '\\leq', x?: string | undefined): string[];
/**
 * @param {Fraction} x1
 * @param {Fraction} x2
 * @param {Fraction} x3
 * @param {'<'|'>'} sign
 * @return {string[]}
 */
export function threeRoots(x1: Fraction, x2: Fraction, x3: Fraction, sign: '<' | '>'): string[];
/**
 * @param {Fraction} x1
 * @param {Fraction} x2
 * @param {Fraction} x3
 * @param {Fraction} x4
 * @param {'<'|'>'} sign
 * @return {string[]}
 */
export function fourRoots(x1: Fraction, x2: Fraction, x3: Fraction, x4: Fraction, sign: '<' | '>'): string[];
export type Fraction = import("../../../core/index.js").Fraction;
//# sourceMappingURL=inequalitiesToIntervals.d.ts.map