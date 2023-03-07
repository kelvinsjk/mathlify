import { Fraction, FractionJSON } from '../fractionClass';
import {
	SquareRoot,
	VariableTerm,
	BasicTerm,
	Imaginary,
	SquareRootJSON,
	VariableTermJSON,
	ImaginaryJSON,
} from '../basic';
import { numberToFraction } from '../utils/numberToFraction';
import { Expression } from './expressionClass';

/**
 * A term represented by k x_1 x_2 ... x_n, where k is the coefficient
 * and x_i represent "basic units" (square roots, variables and the imaginary unit)
 */

export class Term extends BasicTerm {
	/** array of basic units (sqrt, variableTerms, imaginary unit) */
	basicUnits: (SquareRoot | VariableTerm | Imaginary)[];
	isSurd: boolean;
	isImag: boolean;

	constructor(...basicUnits: (number | Fraction | string | SquareRoot | VariableTerm | Imaginary)[]) {
		let coeff = new Fraction(1);
		let simplifiedBasicUnits: VariableTerm[] = [];
		const variables: string[] = [];
		const variablePositions: { [key: string]: number } = {};
		let surd: SquareRoot | undefined = undefined;
		let imaginary: Imaginary | undefined = undefined;
		let imagPresent = false;
		let surdPresent = false;
		basicUnits
			.filter((e) => e !== '')
			.forEach((unit) => {
				if (typeof unit === 'number' || unit instanceof Fraction) {
					coeff = coeff.times(unit);
				}
				if (typeof unit === 'string') {
					if (unit === 'i') {
						unit = new Imaginary();
						imagPresent = true;
					} else {
						unit = new VariableTerm(1, { variable: unit });
					}
				}
				if (unit instanceof SquareRoot) {
					coeff = coeff.times(unit.coeff);
					if (!unit.isRational()) {
						if (surd === undefined) {
							surd = new SquareRoot(unit.radicand);
							surdPresent = true;
						} else {
							const newSurd = surd.times(new SquareRoot(unit.radicand));
							coeff = coeff.times(newSurd.coeff);
							if (newSurd.isRational()) {
								surd = undefined;
								surdPresent = false;
							} else {
								surd = new SquareRoot(newSurd.radicand);
								surdPresent = true;
							}
						}
					}
				}
				if (unit instanceof Imaginary) {
					coeff = coeff.times(unit.coeff);
					if (imaginary === undefined) {
						imaginary = new Imaginary();
						imagPresent = true;
					} else {
						coeff = coeff.times(-1);
						imaginary = undefined;
						imagPresent = false;
					}
				}
				if (unit instanceof VariableTerm) {
					coeff = coeff.times(unit.coeff);
					if (variables.includes(unit.variable)) {
						simplifiedBasicUnits[variablePositions[unit.variable]] = new VariableTerm(1, {
							variable: unit.variable,
							n: unit.n,
						}).times(simplifiedBasicUnits[variablePositions[unit.variable]]);
					} else {
						variables.push(unit.variable);
						simplifiedBasicUnits.push(new VariableTerm(1, { variable: unit.variable, n: unit.n }));
						variablePositions[unit.variable] = simplifiedBasicUnits.length - 1;
					}
				}
			});
		// sort basic units
		simplifiedBasicUnits.sort((a, b) => {
			// functions are placed last
			if (a.variable[0] === '\\' && b.variable[0] !== '\\') {
				return 1;
			}
			if (a.variable[0] !== '\\' && b.variable[0] === '\\') {
				return -1;
			}
			return a < b ? -1 : 1;
		});
		simplifiedBasicUnits = simplifiedBasicUnits.filter((e) => !e.n.isEqualTo(0));
		if (surd !== undefined) {
			simplifiedBasicUnits.unshift(surd);
		}
		if (imaginary !== undefined) {
			simplifiedBasicUnits.push(imaginary);
		}
		// construct term string
		super(
			coeff,
			simplifiedBasicUnits.reduce(
				(prev, curr, i) => `${prev}${curr}${i === simplifiedBasicUnits.length - 1 ? '' : ' '}`,
				'',
			),
		);
		this.basicUnits = simplifiedBasicUnits;
		this.isImag = imagPresent;
		this.isSurd = surdPresent && !imagPresent;
	}

