/**
 * adds brackets around a Fraction/Term
 * @param {Fraction|Term} x
 * @param {{mode?: 'auto'|'always'|'off'}} [options] options object with mode either 'auto' (default) which only puts brackets around negative fractions
 * or 'always' which always puts brackets for all fractions
 * @returns {string} LaTeX string representation of the fraction with brackets
 */
export function bracket(x: Fraction | Term, options?: {
    mode?: "auto" | "always" | "off" | undefined;
} | undefined): string;
import { Fraction } from "../../../core/index.js";
import { Term } from "../../../core/index.js";
//# sourceMappingURL=brackets.d.ts.map