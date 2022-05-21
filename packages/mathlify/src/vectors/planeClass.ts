import { Vector } from './vectorClass';
import { Line } from './lineClass';
import { type Fraction, SquareRoot, Term, Expression, numberToFraction } from '../core';

/**
 * Plane class representing a 3D Plane represented in scalar product form
 * r \cdot n = rhs, where rhs = a \cdot n and a is a point on the plane,
 * n is a normal vector perpendicular to the plane,
 * and lambda is the parameter
 */
export class Plane {
	n: Vector;
	rhs: Fraction;
	/**
	 * creates a new Plane instance
	 *
	 * by default, v1 is taken as the normal n
	 *
	 * @param options default to {mode: 'rhs', rhs: 0, v2: (1,0,0), v3: (0,1,0) }
	 * `mode: rhs`: takes v1 as n and rhs to form the plane
	 * `mode: ptN`: takes v1 as n and v2 as a point on the plane
	 * `mode: ptDD`: takes v1 as a point on the plane and v2 and v3 as direction vectors parallel to the plane
	 * `mode: ptPtD`: takes v1 and v2 as points on the plane and v3 as a direction vector parallel to the plane
	 * `mode: ptPtPt`: takes v1, v2 and v3 as points on the plane and v3
	 */
	constructor(
		v1: Vector,
		options?: {
			mode?: 'rhs' | 'ptN' | 'ptDD' | 'ptPtD' | 'ptPtPt';
			rhs?: number | Fraction;
			v2?: Vector;
			v3?: Vector;
		},
	) {
		const { mode, rhs, v2, v3 } = {
			mode: 'rhs',
			rhs: 0,
			v2: Vector.I,
			v3: Vector.J,
			...options,
		};
		let n: Vector;
		if (mode === 'rhs') {
			n = v1.clone();
			this.rhs = numberToFraction(rhs);
		} else if (mode === 'ptN') {
			n = v1.clone();
			this.rhs = n.dot(v2);
		} else if (mode === 'ptDD') {
			n = v2.cross(v3).simplify({ stretchable: true });
			this.rhs = v1.dot(n);
		} else if (mode === 'ptPtD') {
			n = v3.cross(v2.minus(v1)).simplify({ stretchable: true });
			this.rhs = v1.dot(n);
		} else if (mode === 'ptPtPt') {
			n = v2.minus(v1).cross(v3.minus(v1)).simplify({ stretchable: true });
			this.rhs = v1.dot(n);
		} else {
			throw new Error(`mode \`${mode}\` is not valid`);
		}
		if (n.isEqualTo(Vector.ZERO)) {
			throw new Error('normal vector cannot be zero');
		}
		this.n = n;
	}

	/**
	 * checks if this plane contains a point/line
	 */
	contains(pointOrLine: Vector | Line): boolean {
		if (pointOrLine instanceof Vector) {
			// point
			return this.rhs.isEqualTo(this.n.dot(pointOrLine));
		} else {
			// line
			return this.contains(pointOrLine.a) && this.n.isPerpendicularTo(pointOrLine.d);
		}
	}

	/**
	 * checks if this plane is parallel to line or plane
	 */
	isParallelTo(lineOrPlane: Plane | Line): boolean {
		if (lineOrPlane instanceof Line) {
			// line
			return this.n.isPerpendicularTo(lineOrPlane.d);
		} else {
			// plane
			return this.n.isParallelTo(lineOrPlane.n);
		}
	}

	/**
	 * checks if two planes are the same
	 */
	isEqualTo(p2: Plane): boolean {
		if (this.isParallelTo(p2)) {
			// n1 = k n2
			let k: Fraction;
			if (this.n.x.isEqualTo(0)) {
				if (this.n.y.isEqualTo(0)) {
					// theoretically z component should be non-zero
					k = this.n.z.divide(p2.n.z);
				} else {
					k = this.n.y.divide(p2.n.y);
				}
			} else {
				// division of x component allowed
				k = this.n.x.divide(p2.n.x);
			}
			return this.rhs.isEqualTo(p2.rhs.times(k));
		}
		return false;
	}

	/**
	 * @returns a point on the plane
	 *
	 * tries (x,0,0) if possible, followed by (0,y,0) and (0,0,z)
	 */
	point(): Vector {
		if (this.n.x.isEqualTo(0)) {
			if (this.n.y.isEqualTo(0)) {
				// theoretically this.n.z should be non-zero
				return new Vector(0, 0, this.rhs.divide(this.n.z));
			} else {
				// (0,y,0)
				return new Vector(0, this.rhs.divide(this.n.y));
			}
		} else {
			// (x,0,0)
			return new Vector(this.rhs.divide(this.n.x));
		}
	}

	/**
	 * finds angle between this plane and vector/line/plane
	 */
	angleTo(v: Vector | Line | Plane): string {
		if (v instanceof Plane) {
			return this.n.angleTo(v.n, { acute: true });
		} else {
			v = v instanceof Line ? v.d : v;
			return this.n.angleTo(v, { acute: true, sineMode: true });
		}
	}

	/**
	 * finds distance between this plane to a point or a parallel line/plane
	 */
	distanceTo(v: Vector | Line | Plane): SquareRoot {
		let ab: Vector;
		if (v instanceof Line) {
			if (this.isParallelTo(v)) {
				v = v.a;
			} else {
				// intersecting
				return new SquareRoot(0);
			}
		} else if (v instanceof Plane) {
			if (this.isParallelTo(v)) {
				v = v.point();
			} else {
				// intersecting
				return new SquareRoot(0);
			}
		}
		const modABDotN = new SquareRoot(1, v.minus(this.point()).dot(this.n).abs());
		return modABDotN.divide(this.n.magnitude());
	}

