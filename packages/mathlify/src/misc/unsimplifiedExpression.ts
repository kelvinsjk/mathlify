import { Term, Fraction, VariableTerm, SquareRoot, Imaginary, Expression, numberToFraction } from '../core';

/**
 * returns an unsimplified expression string
 */
export class UnsimplifiedExpression {
	terms: (Term | VariableTerm | Fraction | number | string | SquareRoot | Imaginary)[];

	constructor(...args: (Term | VariableTerm | Fraction | number | string | SquareRoot | Imaginary)[]) {
		this.terms = args;
	}

	simplify(): Expression {
		return new Expression(...this.terms);
	}

	toString(): string {
		if (this.terms.length === 0) {
			return '0';
		}
		let outputString = '';
		this.terms.forEach((term, i) => {
			if (typeof term === 'string' || typeof term === 'number' || term instanceof Fraction) {
				term = new Term(term);
			}
			if (i !== 0) {
				outputString += term.coeff.isAtLeast(0) ? ' + ' : ' ';
			}
			outputString += term.toString();
		});
		return outputString;
	}

	clone(): UnsimplifiedExpression {
		const newTerms = this.terms.map((x) => {
			if (typeof x === 'string' || typeof x === 'number') {
				return x;
			} else {
				return x.clone();
			}
		});
		return new UnsimplifiedExpression(...newTerms);
	}
}

/**
 * representation of k(ax+...+by) where k is a Fraction and ax+...+by is an Expression
 */
export class BracketedTerm extends Term {
	innerExpression: Expression | UnsimplifiedExpression;
	/**
	 * Creates a new BracketedTerm
	 * representing k(ax+...+by)
	 */
	constructor(
		coeff: number | Fraction,
		innerExpression: UnsimplifiedExpression | Expression | Term | Fraction | number | string,
	) {
		if (!(innerExpression instanceof Expression) && !(innerExpression instanceof UnsimplifiedExpression)) {
			innerExpression = new Expression(innerExpression);
		}
		coeff = numberToFraction(coeff);
		const variableString = coeff.isEqualTo(1) ? `${innerExpression}` : `(${innerExpression})`;
		super(coeff, variableString);
		this.innerExpression = innerExpression.clone();
	}

	/**
	 * if innerExpression is a WorkingExpression, simplify it
	 */
	simplifyInnerExpression(): BracketedTerm {
		if (this.innerExpression instanceof UnsimplifiedExpression) {
			return new BracketedTerm(this.coeff, this.innerExpression.simplify());
		}
		return this.clone();
	}

	/**
	 * multiplies k in, returning the expanded expression
	 */
	simplify(): Expression {
		const innerExpression =
			this.innerExpression instanceof UnsimplifiedExpression ? this.innerExpression.simplify() : this.innerExpression;
		return innerExpression.times(this.coeff);
	}

	clone(): BracketedTerm {
		return new BracketedTerm(this.coeff.clone(), this.innerExpression.clone());
	}
}
