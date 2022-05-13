import { Expression, Term, SquareRoot, Fraction, numberToFraction } from '../core';
import { FractionJSON } from '../core/fractionClass';

/**
 * Vector class representing a 3D vector coeff(x i + y j + z k)
 */
export class Vector {
	x: Fraction;
	y: Fraction;
	z: Fraction;
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
		x: number | Fraction,
		y?: number | Fraction,
		z?: number | Fraction,
		options?: { coeff?: number | Fraction; simplify?: boolean; stretchable?: boolean },
	) {
		x = numberToFraction(x);
		y = y === undefined ? Fraction.ZERO : numberToFraction(y);
		z = z === undefined ? Fraction.ZERO : numberToFraction(z);
		let { coeff, simplify, stretchable } = {
			coeff: Fraction.ONE,
			simplify: false,
			stretchable: false,
			...options,
		};
		coeff = numberToFraction(coeff);
		if (stretchable || simplify) {
			[[x, y, z], coeff] = Fraction.factorize(x, y, z);
			coeff = stretchable ? Fraction.ONE : coeff;
		}
		this.x = coeff.isEqualTo(0) ? Fraction.ZERO : x;
		this.y = coeff.isEqualTo(0) ? Fraction.ZERO : y;
		this.z = coeff.isEqualTo(0) ? Fraction.ZERO : z;
		this.coeff = coeff.isEqualTo(0) ? Fraction.ONE : coeff;
	}

	/**
	 * simplifies the current vector to k(a,b,c) by taking
	 * out common factors so that gcd(a,b,c)=1
	 *
	 * @param options defaults to `{stretchable: false}`.
	 * If set to true, will set coeff to 1
	 *
	 * WARING: this method mutates the current instance
	 *
	 * @returns a reference to this vector
	 */
	simplify(options = { stretchable: false }): this {
		const stretchable = options.stretchable;
		if (!this.isZero()) {
			let [[x, y, z], coeff] = Fraction.factorize(this.x, this.y, this.z);
			this.x = x;
			this.y = y;
			this.z = z;
			this.coeff = stretchable ? Fraction.ONE : coeff.times(this.coeff);
		}
		return this;
	}

	/**
	 * Expands the coeff, taking this k(x,y,z) and
	 * returning (kx, ky, kz)
	 */
	expand(): Vector {
		return new Vector(this.coeff.times(this.x), this.coeff.times(this.y), this.coeff.times(this.z));
	}

	/**
	 * @returns the dot product
	 */
	dot(v2: Vector): Fraction {
		return this.coeff.times(v2.coeff).times(this.x.times(v2.x).plus(this.y.times(v2.y)).plus(this.z.times(v2.z)));
	}

	/**
	 * @returns the magnitude squared of this vector
	 */
	magnitudeSquare(): Fraction {
		return this.dot(this);
	}

	/**
	 * @returns the magnitude as a SquareRoot class
	 */
	magnitude(): SquareRoot {
		return new SquareRoot(this.magnitudeSquare());
	}

	/**
	 * @returns if the vector is a zero vector
	 */
	isZero(): boolean {
		return this.magnitudeSquare().isEqualTo(0);
	}

	/**
	 * vector addition
	 *
	 * if the coeffs are the same, will retain the same coeff
	 *
	 * if the coeffs are different, will expand them in before performing addition
	 */
	plus(v2: Vector, options?: { simplify?: boolean; stretchable?: boolean }): Vector {
		if (this.coeff.isEqualTo(v2.coeff)) {
			return new Vector(this.x.plus(v2.x), this.y.plus(v2.y), this.z.plus(v2.z), options);
		} else {
			return this.expand().plus(v2.expand(), options);
		}
	}

	/**
	 * returns the negative of this vector
	 *
	 * @param options default to `{multiplyIntoCoeff: false}`
	 * the coeff stays the same while the components are made negative
	 * if false, the coeff is made negative instead
	 */
	negative(options = { multiplyIntoCoeff: false }): Vector {
		return options.multiplyIntoCoeff
			? new Vector(this.x, this.y, this.z, { coeff: this.coeff.negative() })
			: new Vector(this.x.negative(), this.y.negative(), this.z.negative(), { coeff: this.coeff });
	}

	/**
	 * vector subtraction
	 */
	minus(v2: Vector): Vector {
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
	multiply(k: number | Fraction, options = { multiplyIntoCoeff: false }): Vector {
		return options.multiplyIntoCoeff
			? new Vector(this.x, this.y, this.z, { coeff: this.coeff.times(k) })
			: new Vector(this.x.times(k), this.y.times(k), this.z.times(k), { coeff: this.coeff });
	}
	divide(k: number | Fraction, options = { multiplyIntoCoeff: false }): Vector {
		return options.multiplyIntoCoeff
			? new Vector(this.x, this.y, this.z, { coeff: this.coeff.divide(k) })
			: new Vector(this.x.divide(k), this.y.divide(k), this.z.divide(k), { coeff: this.coeff });
	}

	/**
	 * @returns the cross product (this cross v2)
	 */
	cross(v2: Vector, options?: { simplify?: boolean; stretchable?: boolean }): Vector {
		const coeff = this.coeff.times(v2.coeff);
		const x = this.y.times(v2.z).minus(this.z.times(v2.y));
		const y = this.z.times(v2.x).minus(this.x.times(v2.z));
		const z = this.x.times(v2.y).minus(this.y.times(v2.x));
		return new Vector(x, y, z, { coeff, ...options });
	}

	/**
	 * checks if this is perpendicular to v2
	 */
	isPerpendicularTo(v2: Vector): boolean {
		return this.dot(v2).isEqualTo(0);
	}

	/**
	 * checks if this is parallel to v2
	 */
	isParallelTo(v2: Vector): boolean {
		return this.cross(v2).isZero();
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

	/**
	 * @returns latex string representing the vector in ijk notation
	 */
	toIJKString(): string {
		if (this.isZero()) {
			return '\\mathbf{0}';
		}
		const expression = new Expression(
			new Term(this.x, '\\mathbf{i}'),
			new Term(this.y, '\\mathbf{j}'),
			new Term(this.z, '\\mathbf{k}'),
		);
		const expressionString = this.coeff.isEqualTo(1) ? `${expression}` : `\\left( ${expression} \\right)`;
		const term = new Term(this.coeff, expressionString);
		return `${term}`;
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
	isEqualTo(v2: Vector): boolean {
		return this.minus(v2).magnitudeSquare().isEqualTo(0);
	}

	/**
	 * @returns angle between two vectors as a string in degrees
	 *
	 * @param options default to {acute: false, sineMode: false}
	 */
	angle(v2: Vector, options?: { acute?: boolean; sineMode?: boolean }): string {
		let cosSquare = this.dot(v2).square().divide(this.magnitudeSquare()).divide(v2.magnitudeSquare());
		const { acute, sineMode } = {
			acute: false,
			sineMode: false,
			...options,
		};
		if (cosSquare.isEqualTo(1)) {
			return sineMode ? '90^\\circ' : '0^\\circ';
			//} else if (cosSquare.isEqualTo(new Fraction(3,4))) {
			//	if (sineMode) {
			//		return '60^\\circ'
			//	} else {
			//		return (acute || this.dot(v2).isGreaterThan(0)) ? '30^\\circ' : '150^\\circ';
			//	}
		} else if (cosSquare.isEqualTo(new Fraction(1, 2))) {
			return sineMode || acute || this.dot(v2).isGreaterThan(0) ? '45^\\circ' : '135^\\circ';
			//} else if (cosSquare.isEqualTo(new Fraction(1,4))) {
			//	if (sineMode) {
			//		return '30^\\circ'
			//	} else {
			//		return (acute || this.dot(v2).isGreaterThan(0)) ? '60^\\circ' : '120^\\circ';
			//	}
		} else if (cosSquare.isEqualTo(0)) {
			return sineMode ? '0^\\circ' : '90^\\circ';
		} else {
			const alpha = (Math.acos(Math.sqrt(cosSquare.valueOf())) * 180) / Math.PI;
			if (sineMode) {
				const theta = 90 - alpha;
				return `${theta.toFixed(1)}^\\circ`;
			} else {
				const theta = acute || this.dot(v2).isGreaterThan(0) ? alpha : 180 - alpha;
				return `${theta.toFixed(1)}^\\circ`;
			}
		}
	}

	/**
	 * clones a new instance of this vector
	 */
	clone(): Vector {
		return new Vector(this.x, this.y, this.z, { coeff: this.coeff });
	}

	toJSON(): VectorJSON {
		return {
			type: 'vector',
			args: [this.x.toJSON(), this.y.toJSON(), this.z.toJSON(), { coeff: this.coeff.toJSON() }],
		};
	}

	////
	// static properties
	////

	/**
	 * the zero vector
	 */
	static ZERO = new Vector(0);
	/**
	 * the x-axis unit vector (1,0,0)
	 */
	static I = new Vector(1);
	/**
	 * the y-axis unit vector (0,1,0)
	 */
	static J = new Vector(0, 1);
	/**
	 * the z-axis unit vector (0,0,1)
	 */
	static K = new Vector(0, 0, 1);
}

export interface VectorJSON {
	type: 'vector';
	args: [FractionJSON, FractionJSON, FractionJSON, { coeff: FractionJSON }];
}
