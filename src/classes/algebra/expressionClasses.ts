import { Term, xTerm } from './termClasses';
import { Fraction } from '../fractionClass';

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
	constructor(...args: (Term | Fraction | number | string)[]) {
		const terms = args.map((term) => {
			if (typeof term === 'string') {
				return new Term(1, term);
			} else if (typeof term === 'number' || term instanceof Fraction) {
				return new Term(term);
			} else {
				return term.clone();
			}
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
	 * performs scalar multiplication on each term of this
	 */
	multiply(k: number | Fraction): Expression {
		const terms = this.terms.map((term) => new Term(term.coeff.times(k), term.variable));
		return new Expression(...terms);
	}

	/**
	 * adds the two expressions,
	 * similar to concatenating the terms in the two expressions, combining like terms
	 *
	 * @returns the sum
	 */
	add(newExpression: Term | Fraction | number | string | Expression): Expression {
		return newExpression instanceof Expression
			? new Expression(...this.terms, ...newExpression.terms)
			: new Expression(...this.terms, newExpression);
	}

	/**
	 * subtracts this expression by the given expression
	 *
	 * @returns the difference
	 */
	subtract(newExpression: Term | Fraction | number | string | Expression): Expression {
		if (!(newExpression instanceof Expression)) {
			newExpression = new Expression(newExpression);
		}
		return this.add(newExpression.multiply(-1));
	}

	/**
	 * clones the object, creating a new instance of this expression
	 */
	clone(): Expression {
		const newTerms = this.terms.map((term) => term.clone());
		return new Expression(...newTerms);
	}
}

/**
 * Expression class representing the sum of `Terms`
 */
export class xExpression extends Expression {
	/** array of terms making up the expression */
	xTerms: xTerm[] = [];

	/**
	 * Creates a new Expression
	 * @param args one or more `Term`s
	 * `number` and `Fraction` types will be transformed into constant terms,
	 *  while `string` type will be transformed into a term with coefficient 1
	 */
	constructor(...args: (xTerm | Fraction | number | string)[]) {
		const terms = args.map((term) => {
			if (typeof term === 'string') {
				return new xTerm(1, term);
			} else if (typeof term === 'number' || term instanceof Fraction) {
				return new xTerm(term, '');
			} else {
				return term.clone();
			}
		});
		// combine like terms and remove zero terms
		const xTerms = combineLikeXTerms(terms).filter((term) => !term.coeff.isEqualTo(0));
		super(...xTerms);
		this.xTerms = xTerms;
	}

	/**
	 * performs scalar multiplication on each term of this
	 */
	multiply(k: number | Fraction): xExpression {
		const terms = this.terms.map((term) => new xTerm(term.coeff.times(k), term.variable));
		return new xExpression(...terms);
	}

	/**
	 * adds the two expressions,
	 * similar to concatenating the terms in the two expressions, combining like terms
	 *
	 * @returns the sum
	 */
	add(newExpression: xTerm | Fraction | number | string | xExpression): xExpression {
		return newExpression instanceof xExpression
			? new xExpression(...this.xTerms, ...newExpression.xTerms)
			: new xExpression(...this.xTerms, newExpression);
	}

	/**
	 * subtracts this expression by the given expression
	 *
	 * @returns the difference
	 */
	subtract(newExpression: xTerm | Fraction | number | string | xExpression): xExpression {
		if (!(newExpression instanceof xExpression)) {
			newExpression = new xExpression(newExpression);
		}
		return this.add(newExpression.multiply(-1));
	}

	/**
	 * clones the object, creating a new instance of this expression
	 */
	clone(): xExpression {
		const newTerms = this.xTerms.map((term) => term.clone());
		return new xExpression(...newTerms);
	}

	/**
	 * substitute "x" into this Expression
	 * @param x number/Fraction to substitute into the term
	 */
	subXAs(x: number | Fraction): Fraction | undefined {
		let sum = Fraction.ZERO;
		for (let i = 0; i < this.xTerms.length; i++) {
			const fx = this.xTerms[i].subXAs(x);
			if (fx === undefined) {
				return undefined;
			}
			sum = sum.plus(fx);
		}
		return sum;
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
			newTerms[variableIndex] = new Term(newTerms[variableIndex].coeff.plus(term.coeff), term.variable);
		}
	});
	return newTerms;
}

function combineLikeXTerms(terms: xTerm[]): xTerm[] {
	const variableArray: string[] = [],
		newTerms: xTerm[] = [];
	terms.forEach((term) => {
		const variableIndex = variableArray.indexOf(term.variable);
		if (variableIndex === -1) {
			// new term type
			variableArray.push(term.variable);
			newTerms.push(term.clone());
		} else {
			// combine like terms
			newTerms[variableIndex] = new xTerm(newTerms[variableIndex].coeff.plus(term.coeff), term.variable, term.f);
		}
	});
	return newTerms;
}