	/**
	 * Multiplication
	 */
	times(x: number | Fraction | string | VariableTerm | SquareRoot | Imaginary | Term): Term {
		if (typeof x === 'number') {
			x = numberToFraction(x);
		}
		if (x instanceof Fraction) {
			return new Term(this.coeff.times(x), ...this.basicUnits);
		}
		if (typeof x === 'string') {
			x = x === 'i' ? new Imaginary() : new VariableTerm(1, { variable: x });
		}
		if (x instanceof VariableTerm || x instanceof SquareRoot || x instanceof Imaginary) {
			return new Term(this.coeff, ...this.basicUnits, x);
		}
		return new Term(this.coeff.times(x.coeff), ...this.basicUnits, ...x.basicUnits);
	}

	negative(): Term {
		return new Term(this.coeff.negative(), ...this.basicUnits);
	}

	plus(x: number | Fraction | string | VariableTerm | SquareRoot | Imaginary | Term): Term | Expression {
		if (x instanceof Term && x.variableString === this.variableString) {
			return new Term(this.coeff.plus(x.coeff), ...this.basicUnits);
		}
		return new Expression(this, x);
	}

	minus(x: number | Fraction | string | VariableTerm | SquareRoot | Imaginary | Term): Term | Expression {
		if (typeof x === 'number') {
			x = new Fraction(x);
		}
		if (typeof x === 'string') {
			x = new Term(x);
		}
		return new Expression(this, x.negative());
	}

	pow(n: number): Term {
		const basicUnits = <(SquareRoot | VariableTerm)[]>this.basicUnits.filter((t) => !(t instanceof Imaginary));
		const imag = this.basicUnits.find((t) => t instanceof Imaginary);
		const imagPow = imag === undefined ? undefined : imag.pow(n);
		if (imagPow === undefined) {
			return new Term(this.coeff.pow(n), ...basicUnits.map((x) => x.pow(n)));
		}
		return imagPow instanceof Fraction
			? new Term(this.coeff.pow(n).times(imagPow), ...basicUnits.map((x) => x.pow(n)))
			: new Term(this.coeff.pow(n), ...basicUnits.map((x) => x.pow(n)), imagPow);
	}

	// applies negative if surd or imaginary term present
	conjugate(): Term {
		return this.isImag || this.isSurd ? this.negative() : this.clone();
	}

	subIn(x: number | Fraction): Fraction {
		let frac = this.coeff.clone();
		for (const unit of this.basicUnits) {
			if (!(unit instanceof VariableTerm)) {
				throw new Error(`subIn only valid for Variable Terms at the moment ${unit}`);
			}
			frac = frac.times(unit.subIn(x));
		}
		return frac;
	}

	subInNumber(x: number): number {
		let val = this.coeff.valueOf();
		for (const unit of this.basicUnits) {
			if (unit instanceof VariableTerm) {
				val = val * unit.subInNumber(x);
			} else if (unit instanceof SquareRoot) {
				val = val * unit.valueOf();
			} else {
				throw new Error(`subIn not valid for imaginary units: ${unit}`);
			}
		}
		return val;
	}

	valueOf(): number {
		let val = this.coeff.valueOf();
		for (const unit of this.basicUnits) {
			if (unit instanceof SquareRoot) {
				val = val * unit.valueOf();
			} else {
				throw new Error(`value only valid for SquareRoots at the moment: ${unit}`);
			}
		}
		return val;
	}

	square(): Term {
		return this.pow(2);
	}

	clone(): Term {
		return new Term(this.coeff.clone(), ...this.basicUnits.map((x) => x.clone()));
	}

	/**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */
	toJSON(): { type: string; args: [FractionJSON, ...(SquareRootJSON | VariableTermJSON | ImaginaryJSON)[]] } {
		return {
			type: 'term',
			args: [this.coeff.toJSON(), ...this.basicUnits.map((x) => x.toJSON())],
		};
	}
}
