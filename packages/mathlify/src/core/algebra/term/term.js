// a term is a collection of symbols and a coefficient
// we have a coefficient of the Fraction type
// the symbols could be of type
//
// - surds (eg sqrt{2}) (TODO)
// - constants (eg pi, a) (TODO)
// - variable (eg x, x^2) (TODO)
// - functions (eg sin(x)) (TODO)
// we will perform automatic simplification

// TODO: handling of negative coefficients for fractional display mode

import { Fraction } from '../../fraction.js';
import { powerMapToString } from '../utils/index.js';

/** Term class
 * @property {Fraction} coeff - the coefficient of the term
 * @property {Map<string,Fraction>} powerMap - the key is the variable, the value is the power
 * @property {string} signature - a string representation of the variables
 * @property {boolean} fractionalDisplayMode - whether to display the term as a fraction (default: false) (3/5 x by default, 3x/5 if true)
 * @property {"term"} kind - mathlify fraction class
 * @property {"term"|"term-frac"} kind - mathlify fraction class
 */
export class Term {
	/**
	 * @constructor
	 * Creates a Term instance, automatically simplifying all terms by grouping them together
	 * under a "PowerTerm"
	 * TODO: update different types of symbols
	 * @param {(Fraction|string|number|{variable: string, power: number|Fraction})[]} args - 
	 * the constituents of the term (either number or fraction or string)
	 */
	constructor(...args) {
		/** @type {Map<string,Fraction>} */
		const powerMap = new Map();
		let coeff = new Fraction(1);
		args.forEach((x) => {
			if (typeof x === 'number' || x instanceof Fraction) {
				coeff = coeff.times(x);
			} else if (typeof x === 'string') {
				if (x===''){
					return;
				}
				powerMap.set(x, new Fraction(1));
			} else { // {variable, power} type
				const currentPower = powerMap.get(x.variable) ?? new Fraction(0);
				powerMap.set(x.variable, currentPower.plus(x.power));
			}
		});
		// remove all zero powers
		powerMap.forEach((power, variable) => {
			if (power.is.zero()) {
				powerMap.delete(variable);
			}
		});
		// sort the powerMap for signature
		const sortedPowerMap = new Map([...powerMap].sort());
		this.coeff = coeff;
		this.powerMap = powerMap;
		this.signature = powerMapToString(sortedPowerMap);
		this.kind = 'term';
		this.type = this.powerMap.size === 0 ? 'term-frac' : 'term';
		this.fractionalDisplayMode = false;
	}

	// cast to fraction type if possible
	

	/** 
	 * change the fractional display to true
	 * WARNING: changes the term in place
	 * @returns {Term} reference to current term
	 * */ 
	setFractionalDisplay() {
		this.fractionalDisplayMode = true;
		return this;
	}
	/**
	 * change the fractional display to false
	 * WARNING: changes the term in place
	 * @returns {Term} reference to current term
	 * */
	setCoeffDisplay() {
		this.fractionalDisplayMode = false;
		return this;
	}


	// PRIMITIVE RETURN TYPES
	/**
	 * casts this term as a latex string
	 * @returns {string} the latex string representation of this term
	 */
	toString() {
		// if no terms, return the coefficient
		if (this.powerMap.size === 0) {
			return `${this.coeff}`;
		}
		if (this.coeff.is.zero()) {
			return '0';
		}
		if (!this.fractionalDisplayMode) {
			// if there are terms, return the coefficient times the terms
			const variable = powerMapToString(this.powerMap);
			// special cases: coeff===1, coeff===-1, coeff===0
			if (this.coeff.abs().is.equalTo(1)) {
				return this.coeff.is.equalTo(1) ? `${variable}` : `- ${variable}`;
			}
			return `${this.coeff} ${variable}`;
		} else {
			// split into numerator and denominator
			/** @type {Map<string,Fraction>} */
			const numeratorPowerMap = new Map();
			/** @type {Map<string,Fraction>} */
			const denominatorPowerMap = new Map();
			this.powerMap.forEach((power, variable) => {
				if (power.is.positive()) {
					numeratorPowerMap.set(variable, power);
				} else if (power.is.negative()) {
					denominatorPowerMap.set(variable, power.times(-1));
				}
			});
			const numeratorVariable = powerMapToString(numeratorPowerMap);
			const denominatorVariable = powerMapToString(denominatorPowerMap);
			if (this.coeff.den === 1 && denominatorVariable === '') {
				if (this.coeff.abs().is.equalTo(1)) {
					return this.coeff.is.equalTo(1) ? `${numeratorVariable}` : `- ${numeratorVariable}`;
				}
				return `${this.coeff} ${numeratorVariable}`;
			}
			let numerator = '', denominator = '';
			if (numeratorVariable === '') {
				numerator = `${this.coeff.num}`;
			} else if (this.coeff.num === 1) {
				numerator = numeratorVariable;
			} else if (this.coeff.num === -1) {
				numerator = `- ${numeratorVariable}`;
			} else {
				numerator = `${this.coeff.num} ${numeratorVariable}`;
			}
			if (denominatorVariable === '') {
				denominator = `${this.coeff.den}`;
			} else if (this.coeff.den === 1) {
				denominator = denominatorVariable;
			} else {
				denominator = `${this.coeff.den} ${denominatorVariable}`;
			}
			return `\\frac{${numerator}}{${denominator}}`;
		}
	}
}
