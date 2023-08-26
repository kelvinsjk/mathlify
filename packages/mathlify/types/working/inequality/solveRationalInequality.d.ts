/** @typedef {import("../../core/index.js").Fraction} Fraction */
/**
 * solve rational inequality of which num/den is of degree at most 2, and either has distinct rational roots or no real roots
 * @param {RationalTerm} lhs - the left hand side of the inequality
 * @param {RationalTerm|number|Fraction} [rhs=0] - the right hand side of the inequality
 * @param {'<'|'>'} [sign='<'] - the sign of the inequality
 * @returns {string[]} - a collection of intervals representing the solution set
 */
export function solveRationalInequality(lhs: RationalTerm, rhs?: number | import("../../core/fraction.js").Fraction | RationalTerm | undefined, sign?: "<" | ">" | undefined): string[];
export type Fraction = import("../../core/index.js").Fraction;
import { RationalTerm } from '../../algebra/index.js';
//# sourceMappingURL=solveRationalInequality.d.ts.map