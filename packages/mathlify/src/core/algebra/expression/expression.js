import { Fraction } from '../../fraction.js';
import { Term } from '../term/index.js';

/** Expression class
 * @property {Map<string,Fraction>} termMap - the terms in the expression, where the key is the variable name and the value is the coefficient
 * @property {Term[]} terms - array of terms in the expression
 * @property {"expression"} kind - mathlify expression class kind
 * @property {"expression"|"expression-term"} type - mathlify expression class type
 */
export class Expression {
	/**
	 * @constructor
	 * Creates an Expression instance
   * TODO: brackets handling, allow string
	 * @param {(number|Fraction|Term|{term: number|Fraction|Term, brackets?: 'off'|'auto'|'always', addition?: boolean})[]} terms -
	 * the terms are added by default and
	 * brackets is 'off' by default.
	 */
	constructor(...terms) {
		if (terms.length === 0) throw new Error('Expression must have at least one term');
		/** @type {Map<string,Fraction>} */
		const termMap = new Map();
		terms.forEach((term) => {
			if (typeof term === 'number' || term instanceof Fraction) {
        const currentConstant = termMap.get('') ?? new Fraction(0);
        termMap.set('', currentConstant.plus(term));
      } else if (term instanceof Term){
        const currentConstant = termMap.get(term.variable) ?? new Fraction(0);
        termMap.set(term.variable, currentConstant.plus(term.coeff));
      } else {
        if (typeof term.term === 'number' || term.term instanceof Fraction){
          const currentConstant = termMap.get('') ?? new Fraction(0);
          if (term.addition === false) {
            termMap.set('', currentConstant.minus(term.term));
          } else {
            termMap.set('', currentConstant.plus(term.term));
          }
        } else { // term.term of Term type
          const currentConstant = termMap.get(term.term.variable) ?? new Fraction(0);
          if (term.addition === false) {
            termMap.set('', currentConstant.minus(term.term.coeff));
          } else {
            termMap.set('', currentConstant.plus(term.term.coeff));
          }
        }
      }
		});
		this.termMap = termMap;
    /** @type {Term[]} */
    const termsArray = [];
    termMap.forEach((coeff, variable) => {
      if (coeff.is.not.zero()){
        termsArray.push(new Term(coeff, variable));
      }
    });
    this.terms = termsArray;
		this.kind = 'expression';
		this.type = this.terms.length <= 1 ? 'expression-term' : 'expression';
	}

	/** add terms to this Expression
	 * @param {number|Fraction|Term} x - term to be added
	 * @returns {Expression} - the new Expression
	 */
	plus(x) {
		return new Expression(...this.terms, x);
	}

	/** subtract terms from this Expression
	 * @param {number|Fraction|Term} x - term to be subtracted
	 * @returns {Expression} - the new Expression
	 */
	minus(x) {
		return new Expression(...this.terms, {term: x, addition: false});
	}

	/** toString
	 * @returns {string} - the LaTeX string representation of the Expression
	 */
	toString() {
    if (this.terms.length === 0) {
      return '0';
    }
    return this.terms.reduce((prev,term,i)=>{
      if (i!==0 && term.coeff.is.positive()){
        return `${prev} + ${term}`
      }
      const space = i===0 ? '' : ' ';
      return `${prev}${space}${term}`
    }, '')
  }
}
