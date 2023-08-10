// Unsimplified Term is a class that represents a collection
// of "term atoms" under multiplication and division.

import { Fraction, Term } from '../../../core/index.js';
import { bracket } from '../../../utils/index.js';

/**
 * Unsimplified Term class
 * @class
 * @property {{termAtom: Term, brackets: 'off'|'auto'|'always', multiplication: boolean}[]} termAtoms - the term atoms in the term
 * @property {boolean} fractionalDisplayMode - whether division is implemented with fractions or as a division sign (false by default)
 * @property {"unsimplified-term"} kind - mathlify unsimplified expression class kind
 * @property {"unsimplified-term"} type - mathlify unsimplified expression class type
 */
export class UnsimplifiedTerm {
	/** @type {{termAtom: Term, brackets: 'off'|'auto'|'always', multiplication: boolean}[]} */
	termAtoms;
	/** @type {boolean} */
	fractionalDisplayMode;
	/** @type {"unsimplified-term"} */
	kind;
	/** @type {"unsimplified-term"} */
	type;
	/**
	 * @constructor
	 * Creates an Unsimplified Term instance
	 * @param {(number|Fraction|string|Term|{termAtom: number|Fraction|string|Term, brackets?: 'off'|'auto'|'always', multiplication?: boolean}|(number|Fraction|string)[])[]} termAtoms -
	 * the terms are multiplied by default and
	 * brackets is 'off' for the first term and 'auto' by default.
	 */
	constructor(...termAtoms) {
		if (termAtoms.length === 0)
			throw new Error('UnsimplifiedTerm must have at least one atom');
		/** @type {{termAtom: Term, brackets: 'off'|'auto'|'always', multiplication: boolean}[]} */
		const parsedAtoms = [];
		termAtoms.forEach((atom, i) => {
			if (
				i === 0 &&
				typeof atom === 'object' &&
				'multiplication' in atom &&
				atom.multiplication === false
			)
				throw new Error('First term cannot have multiplication set to false');
			const t =
				typeof atom === 'number' || atom instanceof Fraction
					? {
							termAtom: new Term(atom),
							/** @type {'off'|'auto'|'always'} */
							brackets: i === 0 ? 'off' : 'auto',
							multiplication: true,
					  }
					: atom instanceof Term
					? {
							termAtom: atom,
							/** @type {'off'|'auto'|'always'} */
							brackets: i === 0 ? 'off' : 'auto',
							multiplication: true,
					  }
					: typeof atom === 'string'
					? {
							termAtom: new Term(atom),
							/** @type {'off'|'auto'|'always'} */
							brackets: i === 0 ? 'off' : 'auto',
							multiplication: true,
					  }
					: Array.isArray(atom)
					? {
							termAtom: new Term(...atom),
							/** @type {'off'|'auto'|'always'} */
							brackets: i === 0 ? 'off' : 'auto',
							multiplication: true,
					  }
					: {
							termAtom:
								atom.termAtom instanceof Term
									? atom.termAtom
									: new Term(atom.termAtom),
							/** @type {'off'|'auto'|'always'} */
							brackets: atom.brackets ?? (i === 0 ? 'off' : 'auto'),
							multiplication: atom.multiplication ?? true,
					  };
			parsedAtoms.push(t);
		});
		this.termAtoms = parsedAtoms;
		this.fractionalDisplayMode = false;
		/** @type {"unsimplified-term"} */
		this.kind = 'unsimplified-term';
		/** @type {"unsimplified-term"} */
		this.type = 'unsimplified-term';
	}

	/**
	 * multiply to this Term
	 * @param {number|Fraction|string|Term} x - term to be multiplied
	 * @param {{brackets: 'off'|'auto'|'always'}} [options] - options for the brackets (defaults to auto)
	 * @returns {UnsimplifiedTerm} - the new Unsimplified Expression
	 */
	times(x, options) {
		const { brackets = 'auto' } = options ?? {};
		const newTerm = new UnsimplifiedTerm(...this.termAtoms, {
			termAtom: x,
			brackets,
			multiplication: true,
		});
		return newTerm;
	}

	/**
	 * divide from this Term
	 * @param {number|Fraction|string|Term} x - term to be subtracted
	 * @param {{brackets?: 'off'|'auto'|'always', fractionalDisplayMode?: boolean}} [options] - options for the brackets (defaults to auto) and fractionalDisplayMode (defaults to false)
	 * @returns {UnsimplifiedTerm} - the new Unsimplified Expression
	 */
	divide(x, options) {
		const { brackets = 'auto', fractionalDisplayMode = false } = options ?? {};
		const newTerm = new UnsimplifiedTerm(...this.termAtoms, {
			termAtom: x,
			brackets,
			multiplication: false,
		});
		newTerm.fractionalDisplayMode = fractionalDisplayMode;
		return newTerm;
	}

	/** simplify to Term class
	 * @returns {Term} - the simplified Term
	 */
	simplify() {
		return this.termAtoms.reduce((prev, atom) => {
			return atom.multiplication
				? prev.times(atom.termAtom)
				: prev.divide(atom.termAtom);
		}, new Term(1));
	}

	/**
	 * toString
	 * @returns {string} - the LaTeX string representation of the Expression
	 */
	toString() {
		return this.termAtoms.reduce((prev, atom, i) => {
			return i === 0
				? `${bracket(atom.termAtom, { mode: atom.brackets })}`
				: atom.multiplication
				? `${prev} \\times ${bracket(atom.termAtom, { mode: atom.brackets })}`
				: this.fractionalDisplayMode
				? `\\frac{${prev}}{${bracket(atom.termAtom, { mode: atom.brackets })}}`
				: `${prev} \\div ${bracket(atom.termAtom, { mode: atom.brackets })}`;
		}, '');
	}
}
