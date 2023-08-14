import { Expression, Fraction, Term } from "../../../core/index.js";
import { ExpansionTerm } from "../../term/index.js";

/**
 * factorizeExpression. constants will be factorized automatically, while variables will have to be provided
 * @param {Expression} exp - the expression to be factorized
 * @param {string|Term} [factor] - the factor to be factorized with
 * @returns {ExpansionTerm} the factorized expression
 */
export function factorizeExpression(exp, factor) {
  let coeff = Fraction.gcd(...exp.terms.map((term) => term.coeff));
  let factorizedExp = exp.divide(coeff);
  if (factor) {
    factorizedExp = factorizedExp.divide(factor);
    return new ExpansionTerm(coeff, factor, factorizedExp);
  } else {
    return new ExpansionTerm(coeff, factorizedExp);
  }
}
