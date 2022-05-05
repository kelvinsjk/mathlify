import { Term } from './termClass';
import { Fraction } from '../fractionClass';
import { Unknown, SquareRoot, Imaginary } from '../basic';

/**
 * Expression class representing the sum of `Terms`
 */
export class Expression {
	/** array of terms making up the expression */
	terms: Term[] = [];

	/**
	 * Creates a new Expression
	 * @param args one or more `Term`s
	 * `number` and `Fraction` types will be transformed into constant terms,
	 *  while `string` type will be transformed into a term with coefficient 1
	 */
	constructor(...args: (Term | Unknown | Fraction | number | string | SquareRoot | Imaginary)[]) {
		const terms = args.map((term) => {
			if (term instanceof Term) {
				return term.clone();
			}
			return new Term(term);
		});
		// combine like terms and remove zero terms
		this.terms = combineLikeTerms(terms).filter((term) => !term.coeff.isEqualTo(0));
	}

	/**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the terms
	 */
	toString(): string {
		if (this.terms.length === 0) {
			return '0';
		}
		let outputString = '';
		this.terms.forEach((term, i) => {
			if (i !== 0) {
				outputString += term.coeff.isGreaterThan(0) ? ' + ' : ' ';
			}
			outputString += term.toString();
		});
		return outputString;
	}

	/**
	 * toJSON method that allows for quick reconstruction of class instance
	 * by storing its constructor arguments
	 */
	toJSON(): { type: string; args: any[] } {
		return {
			type: 'expression',
			args: this.terms,
		};
	}

	/**
	 * performs scalar multiplication on each term of this
	 */
	times(k: number | Fraction | string | Unknown | SquareRoot | Imaginary | Term | Expression): Expression {
		if (!(k instanceof Expression)) {
			const terms = this.terms.map((term) => term.times(k));
			return new Expression(...terms);
		}
		return k.terms.reduce((exp, term) => exp.plus(this.times(term)), new Expression(0));
	}

	negative(): Expression {
		return new Expression(...this.terms.map((term) => term.negative()));
	}

	pow(n: number): Expression {
		if (!Number.isInteger(n) || n < 0) {
			throw new Error('Exponent must be a non-negative integer');
		}
		let exp = new Expression(1);
		for (let i = 0; i < n; i++) {
			exp = exp.times(this);
		}
		return exp;
	}

	square(): Expression {
		return this.pow(2);
	}

	subIn(x: number | Fraction): Fraction {
		return this.terms.reduce((sum, term) => sum.plus(term.subIn(x)), new Fraction(0));
	}

	/**
	 * adds the two expressions,
	 * similar to concatenating the terms in the two expressions, combining like terms
	 *
	 * @returns the sum
	 */
	plus(newExpression: number | Fraction | string | Unknown | SquareRoot | Imaginary | Term | Expression): Expression {
		return newExpression instanceof Expression
			? new Expression(...this.terms, ...newExpression.terms)
			: new Expression(...this.terms, newExpression);
	}

	/**
	 * subtracts this expression by the given expression
	 *
	 * @returns the difference
	 */
	minus(newExpression: number | Fraction | string | Unknown | SquareRoot | Imaginary | Term | Expression): Expression {
		if (!(newExpression instanceof Expression)) {
			newExpression = new Expression(newExpression);
		}
		return this.plus(newExpression.times(-1));
	}

	/**
	 * clones the object, creating a new instance of this expression
	 */
	clone(): Expression {
		const newTerms = this.terms.map((term) => term.clone());
		return new Expression(...newTerms);
	}
}

function combineLikeTerms(terms: Term[]): Term[] {
	const variableArray: string[] = [],
		newTerms: Term[] = [];
	terms.forEach((term) => {
		const variableIndex = variableArray.indexOf(term.variable);
		if (variableIndex === -1) {
			// new term type
			variableArray.push(term.variable);
			newTerms.push(term.clone());
		} else {
			// combine like terms
			newTerms[variableIndex] = <Term>newTerms[variableIndex].plus(term);
		}
	});
	return newTerms;
}
