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
import { Fraction } from '../../index.js';
import { Term } from '../../index.js';
//# sourceMappingURL=bracket.d.ts.map