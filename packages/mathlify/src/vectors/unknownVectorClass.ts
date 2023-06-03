import { Fraction, VariableTerm, BasicTerm, Term, Expression } from '../core/index';

/**
 * An unknown vector represented by k a
 */
export class uVector extends BasicTerm {
	vector: string;
	/**
	 * Creates a new unknown vector
	 * @param coeff the k in k a
	 * @param vector the a in k a
	 */
	constructor(vector: string, coeff: Fraction | number = 1) {
		// bold face if not already
		vector = vector.slice(0, 7) === '\\mathbf' ? vector : `\\mathbf{${vector}}`;
		super(coeff, vector);
		this.vector = vector;
	}

	plus(v: uVector | string): uVectorExpression {
		return new uVectorExpression(this, v);
	}
	negative(): uVector {
		return new uVector(this.vector, this.coeff.negative());
	}
	minus(v: uVector | string): uVectorExpression {
		v = v instanceof uVector ? v : new uVector(v);
		return new uVectorExpression(this, v.negative());
	}
	/** scalar multiplication */
	multiply(k: number | Fraction): uVector {
		return new uVector(this.vector, this.coeff.times(k));
	}
	/** scalar (dot) product */
	dot(v: uVector | string): Term {
		v = v instanceof uVector ? v : new uVector(v);
		if (this.vector === v.vector) {
			return new Term(this.coeff.times(v.coeff), `\\left| ${this.vector} \\right|^2`);
		}
		const [v1, v2] = [this.vector, v.vector].sort();
		return new Term(this.coeff.times(v.coeff), `${v1} \\cdot ${v2}`);
	}
	/** vector (cross) product */
	cross(v: uVector | string): uVector {
		v = v instanceof uVector ? v : new uVector(v);
		if (this.vector === v.vector) {
			return new uVector(this.vector, 0);
		}
		const [v1, v2] = [this.vector, v.vector].sort();
		const coeff = v1 === this.vector ? this.coeff.times(v.coeff) : this.coeff.times(v.coeff).negative();
		return new uVector(`${v1} \\times ${v2}`, coeff);
	}

	clone(): uVector {
		return new uVector(this.vector, this.coeff);
	}
}

export class uVectorExpression {
	vectors: uVector[];

	constructor(...args: (string | uVector)[]) {
		const terms = args.map((term) => {
			if (typeof term === 'string') {
				return new uVector(term);
			}
			return term.clone();
		});
		// combine like terms and remove zero terms
		this.vectors = combineLikeVectors(terms).filter((term) => !term.coeff.isEqualTo(0));
	}

	plus(v: string | uVector | uVectorExpression): uVectorExpression {
		if (typeof v === 'string' || v instanceof uVector) {
			return new uVectorExpression(...this.vectors, v);
		}
		return new uVectorExpression(...this.vectors, ...v.vectors);
	}
	negative(): uVectorExpression {
		return new uVectorExpression(...this.vectors.map((vector) => vector.negative()));
	}
	minus(v: string | uVector | uVectorExpression): uVectorExpression {
		if (typeof v === 'string') {
			v = new uVector(v);
		}
		if (v instanceof uVector) {
			return new uVectorExpression(...this.vectors, v.negative());
		}
		return new uVectorExpression(...this.vectors, ...v.negative().vectors);
	}
	/** scalar multiplication */
	multiply(k: number | Fraction) {
		return new uVectorExpression(...this.vectors.map((vector) => vector.multiply(k)));
	}
	/** scalar (dot) product */
	dot(v: string | uVector | uVectorExpression): Expression {
		if (!(v instanceof uVectorExpression)) {
			const vectors = this.vectors.map((vector) => vector.dot(v));
			return new Expression(...vectors);
		}
		return v.vectors.reduce((exp, term) => exp.plus(this.dot(term)), new Expression(0));
	}
	/** vector (cross) product */
	cross(v: string | uVector | uVectorExpression): uVectorExpression {
		if (!(v instanceof uVectorExpression)) {
			const vectors = this.vectors.map((vector) => vector.cross(v));
			return new uVectorExpression(...vectors);
		}
		return v.vectors.reduce((exp, term) => exp.plus(this.cross(term)), new uVectorExpression(new uVector('a', 0)));
	}

