import { Fraction } from '../../fraction.js';
import { numberToFraction } from '../../utils';

/** Unsimplified Expression class
 * TODO: convert Fraction type to Term/Unsimplified Term type
 * @property {Fraction[]} terms - the terms in the expression
 * @property {[undefined, ...boolean[]]} additionArray - whether the terms are added (or subtracted)
 * @property {["always"|"off", ...("auto"|"always")[]]} bracketsArray - whether terms are surrounded by brackets
 * @property {"unsimplified-expression"} kind - mathlify unsimplified expression class kind
 * @property {"unsimplified-expression"} type - mathlify unsimplified expression class type
 */
export class UnsimplifiedExpression {
	/**
	 * @constructor
	 * Creates an Unsimplified Expression instance
	 * @param {[[number|Fraction, undefined|{brackets: 'off'|'always'}], ...(['+'|'-', number|Fraction, undefined|{brackets: 'always'|'auto'}])[]]} terms -
	 * the terms of the expression and whether they are added/subtracted and wrapped in brackets.
	 * brackets is 'off' and 'auto' by default
	 */
	constructor(...terms) {
		const [[firstTerm, options1], ...remainingTerms] = terms;
		this.terms = [firstTerm];
		this.additionArray = [undefined];
		this.bracketsArray = [options1?.brackets ?? 'off'];
	}

	/** add terms to this Expression
	 * @param {number|Fraction} x - term to be added
	 * @param {{brackets: 'auto'|'always'}} [options = {brackets: 'auto'}] -
	 */
}
