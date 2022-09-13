import { Fraction, FractionJSON } from '../fractionClass';
import {
	SquareRoot,
	VariableExponent,
	BasicTerm,
	Imaginary,
	SquareRootJSON,
	VariableExponentJSON,
	ImaginaryJSON,
} from '../basic';
import { numberToFraction } from '../utils/numberToFraction';
import { Expression } from './expressionClass';

/**
 * A term represented by k x_1 x_2 ... x_n, where k is the coefficient
 * and x_i represent "basic units" (square roots, variables and the imaginary unit)
 */

export class Term extends BasicTerm {
	/** array of basic units (sqrt, variableExponents, imaginary unit) */
	basicUnits: (SquareRoot | VariableExponent | Imaginary)[];

	constructor(...basicUnits: (number | Fraction | string | SquareRoot | VariableExponent | Imaginary)[]) {
		let coeff = new Fraction(1);
		let simplifiedBasicUnits: (SquareRoot | VariableExponent)[] = [];
		const variables: string[] = [];
		const variablePositions: { [key: string]: number } = {};
		let surd: SquareRoot | undefined = undefined;
		let imaginary: Imaginary | undefined = undefined;
		basicUnits
			.filter((e) => e !== '')
			.forEach((unit) => {
				if (typeof unit === 'number' || unit instanceof Fraction) {
					coeff = coeff.times(unit);
				}
				if (typeof unit === 'string') {
					unit = unit === 'i' ? new Imaginary() : new VariableExponent(1, { variable: unit });
				}
				if (unit instanceof SquareRoot) {
					coeff = coeff.times(unit.coeff);
					if (!unit.isRational()) {
						if (surd === undefined) {
							surd = new SquareRoot(unit.radicand);
						} else {
							const newSurd = surd.times(new SquareRoot(unit.radicand));
							coeff = coeff.times(newSurd.coeff);
							if (newSurd.isRational()) {
								surd = undefined;
							} else {
								surd = new SquareRoot(surd.radicand);
							}
						}
					}
				}
				if (unit instanceof Imaginary) {
					coeff = coeff.times(unit.coeff);
					if (imaginary === undefined) {
						imaginary = new Imaginary();
					} else {
						coeff = coeff.times(-1);
						imaginary = undefined;
					}
				}
				if (unit instanceof VariableExponent) {
					coeff = coeff.times(unit.coeff);
					if (variables.includes(unit.variable)) {
						simplifiedBasicUnits[variablePositions[unit.variable]] = new VariableExponent(1, {
							variable: unit.variable,
							n: unit.n,
						}).times(<VariableExponent>simplifiedBasicUnits[variablePositions[unit.variable]]);
					} else {
						variables.push(unit.variable);
						simplifiedBasicUnits.push(new VariableExponent(1, { variable: unit.variable, n: unit.n }));
						variablePositions[unit.variable] = simplifiedBasicUnits.length - 1;
					}
				}
			});
		// sort basic units
		simplifiedBasicUnits.sort();
		simplifiedBasicUnits = simplifiedBasicUnits.filter((e) => e instanceof SquareRoot || !e.n.isEqualTo(0));
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
	}

	/**
	 * Multiplication
	 */
	times(x: number | Fraction | string | VariableExponent | SquareRoot | Imaginary | Term): Term {
		if (typeof x === 'number') {
			x = numberToFraction(x);
		}
		if (x instanceof Fraction) {
			return new Term(this.coeff.times(x), ...this.basicUnits);
		}
		if (typeof x === 'string') {
			x = x === 'i' ? new Imaginary() : new VariableExponent(1, { variable: x });
		}
		if (x instanceof VariableExponent || x instanceof SquareRoot || x instanceof Imaginary) {
			return new Term(this.coeff, ...this.basicUnits, x);
		}
		return new Term(this.coeff.times(x.coeff), ...this.basicUnits, ...x.basicUnits);
	}

	negative(): Term {
		return new Term(this.coeff.negative(), ...this.basicUnits);
	}

	plus(x: number | Fraction | string | VariableExponent | SquareRoot | Imaginary | Term): Term | Expression {
		if (x instanceof Term && x.variableString === this.variableString) {
			return new Term(this.coeff.plus(x.coeff), ...this.basicUnits);
		}
		return new Expression(this, x);
	}

	minus(x: number | Fraction | string | VariableExponent | SquareRoot | Imaginary | Term): Term | Expression {
		if (typeof x === 'number') {
			x = new Fraction(x);
		}
		if (typeof x === 'string') {
			x = new Term(x);
		}
		return new Expression(this, x.negative());
	}

	pow(n: number): Term {
		const basicUnits = <(SquareRoot | VariableExponent)[]>this.basicUnits.filter((t) => !(t instanceof Imaginary));
		const imag = this.basicUnits.find((t) => t instanceof Imaginary);
		const imagPow = imag === undefined ? undefined : imag.pow(n);
		if (imagPow === undefined) {
			return new Term(this.coeff.pow(n), ...basicUnits.map((x) => x.pow(n)));
		}
		return imagPow instanceof Fraction
			? new Term(this.coeff.pow(n).times(imagPow), ...basicUnits.map((x) => x.pow(n)))
			: new Term(this.coeff.pow(n), ...basicUnits.map((x) => x.pow(n)), imagPow);
	}

	subIn(x: number | Fraction): Fraction {
		let frac = this.coeff.clone();
		for (const unit of this.basicUnits) {
			if (!(unit instanceof VariableExponent)) {
				throw new Error(`subIn only valid for Unknowns at the moment ${unit}`);
			}
			frac = frac.times(unit.subIn(x));
		}
		return frac;
	}

	subInNumber(x: number): number {
		let frac = this.coeff.valueOf();
		for (const unit of this.basicUnits) {
			if (!(unit instanceof VariableExponent)) {
				throw new Error(`subIn only valid for Unknowns at the moment ${unit}`);
			}
			frac = frac * unit.subInNumber(x);
		}
		return frac;
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
	toJSON(): { type: string; args: [FractionJSON, ...(SquareRootJSON | VariableExponentJSON | ImaginaryJSON)[]] } {
		return {
			type: 'term',
			args: [this.coeff.toJSON(), ...this.basicUnits.map((x) => x.toJSON())],
		};
	}
}
