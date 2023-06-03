import { Term } from './term';
import { Fraction } from '../fractionClass';
import {
	VariableTerm,
	//SquareRoot,
	Imaginary,
} from '../basic';
import { SquareRoot } from './sqrt';

/**
 * Expression class representing the sum of `Terms`
 */
export class Expression {
	kind: string;
	/** array of terms making up the expression */
	terms: Term[] = [];

	/**
	 * Creates a new Expression
	 * @param args one or more `Term`s
	 * `number` and `Fraction` types will be transformed into constant terms,
	 *  while `string` type will be transformed into a term with coefficient 1
	 */
	constructor(
		...args: (number | Fraction | string | [string, number | Fraction] | SquareRoot | Term | ExpressionOptions)[]
	) {
		let terms: Term[] = [];
		let kind = 'expression';
		args.forEach((x) => {
			if (typeof x === 'object' && 'expressionKind' in x) {
				kind = x.expressionKind;
			} else {
				const xTerm = x instanceof Term || x instanceof SquareRoot ? x : new Term(x);
				const i = terms.findIndex((y) => y.isLike(xTerm));
				if (i === -1) {
					terms.push(xTerm);
				} else {
					terms = [...terms.slice(0, i), terms[i].plus(xTerm), ...terms.slice(i + 1)];
				}
			}
		});
		this.terms = terms.filter((x) => !x.coeff.isEqualTo(0));
		this.kind = kind;
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
		let outputString = this.terms[0].toString();
		this.terms.slice(1).forEach((term) => {
			outputString += term.coeff.isGreaterThan(0) ? ` + ${term}` : ` ${term}`;
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
	times(k: number | Fraction | string | SquareRoot | Term | Expression): Expression {
		if (!(k instanceof Expression)) {
			const terms = this.terms.map((term) => term.times(k));
			return new Expression(...terms);
		}
		return k.terms.reduce((exp, term) => exp.plus(this.times(term)), new Expression(0));
	}

	divide(x: number | Fraction | string | SquareRoot | Term | Expression): Expression {
		if (x instanceof Expression) {
			throw new RangeError(`division by Expression not supported at the moment`);
		}
		return new Expression(...this.terms.map((y) => y.divide(x)));
	}

	/** applies negative to square root and imaginary terms */
	//conjugate(): Expression {
	//	const terms = this.terms.map((term) => term.conjugate());
	//	return new Expression(...terms);
	//}

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

	subInNumber(x: number): number {
		return this.terms.reduce((sum, term) => sum + term.subInNumber(x), 0);
	}

	valueOf(): number {
		return this.terms.reduce((sum, term) => sum + term.valueOf(), 0);
	}

	/**
	 * adds the two expressions,
	 * similar to concatenating the terms in the two expressions, combining like terms
	 *
	 * @returns the sum
	 */
	plus(newExpression: number | Fraction | string | SquareRoot | Term | Expression): Expression {
		return newExpression instanceof Expression
			? new Expression(...this.terms, ...newExpression.terms)
			: new Expression(...this.terms, newExpression);
	}

	/**
	 * subtracts this expression by the given expression
	 *
	 * @returns the difference
	 */
	minus(newExpression: number | Fraction | string | SquareRoot | Term | Expression): Expression {
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

export interface ExpressionOptions {
	expressionKind: string;
}
