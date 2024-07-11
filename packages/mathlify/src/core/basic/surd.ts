import { Fraction, FractionJSON } from '../fractionClass';
import { MathSymbol } from '../algebra/mathSymbolClass';
import { numberToFraction } from '../utils';

/**
 * Surd class representing \\sqrt{x}
 */
export class Surd extends MathSymbol {
	kind: 'surd';
	radicand: number;

	constructor(radicand: number) {
		if (!(radicand >= 0 && Number.isInteger(radicand))) {
			throw new RangeError(`${radicand} must be a non-negative integer for the Surd class`);
		}
		super(`\\sqrt{${radicand}}`);
		this.kind = 'surd';
		this.radicand = radicand;
	}

	toJSON(): SurdJSON {
		return {
			type: 'surd',
			args: [this.radicand],
		};
	}
}

export interface SurdJSON {
	type: 'surd';
	args: [number];
}

/**
 * NthRootSymbol class representing \\sqrt[n]{x}
 */
export class RootSymbol extends MathSymbol {
	kind: 'rootSymbol';
	radicand: Fraction;
	n: number;

	constructor(n: number, radicand: number | Fraction) {
		if (!(n >= 2 && Number.isInteger(n))) {
			throw new RangeError(`${n} must be a integer >= 2 for the NthRootSymbol class`);
		}
		radicand = numberToFraction(radicand);
		super(`\\sqrt[${n}]{${radicand}}`);
		this.kind = 'rootSymbol';
		this.radicand = radicand;
		this.n = n;
	}

	toJSON(): RootSymbolJSON {
		return {
			type: 'rootSymbol',
			args: [this.n, this.radicand.toJSON()],
		};
	}
}

export interface RootSymbolJSON {
	type: 'rootSymbol';
	args: [number, FractionJSON];
}
