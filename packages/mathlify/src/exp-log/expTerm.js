// import { type Fraction, Term } from '../core';
// import { numberToFraction } from '../utils';

// export class ExpTerm extends Term {
// 	kind: 'expTerm';
// 	coeff: Fraction;
// 	exponent: Fraction;

// 	constructor(exponent: number | Fraction, coeff: number | Fraction = 1) {
// 		// TODO: add lnTerm as exponent
// 		exponent = numberToFraction(exponent);
// 		const expString = exponent.isEqualTo(1)
// 			? `\\mathrm{e}`
// 			: `\\mathrm{e}^{ ${exponent} }`;
// 		if (exponent.isEqualTo(0)) {
// 			super(coeff);
// 		} else {
// 			super(coeff, expString);
// 		}
// 		this.kind = 'expTerm';
// 		this.coeff = numberToFraction(coeff);
// 		this.exponent = exponent;
// 	}

// 	times(x: ExpTerm | number | Fraction): ExpTerm {
// 		if (!(x instanceof ExpTerm)) {
// 			return new ExpTerm(this.exponent, this.coeff.times(x));
// 		}
// 		return new ExpTerm(this.exponent.plus(x.exponent), this.coeff.times(x.coeff));
// 	}

// 	negative(): ExpTerm {
// 		return new ExpTerm(this.exponent, this.coeff.negative());
// 	}

// 	divide(x: ExpTerm): ExpTerm {
// 		return new ExpTerm(this.exponent.minus(x.exponent), this.coeff.divide(x.coeff));
// 	}

// 	pow(n: number | Fraction): ExpTerm {
// 		return new ExpTerm(this.exponent.times(n), this.coeff.pow(n));
// 	}
// }
