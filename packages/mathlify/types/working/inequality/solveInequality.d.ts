/** @typedef {import("../../core/index.js").Fraction} Fraction */
/** @typedef {import("../../core/index.js").Expression} Expression */
/**
 * solve rational inequality of which num/den is of degree at most 2, and either has distinct rational roots or no real roots
 * @param {Polynomial|Expression} lhs - the left hand side of the inequality
 * @param {Polynomial|Expression|number|Fraction} [rhs=0] - the right hand side of the inequality
 * @param {'<'|'>'|'geq'|'leq'|'\\geq'|'\\leq'} [sign='<'] - the sign of the inequality
 * @returns {string} - the solution as a string
 */
export function solveLinearInequality(lhs: Polynomial | Expression, sign?: "<" | ">" | "\\geq" | "\\leq" | "geq" | "leq" | undefined, rhs?: number | import("../../core/fraction.js").Fraction | import("../../core/index.js").Expression | Polynomial | undefined): string;
/**
 * solve rational inequality of which num/den is of degree at most 2, and either has distinct rational roots or no real roots
 * @param {Polynomial|Expression} lhs - the left hand side of the inequality
 * @param {Polynomial|Expression|number|Fraction} [rhs=0] - the right hand side of the inequality
 * @param {{variable?: string}} [options] - options to specify the variable
 * @param {'<'|'>'|'geq'|'leq'|'\\geq'|'\\leq'} [sign='<'] - the sign of the inequality
 * @returns {string[]} - the solution as a string
 */
export function solveQuadraticInequality(lhs: Polynomial | Expression, sign?: "<" | ">" | "\\geq" | "\\leq" | "geq" | "leq" | undefined, rhs?: number | import("../../core/fraction.js").Fraction | import("../../core/index.js").Expression | Polynomial | undefined, options?: {
    variable?: string | undefined;
} | undefined): string[];
export type Fraction = import("../../core/index.js").Fraction;
export type Expression = import("../../core/index.js").Expression;
import { Polynomial } from "../../core/index.js";
//# sourceMappingURL=solveInequality.d.ts.map