import { Fraction, FractionJSON } from '../fractionClass';
import { MathSymbol } from '../algebra/mathSymbolClass';

/**
 * Imaginary class representing 'ki', where i is the complex unit
 */
export class ImaginarySymbol extends MathSymbol {
	kind: 'imaginarySymbol';

	constructor() {
		super('\\mathrm{i}');
		this.kind = 'imaginarySymbol';
	}

	toJSON(): ImaginarySymbolJSON {
		return {
			type: 'imaginarySymbol',
			args: [],
		};
	}
}

export interface ImaginarySymbolJSON {
	type: 'imaginarySymbol';
	args: [];
}
