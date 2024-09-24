/** @typedef {import('../core/expression/expression.js').Shorthand} Shorthand */
/** @typedef {import('./utils.js').VectorShorthand} VectorShorthand */
/** @typedef {import('./vector.js').Vector} Vector */
/** @typedef {{rhs: Shorthand}} PlaneVariant1 */
/** @typedef {{pt: VectorShorthand}} PlaneVariant2 */
/** @typedef {{d1: VectorShorthand, d2: VectorShorthand}} PlaneVariant3 */
/** @typedef {{d: VectorShorthand, pt2: VectorShorthand}} PlaneVariant4 */
/** @typedef {{pt2: VectorShorthand, pt3: VectorShorthand}} PlaneVariant5 */
/** @typedef {PlaneVariant1|PlaneVariant2|PlaneVariant3|PlaneVariant4|PlaneVariant5} PlaneVariant */
export class Plane {
    /**
     * variant 1: given normal and rhs
     * variant 2: given normal and point
     * variant 3: given pt and two directions
     * variant 4: given 2 pts and 1 directions
     * variant 5: given 3 pts
     * @param {VectorShorthand} nOrPoint
     * @param {PlaneVariant & {stringMode?: 'scalar'|'cartesian', name?: string}} options
     */
    constructor(nOrPoint: VectorShorthand, options: PlaneVariant & {
        stringMode?: "scalar" | "cartesian";
        name?: string;
    });
    /** @typedef {Vector} */
    normal: import("./vector.js").Vector;
    /** @typedef {Expression} */
    rhs: import("../core/expression/expression.js").Shorthand;
    /** @typedef {string} */
    name: string;
    stringMode: "cartesian" | "scalar";
    /**
     * @returns {string}
     */
    toString(): string;
    /**
     * @returns {string}
     */
    toCartesianString(): string;
}
export type Shorthand = import("../core/expression/expression.js").Shorthand;
export type VectorShorthand = import("./utils.js").VectorShorthand;
export type Vector = import("./vector.js").Vector;
export type PlaneVariant1 = {
    rhs: Shorthand;
};
export type PlaneVariant2 = {
    pt: VectorShorthand;
};
export type PlaneVariant3 = {
    d1: VectorShorthand;
    d2: VectorShorthand;
};
export type PlaneVariant4 = {
    d: VectorShorthand;
    pt2: VectorShorthand;
};
export type PlaneVariant5 = {
    pt2: VectorShorthand;
    pt3: VectorShorthand;
};
export type PlaneVariant = PlaneVariant1 | PlaneVariant2 | PlaneVariant3 | PlaneVariant4 | PlaneVariant5;
//# sourceMappingURL=plane.d.ts.map