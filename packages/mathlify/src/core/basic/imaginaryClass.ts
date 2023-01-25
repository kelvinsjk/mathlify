import { Fraction, FractionJSON } from '../fractionClass';
import { BasicTerm } from './basicTermClass';

/**
 * Imaginary class representing 'ki', where i is the complex unit
 */
export class Imaginary extends BasicTerm {
	constructor(coeff: number | Fraction = 1) {
		super(coeff, '\\mathrm{i}');
	}

	plus(x: Imaginary): Imaginary {
		return new Imaginary(this.coeff.plus(x.coeff));
	}
	negative(): Imaginary {
		return new Imaginary(this.coeff.negative());
	}
	minus(x: Imaginary): Imaginary {
		return new Imaginary(this.coeff.minus(x.coeff));
	}
	times(x: Imaginary | Fraction): Fraction | Imaginary {
		return x instanceof Fraction ? new Imaginary(this.coeff.times(x)) : this.coeff.times(x.coeff).times(-1);
	}

	pow(n: number): Fraction | Imaginary {
		if (!Number.isInteger(n) || n < 0) {
			throw new Error('Exponent must be a non-negative integer');
		}
		let result: Fraction | Imaginary = new Fraction(1);
		for (let i = 0; i < n; i++) {
			result = this.times(result);
		}
		return result;
	}
	square(): Fraction {
		return <Fraction>this.times(this);
	}

	clone(): Imaginary {
		return new Imaginary(this.coeff);
	}

	toJSON(): ImaginaryJSON {
		return {
			type: 'imaginary',
			args: [this.coeff.toJSON()],
		};
	}
}

export interface ImaginaryJSON {
	type: 'imaginary';
	args: [FractionJSON];
}
