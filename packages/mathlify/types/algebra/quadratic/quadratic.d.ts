/**
 * @typedef {import('../../core/fraction.js').Fraction} Fraction
 */
/**
 * solve quadratic polynomial/equations
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial to be solved/left hand side of the equation
 * @param {Polynomial|number|Fraction|Expression} [rhs] - the right hand side of the equation (defaults to 0)
 * @param {{variable?: string}} [options] - options to specify the variable
 * @returns {[Fraction, Fraction]} - the solution [x1, x2], where x1 \\leq x2
 * WARNING: only works for rational roots. use solveQuadraticSurd or solveQuadraticComplex for other cases
 */
export function solveQuadratic(poly: Polynomial | number | Fraction | Expression, rhs?: number | import("../../core/fraction.js").Fraction | Expression | Polynomial | undefined, options?: {
    variable?: string | undefined;
} | undefined): [Fraction, Fraction];
/**
 * factorize quadratic
 * @param {Polynomial|Expression} poly
 * @param {{variable?: string}} [options] - options to specify the variable
 * @returns {ExpansionTerm} - the factorized form
 */
export function factorizeQuadratic(poly: Polynomial | Expression, options?: {
    variable?: string | undefined;
} | undefined): ExpansionTerm;
/**
 * solve quadratic polynomial/equations
 * @param {Polynomial|number|Fraction|Expression} poly - the polynomial to be solved/left hand side of the equation
 * @param {Polynomial|number|Fraction|Expression} [rhs] - the right hand side of the equation (defaults to 0)
 * @returns {[Expression, Expression]} - the solution [x1, x2], where x1 \\leq x2
 */
export function solveQuadraticSurd(poly: Polynomial | number | Fraction | Expression, rhs?: number | import("../../core/fraction.js").Fraction | Expression | Polynomial | undefined): [Expression, Expression];
/**
 * discriminant of a quadratic polynomial
 * @param {Polynomial|[number|Fraction, number|Fraction, number|Fraction]} poly - the polynomial (or array of coefficients ax^2 + bx + c)
 * @returns {Fraction} - the discriminant
 */
export function discriminant(poly: Polynomial | [number | Fraction, number | Fraction, number | Fraction]): Fraction;
export type Fraction = import('../../core/fraction.js').Fraction;
import { Polynomial } from '../../core/algebra/polynomial/polynomial.js';
import { Expression } from '../../core/algebra/expression/expression.js';
import { ExpansionTerm } from '../term/index.js';
//# sourceMappingURL=quadratic.d.ts.map