	/**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the vectors
	 */
	toString(): string {
		if (this.vectors.length === 0) {
			return '0';
		}
		let outputString = '';
		this.vectors.forEach((vector, i) => {
			if (i !== 0) {
				outputString += vector.coeff.isGreaterThan(0) ? ' + ' : ' ';
			}
			outputString += vector.toString();
		});
		return outputString;
	}

	clone(): uVectorExpression {
		return new uVectorExpression(...this.vectors.map((vector) => vector.clone()));
	}
}

/**
 * An unknown vector represented by k a, where k can potentially be unknown
 */
export class uxVector {
	coeff: Term;
	vector: string;
	/**
	 * Creates a new unknown vector
	 * @param coeff the k in k a
	 * @param vector the a in k a
	 */
	constructor(vector: string, coeff: Fraction | number | string | Term = 1) {
		// bold face if not already
		vector = vector.slice(0, 7) === '\\mathbf' ? vector : `\\mathbf{${vector}}`;
		if (coeff instanceof Term) {
			this.coeff = coeff.clone();
		} else {
			this.coeff = new Term(coeff);
		}
		this.vector = vector;
	}

	plus(v: uVector | string | uxVector): uxVectorExpression {
		return new uxVectorExpression(this, v);
	}
	negative(): uxVector {
		return new uxVector(this.vector, this.coeff.negative());
	}
	minus(v: uVector | string | uxVector): uxVectorExpression {
		v = typeof v === 'string' ? new uxVector(v) : v;
		return new uxVectorExpression(this, v.negative());
	}
	/** scalar multiplication */
	multiply(k: number | Fraction): uxVector {
		return new uxVector(this.vector, this.coeff.times(k));
	}
	/** scalar (dot) product */
	dot(v: uVector | string | uxVector): Term {
		v = typeof v === 'string' ? new uxVector(v) : v;
		if (this.vector === v.vector) {
			return new Term(1, `\\left| ${this.vector} \\right|^2`).times(this.coeff).times(v.coeff);
		}
		const [v1, v2] = [this.vector, v.vector].sort();
		return new Term(1, `\\mathbf{${v1}} \\cdot \\mathbf{${v2}}`).times(this.coeff).times(v.coeff);
	}
	/** vector (cross) product */
	cross(v: uVector | string | uxVector): uxVector {
		v = typeof v === 'string' ? new uVector(v) : v;
		if (this.vector === v.vector) {
			return new uxVector(this.vector, 0);
		}
		const [v1, v2] = [this.vector, v.vector].sort();
		return this.vector === v1
			? new uxVector(`\\mathbf{${v1}} \\times \\mathbf{${v2}}`, this.coeff.times(v.coeff))
			: new uxVector(`\\mathbf{${v1}} \\times \\mathbf{${v2}}`, this.coeff.times(v.coeff).negative());
	}
	/** sub in unknown into the coefficient term */
	subIn(x: Fraction | number): uVector {
		return new uVector(this.vector, this.coeff.subIn(x));
	}

	clone(): uxVector {
		return new uxVector(this.vector, this.coeff);
	}

	toString(): string {
		if (`${this.coeff}` === `0`) {
			return '\\mathbf{0}';
		} else if (`${this.coeff}` === `1`) {
			return `${this.vector}`;
		} else if (`${this.coeff}` === `- 1`) {
			return `- ${this.vector}`;
		} else {
			return `${this.coeff} ${this.vector}`;
		}
	}
}

export class uxVectorExpression {
	vectors: (uVector | uxVector)[];

	constructor(...args: (string | uVector | uxVector)[]) {
		const terms = args.map((term) => {
			if (typeof term === 'string') {
				return new uVector(term);
			}
			return term.clone();
		});
		// combine like terms and remove zero terms
		this.vectors = combineLikeXVectors(terms).filter((term) => `${term.coeff}` !== '0');
	}

