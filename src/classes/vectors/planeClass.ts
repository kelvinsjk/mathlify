import { Vector } from './vectorClass';
import { Line } from './lineClass';
import type { Fraction } from '../fractionClass';
import { SquareRoot } from '../radicals/rootClasses';
import { Term, Expression, Polynomial } from '../algebra/index';
import toFraction from '../../utils/toFraction';

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
	 * `mode: aDotN`: takes v1 as n and v2 as a point on the plane
	 * `mode: ptDD`: takes v1 as a point on the plane and v2 and v3 as direction vectors parallel to the plane
	 * `mode: ptPtD`: takes v1 and v2 as points on the plane and v3 as a direction vector parallel to the plane
	 * `mode: ptPtPt`: takes v1, v2 and v3 as points on the plane and v3
	 */
	constructor(v1: Vector, options?: { mode?: string; rhs?: number | Fraction; v2?: Vector; v3?: Vector }) {
		const { mode, rhs, v2, v3 } = {
			mode: 'rhs',
			rhs: 0,
			v2: Vector.I,
			v3: Vector.J,
			...options,
		};
		let n: Vector;
		if (mode === 'rhs') {
			this.rhs = toFraction(rhs);
			n = v1.clone().simplify({ stretchable: true });
		} else if (mode === 'aDotN') {
			this.rhs = v1.dot(v2);
			n = v1.clone().simplify({ stretchable: true });
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
					k = p2.n.y.divide(this.n.y);
				} else {
					// theoretically z component should be non-zero
					k = p2.n.z.divide(this.n.z);
				}
			} else {
				// division of x component allowed
				k = p2.n.x.divide(this.n.x);
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
	angle(v: Vector | Line | Plane): string {
		if (v instanceof Plane) {
			return this.n.angle(v.n, { acute: true });
		} else {
			v = v instanceof Line ? v.d : v;
			return this.n.angle(v, { acute: true, sineMode: true });
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
	 * finds intersection point between two lines
	 *
	 * @returns the position vector of the point of intersection, or null if there are no/infinite number of solutions
	 */
	intersect(l2: Line): Vector | null {
		if (this.isParallelTo(l2)) {
			// parallel or co-incident lines
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
			// either infinite solution or no solution
			return null;
		}
		const lambda = determinant(c1, b1, c2, b2).divide(det);
		const mu = determinant(a1, c1, a2, c2).divide(det);
		// check if intersecting
		if (this.point(lambda).isEqualTo(l2.point(mu))) {
			// intersecting lines
			return this.point(lambda);
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
	 * finds the reflection of point about this line
	 */
	reflection(point: Vector): Vector {
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
			const OAPrime = this.reflection(l2.a);
			return new Line(OAPrime, this.d);
		}
		const OX = this.intersect(l2);
		if (OX === null) {
			// skew lines
			throw new Error('Cannot find line reflection of skew lines');
		} else {
			// intersecting
			let OA = l2.a;
			if (this.contains(OA)) {
				OA = l2.point(1);
			}
			const OAPrime = this.reflection(OA);
			return new Line(OX, OAPrime.minus(OX));
		}
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
}

/**
 * determinant of 2x2 matrix
 * [a1 a2]
 * [b1 b2]
 */
function determinant(a1: Fraction, b1: Fraction, a2: Fraction, b2: Fraction): Fraction {
	return a1.times(b2).minus(a2.times(b1));
}
