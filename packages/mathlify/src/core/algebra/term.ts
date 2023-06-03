import { Fraction, FractionJSON } from '../fractionClass';
//import {
//	SquareRoot,
//	VariableTerm,
//	BasicTerm,
//	Imaginary,
//	SquareRootJSON,
//	VariableTermJSON,
//	ImaginaryJSON,
//} from '../basic';
import {
	MathSymbol,
	MathSymbolJSON,
	ImaginarySymbol,
	//ImaginarySymbolJSON,
	Surd,
	SurdJSON,
	//RootSymbol,
	//RootSymbolJSON
} from '../basic';
import { numberToFraction } from '../utils/numberToFraction';
//import { SquareRoot, SquareRootJSON } from './sqrt';
//import { Expression } from './expressionClass';

/**
 * A term represented by k x_1 x_2 ... x_n, where k is the coefficient
 * and x_i represent "basic units" (square roots, variables and the imaginary unit)
 */

export class Term {
	kind: string;
	coeff: Fraction;
	symbols: { [key: string]: { symbol: MathSymbol | Surd; power: Fraction } };

	constructor(
		...args: (
			| number
			| Fraction
			| string
			| MathSymbol
			| ImaginarySymbol
			| Surd
			//|RootSymbol
			| [string | MathSymbol, number | Fraction]
		)[]
	) {
		let coeff = new Fraction(1);
		let symbols: { [key: string]: { symbol: MathSymbol | Surd; power: Fraction } } = {};
		let imagCount = 0;
		let surdArg: number = 1;
		args.forEach((x) => {
			if (Array.isArray(x)) {
				const [symbol, power] = x;
				if (symbol === 'i' || symbol instanceof ImaginarySymbol) {
					imagCount++;
				} else {
					const mathSymbol = typeof symbol === 'string' ? new MathSymbol(symbol) : symbol;
					appendToSymbols(symbols, mathSymbol, power);
				}
			} else if (typeof x === 'string') {
				if (x === 'i') {
					imagCount++;
				} else if (x === 'surd') {
					throw new RangeError(`'surd' is a reserved symbol name in the Term class`);
				} else {
					const mathSymbol = new MathSymbol(x);
					appendToSymbols(symbols, mathSymbol);
				}
			} else if (typeof x === 'number' || x instanceof Fraction) {
				coeff = coeff.times(x);
			} else if (x instanceof ImaginarySymbol) {
				imagCount++;
			} else if (x instanceof Surd) {
				surdArg *= x.radicand;
			} else {
				if (x.symbol === 'i' || x.symbol === 'surd') {
					throw new RangeError(`'i' and 'surd' are reserved symbol names in the Term class`);
				}
				// MathSymbol
				appendToSymbols(symbols, x);
			}
		});
		// handle imaginary
		imagCount = imagCount % 4;
		if (imagCount === 2) {
			coeff = coeff.times(-1);
		} else if (imagCount === 1) {
			symbols['i'] = { symbol: new ImaginarySymbol(), power: new Fraction(1) };
		} else if (imagCount === 3) {
			coeff = coeff.times(-1);
			symbols['i'] = { symbol: new ImaginarySymbol(), power: new Fraction(1) };
		}
		// handle surds. sqrt(surdArg) = y sqrt{x}
		const [y, x] = extractPowers(surdArg);
		coeff = coeff.times(y);
		if (x !== 1) {
			symbols['surd'] = { symbol: new Surd(x), power: new Fraction(1) };
		}
		// set up class props
		this.coeff = coeff;
		if (this.coeff.isEqualTo(0)) {
			symbols = {};
		}
		for (const symbol in symbols) {
			if (symbols[symbol].power.isEqualTo(0)) {
				delete symbols[symbol];
			}
		}
		this.symbols = symbols;
		const length = Object.keys(symbols).length;
		if (length === 0) {
			this.kind = 'fractionTerm';
		} else if (length === 1) {
			if ('surd' in symbols) {
				this.kind = 'sqrtTerm';
			} else if ('i' in symbols) {
				this.kind = 'imaginaryTerm';
			} else {
				this.kind = 'singleton';
			}
		} else {
			this.kind = 'term';
		}
	}

	isSurd(): boolean {
		return 'surd' in this.symbols;
	}

	isImag(): boolean {
		return 'i' in this.symbols;
	}

	isRational(): boolean {
		return Object.keys(this.symbols).length === 0;
	}

