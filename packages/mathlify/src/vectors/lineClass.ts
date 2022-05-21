import { Vector } from './vectorClass';
import { type Fraction, type SquareRoot, Polynomial, numberToFraction } from '../core';

/**
 * Line class representing a 3D Line represented in vector form
 * r = a + \lambda d, where a is a point on the line,
 * d is a direction vector parallel to the line,
 * and lambda is the parameter
 */
export class Line {
	a: Vector;
	d: Vector;
	lambda: string;
	/**
	 * creates a new Line instance
	 *
	 * by default, v1 is taken as the point a and v2 the direction vector d
	 *
	 * if options is `{twoPointsMode: true}` (default: false), then v1 and v2
	 * will be taken as two points on the line
	 *
	 * @param lambda string representing the parameter to be used when
	 * typesetting the equation of the line. Defaults to `"\\lambda"`
	 */
	constructor(v1: Vector, v2: Vector, options?: { twoPointsMode?: boolean; lambda?: string }) {
		const { twoPointsMode, lambda } = {
			twoPointsMode: false,
			lambda: '\\lambda',
			...options,
		};
		v2 = twoPointsMode ? v2.minus(v1).simplify({ stretchable: true }) : v2;
		if (v2.isZero()) {
			throw new Error('Cannot create a line with zero vector as direction');
		}
		this.a = v1.expand();
		this.d = v2.clone();
		this.lambda = lambda;
	}

	/**
	 * checks if line contains a point
	 */
	contains(point: Vector): boolean {
		const ab = point.minus(this.a);
		return ab.isZero() || this.d.isParallelTo(ab);
	}

	/**
	 * checks if line is parallel to vector or line
	 */
	isParallelTo(v: Vector | Line): boolean {
		v = v instanceof Line ? v.d : v;
		return this.d.isParallelTo(v);
	}

	/**
	 * checks if two lines are the same
	 */
	isEqualTo(l2: Line): boolean {
		return this.isParallelTo(l2) && this.contains(l2.a);
	}

	/**
	 * subs in the parameter lambda
	 *
	 * @returns the position vector of the resulting point on the line
	 */
	point(lambda: number | Fraction = 0): Vector {
		lambda = numberToFraction(lambda);
		return this.a.plus(this.d.multiply(lambda));
	}

	/**
	 * finds *acute* angle between lines/line and vector
	 *
	 * @returns angle between this line and given vector/line
	 */
	angleTo(v: Vector | Line): string {
		v = v instanceof Line ? v.d : v;
		return this.d.angleTo(v, { acute: true });
	}

	/**
	 * finds distance between this line to a point or a parallel line
	 *
	 * WARNING: does not support skew lines at the moment
	 */
	distanceTo(v: Vector | Line): SquareRoot {
		let ab: Vector;
		if (v instanceof Line) {
			if (!v.isParallelTo(this)) {
				throw new Error('Distance method only supported for parallel lines');
			}
			ab = v.a.minus(this.a);
		} else {
			ab = v.minus(this.a);
		}
		const modABCrossD = ab.cross(this.d).magnitude();
		return modABCrossD.divide(this.d.magnitude());
	}

	/**
	 * finds intersection point between two lines
	 *
	 * @returns the position vector of the point of intersection,
	 * or null if there are no points of intersection,
	 * or a line if the two lines are coincident.
	 *
	 */
	intersect(l2: Line): Vector | null | Line {
		if (this.isParallelTo(l2)) {
			return this.isEqualTo(l2) ? this.clone() : null;
		}
		const intersection = this.intersectParameters(l2);
		if (intersection === null) {
			return null;
		} else {
			const [lambda] = intersection;
			return this.point(lambda);
		}
	}

	/**
	 * @returns [lambda, mu] that corresponds to the intersection of this line and l2
	 * returns null if skew/parallel/coincident lines
	 */
	intersectParameters(l2: Line): null | [Fraction, Fraction] {
		if (this.isParallelTo(l2)) {
			return null;
		}
		// solve for lambda and mu from first two rows
		const [a1, b1, c1, a2, b2, c2] = [
			this.d.x,
			l2.d.x.negative(),
			l2.a.x.minus(this.a.x),
			this.d.y,
			l2.d.y.negative(),
			l2.a.y.minus(this.a.y),
		];
		const det = determinant(a1, b1, a2, b2);
		if (det.isEqualTo(0)) {
			// TODO: check for 1st/3rd row, 2nd/3rd row
			return null;
		}
		const lambda = determinant(c1, b1, c2, b2).divide(det);
		const mu = determinant(a1, c1, a2, c2).divide(det);
		// check if intersecting
		if (this.point(lambda).isEqualTo(l2.point(mu))) {
			// intersecting lines
			return [lambda, mu];
		} else {
			// skew lines
			return null;
		}
	}

	/**
	 * finds the foot of perpendicular from point to this line
	 */
	footOfPerpendicular(point: Vector): Vector {
		const AB = point.minus(this.a);
		const ABDotD = AB.dot(this.d);
		const lambda = ABDotD.divide(this.d.magnitudeSquare());
		const AF = this.d.multiply(lambda);
		return AF.plus(this.a).expand();
	}

	/**
	 * finds the reflection of a point/line about this line
	 */
	reflect(v: Vector | Line): Vector | Line {
		return v instanceof Line ? this.lineReflection(v) : this.pointReflection(v);
	}

	/**
	 * finds the reflection of point about this line
	 */
	pointReflection(point: Vector): Vector {
		const OF = this.footOfPerpendicular(point);
		return OF.multiply(2).minus(point).expand();
	}

