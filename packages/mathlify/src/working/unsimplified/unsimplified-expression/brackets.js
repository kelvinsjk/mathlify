import { Fraction, Term } from "../../../core/index.js";

/**
 * adds brackets around a Fraction/Term
 * @param {Fraction|Term} x
 * @param {{mode?: 'auto'|'always'|'off'}} [options] options object with mode either 'auto' (default) which only puts brackets around negative fractions
 * or 'always' which always puts brackets for all fractions
 * @returns {string} LaTeX string representation of the fraction with brackets
 */
export function bracket(x, options = {}) {
  const { mode = "auto" } = options;
  const isNegative =
    (x instanceof Fraction && x.is.negative()) ||
    (x instanceof Term && x.coeff.is.negative());
  if (mode === "always" || (mode === "auto" && isNegative)) {
    return `\\left( ${x} \\right)`;
  }
  return `${x}`;
}
