import { UnsimplifiedExpression } from "./expression-working.js";
import { Expression, Term } from "../../core/index.js";

/**
 * @param {Expression} exp1
 * @param {Expression} exp2
 * @return {UnsimplifiedExpression}
 */
export function expansionWorking(exp1, exp2) {
  /** @type {{term: Term, addition: boolean}[]} */
  const terms = [];
  exp1.terms.forEach((t1) => {
    exp2.terms.forEach((t2) => {
      const newTerm = t1.times(t2);
      if (newTerm.coeff.is.negative()) {
        terms.push({ term: newTerm.times(-1), addition: false });
      } else {
        terms.push({ term: newTerm, addition: true });
      }
    });
  });
  return new UnsimplifiedExpression(...terms);
}
