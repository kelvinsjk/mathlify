// a term is made up of a coefficient
// and a collection of symbols (which we will call atoms)
// under exponentiation and multiplication
//
// TODO: handle surds and functions
// - surds (eg sqrt{2}) (TODO)
// - functions (eg sin(x)) (TODO)
// we will perform automatic simplification
// TODO: handling of negative coefficients for fractional display mode

import { Fraction } from '../../fraction.js';
import { numberToFraction } from '../../../utils/toFraction.js';
import { powerMapToString } from '../utils/index.js';

/** Term class
 * @property {Fraction} coeff - the coefficient of the term
 * @property {Map<string,Fraction>} powerMap - the key is the variable atom, the value is the power
 * @property {string} signature - a string representation of the (sorted) variables
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
	 * @param {(Fraction|string|number|{variable: string, power: number|Fraction}|[string,number|Fraction])[]} args -
	 * the constituents of the term (either number or fraction or string)
	 */
	constructor(...args) {
		/** @type {Map<string,Fraction>} */
		const powerMap = new Map();
		let coeff = new Fraction(1);
		//! run through each coefficient
		args.forEach((x) => {
			if (typeof x === 'number' || x instanceof Fraction) {
				coeff = coeff.times(x);
			} else if (typeof x === 'string') {
				if (x === '') {
					return;
				}
				powerMap.set(x, new Fraction(1));
			} else if (Array.isArray(x)) {
				// [variable, power] type
				const [variable, power] = x;
				const currentPower = powerMap.get(variable) ?? new Fraction(0);
				powerMap.set(variable, currentPower.plus(power));
			} else {
				// {variable, power} type
				const currentPower = powerMap.get(x.variable) ?? new Fraction(0);
				powerMap.set(x.variable, currentPower.plus(x.power));
			}
		});
		//! remove all zero powers
		powerMap.forEach((power, variable) => {
			if (power.is.zero()) {
				powerMap.delete(variable);
			}
		});
		//! sort the powerMap for term signature
		const sortedPowerMap = new Map([...powerMap].sort());
		this.coeff = coeff;
		this.powerMap = powerMap;
		this.signature = powerMapToString(sortedPowerMap);
		this.kind = 'term';
		this.type = this.powerMap.size === 0 ? 'term-frac' : 'term';
		this.fractionalDisplayMode = false;
	}

	/**
	 * term multiplication
	 * @param {number|Fraction|string|Term} x - the other term to multiply with
	 * @returns {Term} the product of the two terms
	 */
	times(x) {
		if (typeof x === 'number' || x instanceof Fraction) {
			return powerMapToTerm(this.powerMap, this.coeff.times(x));
		}
		if (typeof x === 'string') {
			const newPowerMap = new Map(this.powerMap);
			const currentPower = newPowerMap.get(x) ?? new Fraction(0);
			newPowerMap.set(x, currentPower.plus(1));
			return powerMapToTerm(newPowerMap, this.coeff);
		}
		// x is a term
		const newPowerMap = new Map(this.powerMap);
		x.powerMap.forEach((power, variable) => {
			const currentPower = newPowerMap.get(variable) ?? new Fraction(0);
			newPowerMap.set(variable, currentPower.plus(power));
		});
		return powerMapToTerm(newPowerMap, this.coeff.times(x.coeff));
	}

	/**
	 * term division
	 * @param {number|Fraction|string|Term} x - the other term to divide with
	 * @param {{fractionalDisplayMode: boolean}} [options] - whether to display the term as a fraction (default: false) (3/5 x by default, 3x/5 if true)
	 * @returns {Term} the quotient of the two terms
	 */
	divide(x, options = { fractionalDisplayMode: false }) {
		/** @type {Term} */
		let newTerm = this;
		if (typeof x === 'number' || x instanceof Fraction) {
			newTerm = powerMapToTerm(this.powerMap, this.coeff.divide(x));
		} else if (typeof x === 'string') {
			const newPowerMap = new Map(this.powerMap);
			const currentPower = newPowerMap.get(x) ?? new Fraction(0);
			newPowerMap.set(x, currentPower.minus(1));
			newTerm = powerMapToTerm(newPowerMap, this.coeff);
		} else {
			// x is a term
			const newPowerMap = new Map(this.powerMap);
			x.powerMap.forEach((power, variable) => {
				const currentPower = newPowerMap.get(variable) ?? new Fraction(0);
				newPowerMap.set(variable, currentPower.minus(power));
			});
			newTerm = powerMapToTerm(newPowerMap, this.coeff.divide(x.coeff));
		}
		if (options.fractionalDisplayMode) {
			newTerm.setFractionalDisplay();
		}
		return newTerm;
	}

	/**
	 * negative
	 * @returns {Term} the negative of the term
	 * */
	negative() {
		return this.times(-1);
	}

	/**
	 * sub in many
	 * @param {{[key: string]: number|Fraction}|number|Fraction} variableToValue - the values to sub in with the key being the variable signature.
	 * If a number of Fraction is received, we assume that the variable is 'x'
	 * @returns {Term} the term with the values subbed in
	 */
	subIn(variableToValue) {
		const subInObject =
			typeof variableToValue === 'number' || variableToValue instanceof Fraction
				? { x: variableToValue }
				: variableToValue;
		const newPowerMap = new Map(this.powerMap);
		let newCoeff = this.coeff;
		for (const [variable, value] of Object.entries(subInObject)) {
			if (newPowerMap.has(variable)) {
				const power = newPowerMap.get(variable);
				if (!power?.is.integer()) {
					throw new Error(
						`Non-integral powers not supported at the moment. Unable to sub ${value} for ${variable} in ${this}.`
					);
				}
				newCoeff = newCoeff.times(numberToFraction(value).pow(power.num));
				newPowerMap.delete(variable);
			}
		}
		return powerMapToTerm(newPowerMap, newCoeff);
	}

	/** methods to cast this term to other types */
	cast = {
		/**
		 * cast to Fraction type
		 * @returns {Fraction} the fraction representation of this term
		 */
		toFraction: () => {
			if (this.powerMap.size === 0) {
				return this.coeff;
			}
			throw new Error(`cannot cast ${this} to Fraction: variables detected`);
		},
	};

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
					return this.coeff.is.equalTo(1)
						? `${numeratorVariable}`
						: `- ${numeratorVariable}`;
				}
				return `${this.coeff} ${numeratorVariable}`;
			}
			let numerator = '',
				denominator = '';
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

/**
 * recreates Term objects from a power map
 * @param {Map<string,Fraction>|undefined} powerMap - the power map to be converted
 * @param {Fraction?} coeff - the coefficient of the term (optional)
 * @returns {Term} the term object
 */
export function powerMapToTerm(powerMap, coeff) {
	/** @type {(Fraction|{variable: string, power: Fraction})[]} */
	const termAtoms = [];
	if (coeff) {
		termAtoms.push(coeff);
	}
	if (powerMap) {
		powerMap.forEach((power, variable) => {
			termAtoms.push({ variable, power });
		});
	}
	return new Term(...termAtoms);
}