	/**
	 * finds intersection between this plane and another line/plane
	 */
	intersect(lineOrPlane: Line | Plane): Vector | Line | null | Plane {
		return lineOrPlane instanceof Line ? this.intersectLine(lineOrPlane) : this.intersectPlane(lineOrPlane);
	}

	/**
	 * finds lambda of line such that line intersects plane
	 */
	intersectLineParam(l: Line): Fraction {
		if (this.isParallelTo(l)) {
			throw new Error('line parallel to plane');
		}
		return this.rhs.minus(l.a.dot(this.n)).divide(l.d.dot(this.n));
	}

	/**
	 * finds the intersection between this plane and a line
	 */
	intersectLine(l: Line): Vector | null | Line {
		if (this.isParallelTo(l)) {
			// parallel or on
			return this.contains(l) ? l.clone() : null;
		}
		// intersecting
		const lambda = this.intersectLineParam(l);
		return l.point(lambda);
	}

	/**
	 * finds the intersection between this plane and a plane
	 */
	intersectPlane(p2: Plane): Line | null | Plane {
		if (this.isParallelTo(p2)) {
			// parallel or coincident
			return this.isEqualTo(p2) ? p2.clone() : null;
		}
		// intersecting
		const d1 = this.n.cross(p2.n).simplify({ stretchable: true });
		let d = d1.clone();
		if (
			d1.z.isLessThan(0) ||
			(d1.z.isEqualTo(0) && d1.y.isLessThan(0)) ||
			(d1.z.isEqualTo(0) && d1.y.isEqualTo(0) && d1.x.isLessThan(0))
		) {
			d = d1.negative();
		}
		// try z = 0
		let det = determinant(this.n.x, this.n.y, p2.n.x, p2.n.y);
		if (det.isEqualTo(0)) {
			// try y = 0
			det = determinant(this.n.x, this.n.z, p2.n.x, p2.n.z);
			if (det.isEqualTo(0)) {
				// x = 0
				det = determinant(this.n.y, this.n.z, p2.n.y, p2.n.z);
				// theoretically non-zero since planes not parallel
				const y = determinant(this.rhs, this.n.z, p2.rhs, p2.n.z).divide(det);
				const z = determinant(this.n.y, this.rhs, p2.n.y, p2.rhs).divide(det);
				return new Line(new Vector(0, y, z), d);
			} else {
				// y = 0
				const x = determinant(this.rhs, this.n.z, p2.rhs, p2.n.z).divide(det);
				const z = determinant(this.n.x, this.rhs, p2.n.x, p2.rhs).divide(det);
				return new Line(new Vector(x, 0, z), d);
			}
		} else {
			// z = 0
			const y = determinant(this.n.x, this.rhs, p2.n.x, p2.rhs).divide(det);
			const x = determinant(this.rhs, this.n.y, p2.rhs, p2.n.y).divide(det);
			return new Line(new Vector(x, y, 0), d);
		}
	}

	/**
	 * finds the foot of perpendicular from point to this plane
	 */
	footOfPerpendicular(point: Vector): Vector {
		const AB = point.minus(this.point());
		const ABDotN = AB.dot(this.n);
		const lambda = ABDotN.divide(this.n.magnitudeSquare());
		const FB = this.n.multiply(lambda);
		return point.minus(FB).expand();
	}

	/**
	 * finds the reflection of point about this plane
	 */
	pointReflection(point: Vector): Vector {
		const OF = this.footOfPerpendicular(point);
		return OF.multiply(2).minus(point).expand();
	}

	/**
	 * finds the reflection of line l about this plane
	 */
	lineReflection(l: Line): Line {
		if (this.isParallelTo(l)) {
			const OAPrime = this.pointReflection(l.a);
			return new Line(OAPrime, l.d);
		}
		// line and plane intersect at one point
		const OX = this.intersect(l) as Vector;
		let OA = l.a;
		// ensure OA doesn't lie on plane
		if (this.contains(OA)) {
			OA = l.point(1);
		}
		const OAPrime = this.pointReflection(OA);
		return new Line(OX, OAPrime, { twoPointsMode: true });
	}

	/**
	 * reflects a point/line about this plane
	 */
	reflect(pointOrLine: Line | Vector): Vector | Line {
		return pointOrLine instanceof Line ? this.lineReflection(pointOrLine) : this.pointReflection(pointOrLine);
	}

	/**
	 * @returns equation of the plane r \cdot n = rhs in column vector form
	 */
	toString(): string {
		return `\\mathbf{r} \\cdot ${this.n} = ${this.rhs}`;
	}

	/**
	 * @returns equation of the line r = a + lambda d in ijk form
	 */
	toIJKString(): string {
		return `\\mathbf{r} \\cdot \\left( ${this.n.toIJKString()} \\right) = ${this.rhs}`;
	}

	/**
	 * @returns cartesian equation of the line
	 */
	toCartesianString(): string {
		const xyzExpression = new Expression(new Term(this.n.x, 'x'), new Term(this.n.y, 'y'), new Term(this.n.z, 'z'));
		return `${xyzExpression} = ${this.rhs}`;
	}

	/**
	 * clones a new instance of this line
	 */
	clone(): Plane {
		return new Plane(this.n, { rhs: this.rhs });
	}
}

/**
 * determinant of 2x2 matrix
 * [a1 a2]
 * [b1 b2]
 */
function determinant(a1: Fraction, b1: Fraction, a2: Fraction, b2: Fraction): Fraction {
	return a1.times(b2).minus(a2.times(b1));
}
