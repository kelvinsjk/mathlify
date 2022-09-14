import { Fraction, VariableTerm, Term, Expression, numberToFraction } from '../core/index';
import { Vector } from './vectorClass';

/**
 * "Extended" Vector class representing a 3D vector coeff(x i + y j + z k),
 * where x,y and z can be Expressions
 */
export class xVector {
	x: Expression;
	y: Expression;
	z: Expression;
	coeff: Fraction;
	/**
	 * creates a new Vector instance
	 *
	 * @param options defaults to `{coeff: 1, simplify: false, stretchable: false}`
	 *  if `simplify` is `true`, then we will factorize our expression such that
	 *  x,y,z are integers with gcd 1.
	 *  if `stretchable` is set to true, then we will `simplify` and then
	 *  set `coeff` to be 1
	 *
	 */
	constructor(
		x: number | Fraction | string | VariableTerm | Term | Expression,
		y?: number | Fraction | string | VariableTerm | Term | Expression,
		z?: number | Fraction | string | VariableTerm | Term | Expression,
		options?: { coeff?: number | Fraction },
	) {
		x = toExpression(x);
		y = y === undefined ? toExpression(0) : toExpression(y);
		z = z === undefined ? toExpression(0) : toExpression(z);
		let { coeff } = {
			coeff: 1,
			...options,
		};
		coeff = numberToFraction(coeff);
		this.x = coeff.isEqualTo(0) ? toExpression(0) : x;
		this.y = coeff.isEqualTo(0) ? toExpression(0) : y;
		this.z = coeff.isEqualTo(0) ? toExpression(0) : z;
		this.coeff = coeff.isEqualTo(0) ? Fraction.ONE : coeff;
	}

	/**
	 * Expands the coeff, taking this k(x,y,z) and
	 * returning (kx, ky, kz)
	 */
	expand(): xVector {
		return new xVector(this.x.times(this.coeff), this.y.times(this.coeff), this.z.times(this.coeff));
	}

	/**
	 * @returns the dot product
	 */
	dot(v2: xVector | Vector): Expression {
		const x = this.x.times(v2.x);

		return this.x.times(v2.x).plus(this.y.times(v2.y)).plus(this.z.times(v2.z)).times(this.coeff).times(v2.coeff);
	}

	/**
	 * @returns the magnitude squared of this vector
	 */
	magnitudeSquare(): Expression {
		return this.dot(this);
	}

	/**
	 * @returns if the vector is a zero vector
	 */
	isZero(): boolean {
		return `${this.magnitudeSquare()}` === '0';
	}

	/**
	 * vector addition
	 *
	 * if the coeffs are the same, will retain the same coeff
	 *
	 * if the coeffs are different, will expand them in before performing addition
	 */
	plus(v2: xVector | Vector): xVector {
		if (this.coeff.isEqualTo(v2.coeff)) {
			return new xVector(this.x.plus(v2.x), this.y.plus(v2.y), this.z.plus(v2.z));
		} else {
			return this.expand().plus(v2.expand());
		}
	}

	/**
	 * returns the negative of this vector
	 *
	 * @param options default to `{multiplyIntoCoeff: false}`
	 * the coeff stays the same while the components are made negative
	 * if false, the coeff is made negative instead
	 */
	negative(options = { multiplyIntoCoeff: false }): xVector {
		return options.multiplyIntoCoeff
			? new xVector(this.x, this.y, this.z, { coeff: this.coeff.negative() })
			: new xVector(this.x.negative(), this.y.negative(), this.z.negative(), { coeff: this.coeff });
	}

	/**
	 * vector subtraction
	 */
	minus(v2: xVector | Vector): xVector {
		return this.plus(v2.negative());
	}

	/**
	 * scalar multiplication
	 *
	 * by default, the coeff stays the same while the components are multiplied
	 * if false, the coeff is multiplied instead
	 *
	 * @param options defaults to `{multiplyIntoCoeff: false}`
	 */
	multiply(k: number | Fraction, options = { multiplyIntoCoeff: false }): xVector {
		return options.multiplyIntoCoeff
			? new xVector(this.x, this.y, this.z, { coeff: this.coeff.times(k) })
			: new xVector(this.x.times(k), this.y.times(k), this.z.times(k), { coeff: this.coeff });
	}

	/**
	 * @returns the cross product (this cross v2)
	 */
	cross(v2: xVector | Vector): xVector {
		const coeff = this.coeff.times(v2.coeff);
		const x = this.y.times(v2.z).minus(this.z.times(v2.y));
		const y = this.z.times(v2.x).minus(this.x.times(v2.z));
		const z = this.x.times(v2.y).minus(this.y.times(v2.x));
		return new xVector(x, y, z, { coeff });
	}

	/**
	 * checks if this is perpendicular to v2
	 */
	isPerpendicularTo(v2: xVector | Vector): boolean {
		return `${this.dot(v2)}` === '0';
	}

	/**
	 * checks if this is parallel to v2
	 */
	isParallelTo(v2: xVector | Vector): boolean {
		return this.cross(v2).isZero();
	}

	subIn(x: Fraction): Vector {
		return new Vector(this.x.subIn(x), this.y.subIn(x), this.z.subIn(x), { coeff: this.coeff });
	}

	/**
	 * @returns latex string representing the vector in column vector form
	 */
	toString(): string {
		if (this.isZero()) {
			return `\\begin{pmatrix}\n\t0 \\\\\n\t0 \\\\\n\t0\n\\end{pmatrix}`;
		}
		const columnVector = `\\begin{pmatrix}\n\t${this.x} \\\\\n\t${this.y} \\\\\n\t${this.z}\n\\end{pmatrix}`;
		const term = new Term(this.coeff, columnVector);
		return `${term}`;
	}

	toCartesianString(): string {
		const xTerm = this.x.times('x');
		const yTerm = this.y.times('y');
		const zTerm = this.z.times('z');
		const cartesianExpression = xTerm.plus(yTerm).plus(zTerm);
		return `${cartesianExpression}`;
	}

	/**
	 * @returns (kx, ky, kz) as a coordinate triple.
	 *
	 * @param name The name of the point which is attached to the front of the coordinates
	 */
	toCoordinates(name = ''): string {
		const v = this.expand();
		return `${name}\\left( ${v.x}, ${v.y}, ${v.z} \\right)`;
	}

	/**
	 * checks if two vectors are equal
	 */
	isEqualTo(v2: xVector | Vector): boolean {
		return `${this.minus(v2).magnitudeSquare()}` === '0';
	}

	/**
	 * clones a new instance of this vector
	 */
	clone(): xVector {
		return new xVector(this.x, this.y, this.z, { coeff: this.coeff });
	}

	////
	// static properties
	////

	/**
	 * the zero vector
	 */
	static ZERO = new xVector(0);
	/**
	 * the x-axis unit vector (1,0,0)
	 */
	static I = new xVector(1);
	/**
	 * the y-axis unit vector (0,1,0)
	 */
	static J = new xVector(0, 1);
	/**
	 * the z-axis unit vector (0,0,1)
	 */
	static K = new xVector(0, 0, 1);
}

function toExpression(x: number | Fraction | string | VariableTerm | Term | Expression): Expression {
	if (typeof x === 'number' || x instanceof Fraction || x instanceof VariableTerm || typeof x === 'string') {
		return new Expression(new Term(x));
	}
	return x instanceof Term ? new Expression(x) : x.clone();
}