	/**
	 * check if two terms are 'like terms'
	 * (ie same symbols with same powers)
	 */
	isLike(x: Term): boolean {
		if (Object.keys(this.symbols).length !== Object.keys(x.symbols).length) {
			return false;
		}
		for (const term in this.symbols) {
			if (!(term in x.symbols)) {
				return false;
			} else if (this.symbols[term].power.isNotEqualTo(x.symbols[term].power)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Multiplication
	 */
	times(
		x:
			| number
			| Fraction
			| string
			| MathSymbol
			| ImaginarySymbol
			| Surd
			//|RootSymbol
			| [string | MathSymbol, number | Fraction]
			| Term,
	): Term {
		if (typeof x === 'number' || x instanceof Fraction) {
			return new Term(this.coeff.times(x), ...symbolsToArray(this.symbols));
		} else if (
			typeof x === 'string' ||
			x instanceof MathSymbol ||
			x instanceof ImaginarySymbol ||
			x instanceof Surd ||
			Array.isArray(x)
		) {
			return new Term(this.coeff, ...symbolsToArray(this.symbols), x);
		} else {
			// Term type
			return new Term(this.coeff.times(x.coeff), ...symbolsToArray(this.symbols), ...symbolsToArray(x.symbols));
		}
	}

	divide(
		x:
			| number
			| Fraction
			| string
			| MathSymbol
			| ImaginarySymbol
			| Surd
			//|RootSymbol
			| [string | MathSymbol, number | Fraction]
			| Term,
	): Term {
		if (typeof x === 'number' || x instanceof Fraction) {
			return new Term(this.coeff.divide(x), ...symbolsToArray(this.symbols));
		} else if (typeof x === 'string' || x instanceof MathSymbol) {
			return new Term(this.coeff, ...symbolsToArray(this.symbols), [x, -1]);
		} else if (x instanceof ImaginarySymbol) {
			return new Term(this.coeff.negative(), ...symbolsToArray(this.symbols), x);
		} else if (x instanceof Surd) {
			return new Term(this.coeff.divide(x.radicand), ...symbolsToArray(this.symbols), x);
		} else if (Array.isArray(x)) {
			return new Term(this.coeff, ...symbolsToArray(this.symbols), [x[0], numberToFraction(x[1]).negative()]);
		} else {
			// Term type
			return this.times(x.reciprocal());
		}
	}

	negative(): Term {
		return new Term(this.coeff.negative(), ...symbolsToArray(this.symbols));
	}

	plus(x: number | Fraction | Term): Term {
		if (!(x instanceof Term)) {
			x = new Term(x);
		}
		if (!this.isLike(x)) {
			throw new Error(
				`addition of terms only work for like terms at the moment.
					${this} and ${x} received. Consider using the Expression class`,
			);
		}
		return new Term(this.coeff.plus(x.coeff), ...symbolsToArray(this.symbols));
	}
	minus(x: number | Fraction | Term): Term {
		if (!(x instanceof Term)) {
			x = new Term(x);
		}
		if (!this.isLike(x)) {
			throw new Error(
				`subtraction of terms only work for like terms at the moment.
					${this} and ${x} received. Consider using the Expression class`,
			);
		}
		return new Term(this.coeff.minus(x.coeff), ...symbolsToArray(this.symbols));
	}

	pow(n: number | Fraction): Term {
		if (n instanceof Fraction) {
			if (n.den !== 1) {
				throw new RangeError(`only integral n are allowed for term.pow at the moment. ${n} received`);
			}
			n = n.valueOf();
		}
		if (!Number.isInteger(n)) {
			throw new RangeError(`only integral n are allowed for term.pow at the moment. ${n} received`);
		}
		const multiple = n < 0 ? this.reciprocal() : this;
		let x = new Term(1);
		for (let i = 0; i < Math.abs(n); i++) {
			x = x.times(multiple);
		}
		return x;
	}

	reciprocal(): Term {
		const symbolsArray = Object.keys(this.symbols).map((x) => {
			return [this.symbols[x].symbol, this.symbols[x].power.reciprocal()] as [MathSymbol, Fraction];
		});
		return new Term(this.coeff.reciprocal(), ...symbolsArray);
	}

	// applies negative if surd or imaginary term present
	//conjugate(): Term {
	//	return this.isImag || this.isSurd ? this.negative() : this.clone();
	//}

	subIn(x: number | Fraction, symbol: string | MathSymbol = 'x'): Fraction {
		let y = this.coeff;
		symbol = typeof symbol === 'string' ? symbol : symbol.symbol;
		for (const symbol2 in this.symbols) {
			if (symbol2 === symbol) {
				y = y.times(numberToFraction(x).pow(this.symbols[symbol2].power));
			} else {
				throw new Error(`symbols other than ${symbol} (${symbol2}) found`);
			}
		}
		return y;
	}

	subInNumber(x: number, symbol: string | MathSymbol = 'x'): number {
		let y = this.coeff.valueOf();
		for (const symbol2 in this.symbols) {
			if (symbol2 === symbol) {
				y = y * Math.pow(x, this.symbols[symbol2].power.valueOf());
			} else if (symbol2 === 'surd') {
				const surd = this.symbols[symbol2].symbol;
				if (surd instanceof Surd) {
					y = y * Math.sqrt(surd.radicand);
				} else {
					throw new Error(`unexpected error: non-surd found`);
				}
			} else {
				throw new Error(`symbols other than ${symbol} (${symbol2}) found`);
			}
		}
		return y;
	}

	valueOf(): number {
		// TODO: 'e', 'pi', 'ln Term'
		let y = this.coeff.valueOf();
		for (const symbol2 in this.symbols) {
			if (symbol2 === 'surd') {
				const surd = this.symbols[symbol2].symbol;
				if (surd instanceof Surd) {
					y = y * Math.sqrt(surd.radicand);
				} else {
					throw new Error(`unexpected error: non-surd found`);
				}
			} else {
				throw new Error(`symbols other than surds (${symbol2}) found`);
			}
		}
		return y;
	}

	square(): Term | Fraction {
		return this.pow(2);
	}

	clone(): Term {
		return new Term(this.coeff.clone(), ...symbolsToArray(this.symbols));
	}

	toString(): string {
		if (this.coeff.isEqualTo(0)) {
			return `0`;
		}
		let numString = '',
			denString = '';
		for (const key in this.symbols) {
			const { power, symbol } = this.symbols[key];
			if (power.isEqualTo(1)) {
				if (numString !== '') {
					numString += ' ';
				}
				numString += `${symbol}`;
			} else if (power.isEqualTo(-1)) {
				if (denString !== '') {
					denString += ' ';
				}
				denString += `${symbol}`;
			} else if (power.isGreaterThan(0)) {
				const powerString = `${power}`.length > 1 ? `{${power}}` : `${power}`;
				if (numString !== '') {
					numString += ' ';
				}
				numString += `${symbol}^${powerString}`;
			} else if (power.isLessThan(0)) {
				const powerString = `${power.abs()}`.length > 1 ? `{${power.abs()}}` : `${power.abs()}`;
				if (denString !== '') {
					denString += ' ';
				}
				denString += `${symbol}^${powerString}`;
			} else {
				throw new Error(`Unexpected power 0 term`);
			}
		}
		// non-fraction
		if (denString === '') {
			return numString === '' ? this.coeff.toString() : termToString(this.coeff, numString);
		}
		// fraction type
		const sign = this.coeff.isGreaterThan(0) ? '' : '- ';
		if (numString === '') {
			return `${sign}\\frac{${this.coeff.abs().num}}{${termToString(this.coeff.den, denString)}}`;
		} else {
			return `${sign}\\frac{${termToString(this.coeff.abs().num, numString)}}{${termToString(
				this.coeff.den,
				denString,
			)}}`;
		}
	}

	/**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */
	toJSON(): { type: string; args: [FractionJSON, ...(MathSymbolJSON | SurdJSON)[]] | [FractionJSON, FractionJSON] } {
		return {
			type: 'term',
			args: [this.coeff.toJSON(), ...Object.keys(this.symbols).map((x) => this.symbols[x].symbol.toJSON())],
		};
	}
}

/**
 * append MathSymbol to symbols object
 *
 * @param symbols the symbols object
 * @param symbol the MathSymbol
 * @param power the power (number/Fraction). Defaults to 1
 */
function appendToSymbols(
	symbols: { [key: string]: { symbol: MathSymbol; power: Fraction } },
	symbol: MathSymbol,
	power: number | Fraction = 1,
): void {
	if (symbol.symbol in symbols) {
		symbols[symbol.symbol].power = symbols[symbol.symbol].power.plus(power);
	} else {
		symbols[symbol.symbol] = {
			symbol: symbol,
			power: numberToFraction(power),
		};
	}
}

/**
 * convert the symbols object to an array [symbol: MathSymbol, power: Fraction][]
 *
 * @param symbols: symbols object
 * @returns [symbol: MathSymbol, power: Fraction][]
 */
function symbolsToArray(symbols: { [key: string]: { symbol: MathSymbol; power: Fraction } }): [MathSymbol, Fraction][] {
	return Object.keys(symbols).map((key) => [symbols[key].symbol, symbols[key].power]);
}

/**
 * handle edge cases where coeff is 0/1/-1
 */
function termToString(coeff: number | Fraction, term: string): string {
	coeff = numberToFraction(coeff);
	if (coeff.isEqualTo(0)) {
		return `0`;
	} else if (coeff.isEqualTo(1)) {
		return term;
	} else if (coeff.isEqualTo(-1)) {
		return `- ${term}`;
	} else {
		return `${coeff} ${term}`;
	}
}

/** takes integers x and n, and returns [a, b] such that x = a^n b.
 * Only work for prime factors up to 100.
 *
 * @param x integer to extract powers from
 * @param options {y?: number, n?: number} defaults to y=1, n=2.
 * y facilitates a recursive algorithm while n is the power to be extracted.
 *
 */
function extractPowers(x: number, options?: { y?: number; n?: number }): [number, number] {
	if (x === 0) {
		return [0, 0];
	}
	const { y, n } = {
		y: 1,
		n: 2,
		...options,
	};
	if (!(Number.isInteger(n) && n >= 2)) {
		throw new RangeError(`n must be an integer at least 2. ${n} received`);
	}
	const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
	for (const prime of primes) {
		if (x % Math.pow(prime, n) === 0) {
			return extractPowers(x / Math.pow(prime, n), { n, y: y * prime });
		} else if (x < Math.pow(prime, n)) {
			break;
		}
	}
	return [y, x];
}