	plus(v: string | uVector | uxVector | uxVectorExpression): uxVectorExpression {
		if (typeof v === 'string' || v instanceof uVector || v instanceof uxVector) {
			return new uxVectorExpression(...this.vectors, v);
		}
		return new uxVectorExpression(...this.vectors, ...v.vectors);
	}
	negative(): uxVectorExpression {
		return new uxVectorExpression(...this.vectors.map((vector) => vector.negative()));
	}
	minus(v: string | uVector | uxVector | uVectorExpression): uxVectorExpression {
		if (typeof v === 'string') {
			v = new uVector(v);
		}
		if (v instanceof uVector || v instanceof uxVector) {
			return new uxVectorExpression(...this.vectors, v.negative());
		}
		return new uxVectorExpression(...this.vectors, ...v.negative().vectors);
	}
	/** scalar multiplication */
	multiply(k: number | Fraction) {
		return new uxVectorExpression(...this.vectors.map((vector) => vector.multiply(k)));
	}
	/** scalar (dot) product */
	dot(v: string | uVector | uxVector | uVectorExpression): Expression {
		if (!(v instanceof uxVectorExpression)) {
			const terms: Term[] = [];
			this.vectors.forEach((vector, i) => {
				if (vector instanceof uxVector) {
					terms.push(vector.dot(<string | uVector | uxVector>v));
				} else if (v instanceof uxVector) {
					terms.push(v.dot(vector));
				} else {
					terms.push(vector.dot(<string | uVector>v));
				}
			});
			return new Expression(...terms);
		}
		return v.vectors.reduce((exp, term) => exp.plus(this.dot(term)), new Expression(0));
	}
	/** vector (cross) product */
	cross(v: string | uVector | uxVector | uVectorExpression | uxVectorExpression): uxVectorExpression {
		if (!(v instanceof uVectorExpression) && !(v instanceof uxVectorExpression)) {
			const vectors: (uVector | uxVector)[] = [];
			this.vectors.forEach((vector, i) => {
				if (vector instanceof uxVector) {
					vectors.push(vector.cross(<string | uVector | uxVector>v));
				} else if (v instanceof uxVector) {
					vectors.push(v.cross(vector));
				} else {
					vectors.push(vector.cross(<string | uVector>v));
				}
			});
			return new uxVectorExpression(...vectors);
		}
		return (<uxVector[]>v.vectors).reduce(
			(exp, term) => exp.plus(this.cross(term)),
			new uxVectorExpression(new uxVector('a', 0)),
		);
	}

	/**
	 * `toString` method
	 *
	 * @returns the LaTeX string representation of the sum of all the vectors
	 */
	toString(): string {
		if (this.vectors.length === 0) {
			return '\\mathbf{0}';
		}
		let outputString = '';
		this.vectors.forEach((vector, i) => {
			if (i !== 0) {
				outputString += `${vector.coeff}`[0] === '-' ? ' ' : ' + ';
			}
			outputString += vector.toString();
		});
		return outputString;
	}

	clone(): uxVectorExpression {
		return new uxVectorExpression(...this.vectors.map((vector) => vector.clone()));
	}
}

function combineLikeVectors(vectors: uVector[]): uVector[] {
	const variableArray: string[] = [],
		newTerms: uVector[] = [];
	vectors.forEach((term) => {
		const variableIndex = variableArray.indexOf(term.variableString);
		if (variableIndex === -1) {
			// new term type
			variableArray.push(term.variableString);
			newTerms.push(term.clone());
		} else {
			// combine like terms
			newTerms[variableIndex] = new uVector(term.vector, newTerms[variableIndex].coeff.plus(term.coeff));
		}
	});
	return newTerms;
}

function combineLikeXVectors(vectors: (uVector | uxVector)[]): (uxVector | uVector)[] {
	const variableArray: string[] = [],
		newTerms: (uVector | uxVector)[] = [];
	vectors.forEach((term) => {
		const variableIndex = variableArray.indexOf(term.vector);
		if (variableIndex === -1) {
			// new term type
			variableArray.push(term.vector);
			newTerms.push(term.clone());
		} else {
			// combine like terms if applicable
			const coeff1 = newTerms[variableIndex].coeff;
			const coeff2 = term.coeff;
			let newCoeff: Term | Fraction | Expression;
			if (coeff1 instanceof Fraction && coeff2 instanceof Fraction) {
				newCoeff = coeff2.plus(coeff1);
			} else {
				newCoeff = new Expression(coeff1, coeff2);
			}
			if (!(newCoeff instanceof Expression)) {
				newTerms[variableIndex] = new uxVector(term.vector, newCoeff);
			} else {
				newTerms.push(term.clone());
			}
		}
	});
	return newTerms;
}
