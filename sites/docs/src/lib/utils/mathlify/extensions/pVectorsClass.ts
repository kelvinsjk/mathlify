import { Polynomial, Fraction, Vector, toFraction } from 'mathlify';

/**
 * Vector class representing a 3D vector coeff(x i + y j + z k)
 * where x,y,z are polynomials
 */
export class pVector {
	x: Polynomial;
	y: Polynomial;
	z: Polynomial;
	variableAtom: string;
	/**
	 * creates a new Vector instance
	 *
	 * @param x the polynomial/array to reconstruct the polynomial
	 * @param options for constructing the polynomial {variableAtom: 'a', ascending: false, degree?}
	 */
	constructor(
		x: number | Fraction | Polynomial | number[] | Fraction[],
		y: number | Fraction | Polynomial | number[] | Fraction[],
		z: number | Fraction | Polynomial | number[] | Fraction[],
		options?: { variableAtom?: string; ascending?: boolean; degree?: number },
	) {
		options = {
			variableAtom: 'a',
			ascending: false,
			...options,
		};
		if (x instanceof Polynomial) {
			this.variableAtom = x.variableAtom;
		} else if (y instanceof Polynomial) {
			this.variableAtom = y.variableAtom;
		} else if (z instanceof Polynomial) {
			this.variableAtom = z.variableAtom;
		} else {
			this.variableAtom = options.variableAtom;
		}
		this.x = generatePolynomial(
			x,
			<{ variableAtom: string; ascending: boolean; degree?: number }>options,
		);
		this.y = generatePolynomial(
			y,
			<{ variableAtom: string; ascending: boolean; degree?: number }>options,
		);
		this.z = generatePolynomial(
			z,
			<{ variableAtom: string; ascending: boolean; degree?: number }>options,
		);
	}

	/**
	 * @returns the dot product
	 */
	dot(v2: pVector): Polynomial {
		return this.x.times(v2.x).plus(this.y.times(v2.y)).plus(this.z.times(v2.z));
	}

	/**
	 * @returns the magnitude squared of this vector
	 */
	magnitudeSquare(): Polynomial {
		return this.dot(this);
	}

	///**
	// * @returns if the vector is a zero vector
	// */
	//isZero(): boolean {
	//	return this.magnitudeSquare().isEqualTo(0);
	//}

	/**
	 * vector addition
	 *
	 * if the coeffs are the same, will retain the same coeff
	 *
	 * if the coeffs are different, will expand them in before performing addition
	 */
	plus(v2: pVector): pVector {
		return new pVector(this.x.plus(v2.x), this.y.plus(v2.y), this.z.plus(v2.z), {
			variableAtom: this.variableAtom,
		});
	}

	/**
	 * returns the negative of this vector
	 *
	 * @param options default to `{multiplyIntoCoeff: false}`
	 * the coeff stays the same while the components are made negative
	 * if false, the coeff is made negative instead
	 */
	negative(): pVector {
		return new pVector(this.x.times(-1), this.y.times(-1), this.z.times(-1), {
			variableAtom: this.variableAtom,
		});
	}

	/**
	 * vector subtraction
	 */
	minus(v2: pVector): pVector {
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
	times(k: number | Fraction): pVector {
		return new pVector(this.x.times(k), this.y.times(k), this.z.times(k), {
			variableAtom: this.variableAtom,
		});
	}

	/**
	 * division by a scalar
	 */
	divide(k: number | Fraction): pVector {
		return new pVector(this.x.divide(k), this.y.divide(k), this.z.divide(k), {
			variableAtom: this.variableAtom,
		});
	}

	/**
	 * @returns the cross product (this cross v2)
	 */
	cross(v2: pVector): pVector {
		const x = this.y.times(v2.z).minus(this.z.times(v2.y));
		const y = this.z.times(v2.x).minus(this.x.times(v2.z));
		const z = this.x.times(v2.y).minus(this.y.times(v2.x));
		return new pVector(x, y, z, { variableAtom: this.variableAtom });
	}

	/**
	 * @returns latex string representing the vector in column vector form
	 */
	toString(): string {
		return `\\begin{pmatrix}\n\t${this.x} \\\\\n\t${this.y} \\\\\n\t${this.z}\n\\end{pmatrix}`;
	}

	///**
	// * @returns latex string representing the vector in ijk notation
	// */
	//toIJKString(): string {
	//	if (this.isZero()) {
	//		return '\\mathbf{0}';
	//	}
	//	const expression = new Expression(
	//		new Term(this.x, '\\mathbf{i}'),
	//		new Term(this.y, '\\mathbf{j}'),
	//		new Term(this.z, '\\mathbf{k}'),
	//	);
	//	const expressionString = this.coeff.isEqualTo(1)
	//		? `${expression}`
	//		: `\\left( ${expression} \\right)`;
	//	const term = new Term(this.coeff, expressionString);
	//	return `${term}`;
	//}

	/**
	 * @returns (kx, ky, kz) as a coordinate triple.
	 *
	 * @param name The name of the point which is attached to the front of the coordinates
	 */
	toCoordinates(name = ''): string {
		return `${name}\\left( ${this.x}, ${this.y}, ${this.z} \\right)`;
	}

	///**
	// * checks if two vectors are equal
	// */
	//isEqualTo(v2: Vector): boolean {
	//	return this.minus(v2).magnitudeSquare().isEqualTo(0);
	//}

	/**
	 * clones a new instance of this vector
	 */
	clone(): pVector {
		return new pVector(this.x, this.y, this.z, { variableAtom: this.variableAtom });
	}

	/**
	 * substitutes the value of x into the polynomials to get a regular vector
	 */
	subXAs(x: number | Fraction): Vector {
		return new Vector(this.x.subXAs(x), this.y.subXAs(x), this.z.subXAs(x));
	}

	////
	// static properties
	////

	/**
	 * the zero vector
	 */
	static ZERO = new pVector(0, 0, 0);
	/**
	// * the x-axis unit vector (1,0,0)
	// */
	//static I = new Vector(1);
	///**
	// * the y-axis unit vector (0,1,0)
	// */
	//static J = new Vector(0, 1);
	///**
	// * the z-axis unit vector (0,0,1)
	// */
	//static K = new Vector(0, 0, 1);
}

function generatePolynomial(
	x: number | Fraction | Polynomial | number[] | Fraction[],
	options: { variableAtom: string; ascending: boolean; degree?: number },
): Polynomial {
	if (x instanceof Polynomial) {
		return x.clone();
	}
	if (typeof x === 'number') {
		x = toFraction(x);
	}
	if (x instanceof Fraction) {
		return new Polynomial([x], options);
	}
	return new Polynomial(x, options);
}
