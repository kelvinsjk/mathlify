import { Expression } from '../core/expression/expression.js';
import { vectorShorthandToVector } from './utils.js';
/** @typedef {import('../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('./utils.js').VectorShorthand} VectorShorthand */
/** @typedef {import('./vector.js').Vector} Vector */

// given normal and rhs
/** @typedef {{rhs: Shorthand}} PlaneVariant1 */
// given normal and point
/** @typedef {{pt: VectorShorthand}} PlaneVariant2 */
// given pt and two directions
/** @typedef {{d1: VectorShorthand, d2: VectorShorthand}} PlaneVariant3 */
// given 2 pts and 1 directions
/** @typedef {{d: VectorShorthand, pt2: VectorShorthand}} PlaneVariant4 */
// given 3 pts
/** @typedef {{pt2: VectorShorthand, pt3: VectorShorthand}} PlaneVariant5 */
/** @typedef {PlaneVariant1|PlaneVariant2|PlaneVariant3|PlaneVariant4|PlaneVariant5} PlaneVariant */

export class Plane {
	/** @typedef {Vector} */
	normal;
	/** @typedef {Expression} */
	rhs;
	/** @typedef {string} */
	name;

	/**
	 * variant 1: given normal and rhs
	 * variant 2: given normal and point
	 * variant 3: given pt and two directions
	 * variant 4: given 2 pts and 1 directions
	 * variant 5: given 3 pts
	 * @param {VectorShorthand} nOrPoint
	 * @param {PlaneVariant & {stringMode?: 'scalar'|'cartesian', name?: string}} options
	 */
	constructor(nOrPoint, options) {
		const arg1 = vectorShorthandToVector(nOrPoint);
		this.name = options?.name ?? '';
		this.stringMode = options?.stringMode ?? 'scalar';
		if ('rhs' in options) {
			this.normal = arg1;
			this.rhs = options.rhs;
		} else if ('pt' in options) {
			this.normal = arg1;
			this.rhs = arg1.dot(vectorShorthandToVector(options.pt));
		} else if ('d1' in options) {
			const d1 = vectorShorthandToVector(options.d1);
			const d2 = vectorShorthandToVector(options.d2);
			this.normal = d1.cross(d2);
			this.rhs = arg1.dot(d1);
		} else if ('d' in options) {
			const d = vectorShorthandToVector(options.d);
			const pt2 = vectorShorthandToVector(options.pt2);
			this.normal = d.cross(pt2.minus(arg1));
			this.rhs = arg1.dot(d);
		} else {
			// 3 pt variant
			const pt2 = vectorShorthandToVector(options.pt2);
			const pt3 = vectorShorthandToVector(options.pt3);
			this.normal = pt2.minus(arg1).cross(pt3.minus(arg1));
			this.rhs = arg1.dot(this.normal);
		}
	}

	/**
	 * @returns {string}
	 */
	toString() {
		const name = this.name ? `${this.name}: ` : '';
		return this.stringMode === 'scalar'
			? `${name}\\mathbf{r} \\cdot ${this.normal.toString()} = ${this.rhs.toString()}`
			: this.toCartesianString();
	}
	/**
	 * @returns {string}
	 */
	toCartesianString() {
		const lhs = new Expression([
			'+',
			[this.normal.x, 'x'],
			[this.normal.y, 'y'],
			[this.normal.z, 'z'],
		]).simplify();
		return `${lhs.toString()} = ${this.rhs.toString()}`;
	}
}
