import { Vector } from './vectorClass';
import type { Fraction } from '../fractionClass';
import type { SquareRoot } from '../radicals/rootClasses';
import { Polynomial } from '../algebra/index';
import toFraction from "../../utils/toFraction";

// TODO: Intersection between lines
// TODO: Foot of perpendicular
// TODO: Reflection

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
  constructor(v1: Vector, v2: Vector, options?: {twoPointsMode?: boolean, lambda?: string}) {
    const { twoPointsMode, lambda } = {
      twoPointsMode: false,
      lambda: '\\lambda',
      ...options
    };
    v2 = twoPointsMode ? v2.minus(v1) : v2;
    v2.simplify({stretchable: true});
    if (v2.isZero()) {
      throw new Error('Cannot create a line with zero vector as direction');
    }
    this.a = v1.expand();
    this.d = v2.clone();
    this.lambda = lambda;
  };

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
  isParallelTo(v: Vector|Line): boolean {
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
  point(lambda: number|Fraction = 0): Vector {
    lambda = toFraction(lambda);
    return this.a.plus(this.d.multiply(lambda));
  }

  /**
   * finds angle between lines/line and vector
   * 
   * @returns angle between this line and given vector/line
   */
  angle(v: Vector|Line): string {
    v = v instanceof Line ? v.d : v;
    return this.d.angle(v);
  }

  /**
   * finds distance between this line to a point or a parallel line
   * 
   * WARNING: does not support skew lines at the moment
   */
  distanceTo(v: Vector|Line): SquareRoot {
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
   * @returns equation of the line r = a + lambda d in column vector form
   */
  toString(): string {
    return `\\mathbf{r} = ${this.a} + ${this.lambda} ${this.d}`;
  }

  /**
   * @returns equation of the line r = a + lambda d in ijk form
   */
  toIJKString(): string {
    return `\\mathbf{r} = \\left ( ${this.a.toIJKString()} \\right) + ${this.lambda} \\left( ${this.d.toIJKString()} \\right)`;
  }

  /**
   * @returns (a+lambda d) combined together in a column vector
   */
  toCombinedString(): string {
    const x = new Polynomial([this.a.x, this.d.x], {ascending: true, variableAtom: this.lambda});
    const y = new Polynomial([this.a.y, this.d.y], {ascending: true, variableAtom: this.lambda});
    const z = new Polynomial([this.a.z, this.d.z], {ascending: true, variableAtom: this.lambda});
    return `\\begin{pmatrix}\n\t${x} \\\\\n\t${y} \\\\\n\t${z}\n\\end{pmatrix}`;
  }

  /**
   * @returns cartesian equation of the line
   */
  toCartesianString(): string {
    if (this.d.x.isEqualTo(0)){
      if (this.d.y.isEqualTo(0)) { // x,y zero
        // by construction z cannot be zero
        return `x = ${this.a.x}, y = ${this.a.y}, z \\in \\R`;
      } else { // x zero, y non-zero
        const yString = toCartesianComponent('y', this.a.y, this.d.y);
        if (this.d.z.isEqualTo(0)) { // y non-zero, x,z zero
          return `x = ${this.a.x}, y \\in \\R, z = ${this.a.z}`;
        } else { // x zero, y,z non-zero
          const zString = toCartesianComponent('z', this.a.z, this.d.z);
          return `${yString} = ${zString}, x = ${this.a.x}`;
        }
      }
    } else { // x non-zero
      const xString = toCartesianComponent('x', this.a.x, this.d.x);
      if (this.d.y.isEqualTo(0)) { // x non-zero, y zero
        if (this.d.z.isEqualTo(0)){ // x non-zero, y,z zero
          return `x \\in \\R, y = ${this.a.y}, z = ${this.a.z}`;
        } else { // x,z non-zero, y zero
          const zString = toCartesianComponent('z', this.a.z, this.d.z);
          return `${xString} = ${zString}, y = ${this.a.y}`;
        }
      } else { // x,y non-zero
        const yString = toCartesianComponent('y', this.a.y, this.d.y);
        if (this.d.z.isEqualTo(0)) { // x,y non-zero, z zero
          return `${xString} = ${yString}, z = ${this.a.z}`;
        } else { // x,y,z non-zero
          const zString = toCartesianComponent('z', this.a.z, this.d.z);
          return `${xString} = ${yString} = ${zString}`;
        }
      }
    }
  }
}

function toCartesianComponent(x: string, a: Fraction, d: Fraction): string {
  const xMinusA = new Polynomial([1, a.negative()], {variableAtom: x});
  let xString: string;
  if (d.isEqualTo(1)) {
    xString = `${xMinusA}`
  } else { // d not 1
    const xNum = d.den === 1 ? `${xMinusA}` : `${d.den} \\left( ${xMinusA} \\right)`;
    xString = `\\frac{${xNum}}{${d.num}}`;
  }
  return xString;
}