	/**
	 * checks if two lines are skew
	 */
	isSkewTo(l2: Line): boolean {
		return !this.isParallelTo(l2) && !this.isEqualTo(l2) && this.intersect(l2) === null;
	}

	/**
	 * finds the reflection of line l2 about this line
	 *
	 * WARNING: throws an error if skew lines encountered
	 */
	lineReflection(l2: Line): Line {
		if (this.isParallelTo(l2)) {
			const OAPrime = this.pointReflection(l2.a);
			return new Line(OAPrime, this.d);
		}
		const OX = this.intersect(l2) as Vector | null;
		if (OX === null) {
			// skew lines
			throw new Error('Cannot find line reflection of skew lines');
		} else {
			// intersecting
			let OA = l2.a;
			if (this.contains(OA)) {
				OA = l2.point(1);
			}
			const OAPrime = this.pointReflection(OA);
			return new Line(OX, OAPrime, { twoPointsMode: true });
		}
	}

	/**
	 * @returns equation of the line r = a + lambda d in column vector form
	 */
	toString(): string {
		return this.a.isZero()
			? `\\mathbf{r} = ${this.lambda} ${this.d}`
			: `\\mathbf{r} = ${this.a} + ${this.lambda} ${this.d}`;
	}

	/**
	 * @returns equation of the line r = a + lambda d in ijk form
	 */
	toIJKString(): string {
		return this.a.isZero()
			? `\\mathbf{r} = ${this.lambda} \\left( ${this.d.toIJKString()} \\right)`
			: `\\mathbf{r} = \\left( ${this.a.toIJKString()} \\right) + ${
					this.lambda
			  } \\left( ${this.d.toIJKString()} \\right)`;
	}

	/**
	 * @returns (a+lambda d) combined together in a column vector
	 *
	 * @param component 0 (default) returns all 3 components, 1 returns x, 2 returns y, 3 returns z
	 */
	toCombinedString(component = 0): string {
		const x = new Polynomial([this.a.x, this.d.x], { ascending: true, unknown: this.lambda });
		const y = new Polynomial([this.a.y, this.d.y], { ascending: true, unknown: this.lambda });
		const z = new Polynomial([this.a.z, this.d.z], { ascending: true, unknown: this.lambda });
		if (component === 0) {
			return `\\begin{pmatrix}\n\t${x} \\\\\n\t${y} \\\\\n\t${z}\n\\end{pmatrix}`;
		} else if (component === 1) {
			return `${x}`;
		} else if (component === 2) {
			return `${y}`;
		} else if (component === 3) {
			return `${z}`;
		} else {
			throw new Error(`Component ${component} not recognized: must be 0-3`);
		}
	}

	/**
	 * @returns cartesian equation of the line
	 */
	toCartesianString(): string {
		if (this.d.x.isEqualTo(0)) {
			if (this.d.y.isEqualTo(0)) {
				// x,y zero
				// by construction z cannot be zero
				return `x = ${this.a.x}, y = ${this.a.y}, z \\in \\R`;
			} else {
				// x zero, y non-zero
				const yString = toCartesianComponent('y', this.a.y, this.d.y);
				if (this.d.z.isEqualTo(0)) {
					// y non-zero, x,z zero
					return `x = ${this.a.x}, y \\in \\R, z = ${this.a.z}`;
				} else {
					// x zero, y,z non-zero
					const zString = toCartesianComponent('z', this.a.z, this.d.z);
					return `x = ${this.a.x}, ${yString} = ${zString}`;
				}
			}
		} else {
			// x non-zero
			const xString = toCartesianComponent('x', this.a.x, this.d.x);
			if (this.d.y.isEqualTo(0)) {
				// x non-zero, y zero
				if (this.d.z.isEqualTo(0)) {
					// x non-zero, y,z zero
					return `x \\in \\R, y = ${this.a.y}, z = ${this.a.z}`;
				} else {
					// x,z non-zero, y zero
					const zString = toCartesianComponent('z', this.a.z, this.d.z);
					return `${xString} = ${zString}, y = ${this.a.y}`;
				}
			} else {
				// x,y non-zero
				const yString = toCartesianComponent('y', this.a.y, this.d.y);
				if (this.d.z.isEqualTo(0)) {
					// x,y non-zero, z zero
					return `${xString} = ${yString}, z = ${this.a.z}`;
				} else {
					// x,y,z non-zero
					const zString = toCartesianComponent('z', this.a.z, this.d.z);
					return `${xString} = ${yString} = ${zString}`;
				}
			}
		}
	}

	/**
	 * clones and returns a new instance of this line
	 */
	clone(): Line {
		return new Line(this.a, this.d, { lambda: this.lambda });
	}
}

function toCartesianComponent(x: string, a: Fraction, d: Fraction): string {
	const xMinusA = new Polynomial([1, a.negative()], { unknown: x });
	let xString: string;
	if (d.isEqualTo(1)) {
		xString = `${xMinusA}`;
	} else {
		// d should be 1 since direction vectors are simplified during instantiation
		//// old code: const xNum = d.den === 1 ? `${xMinusA}` : `${d.den} \\left( ${xMinusA} \\right)`;
		const xNum = `${xMinusA}`;
		xString = `\\frac{${xNum}}{${d.num}}`;
	}
	return xString;
}

/**
 * determinant of 2x2 matrix
 * [a1 a2]
 * [b1 b2]
 */
function determinant(a1: Fraction, b1: Fraction, a2: Fraction, b2: Fraction): Fraction {
	return a1.times(b2).minus(a2.times(b1));
}
