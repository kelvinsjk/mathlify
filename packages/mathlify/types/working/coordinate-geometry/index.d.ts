/** @typedef {import('../../coordinate-geometry/index.js').Point} Point  */
/** @typedef {import('../../core/index.js').Fraction} Fraction  */
/** @typedef {import('../../core/index.js').Polynomial} Polynomial  */
/**
 * @param {Point} pt1
 * @param {Point} pt2
 * @returns {{working: string, gradient: Fraction}}
 */
export function gradientWorking(pt1: Point, pt2: Point): {
    working: string;
    gradient: Fraction;
};
/**
 * @param {{m: Fraction, pt: Point}} params
 * @param {{aligned?: boolean}} [options]
 * @returns {{working: string, eqn: Polynomial}}
 */
export function lineWorking(params: {
    m: Fraction;
    pt: Point;
}, options?: {
    aligned?: boolean | undefined;
} | undefined): {
    working: string;
    eqn: Polynomial;
};
/**
 * @param {Point} pt1
 * @param {Point} pt2
 * @returns {{working: string, midPoint: Point}}
 */
export function midPointWorking(pt1: Point, pt2: Point): {
    working: string;
    midPoint: Point;
};
export type Point = import('../../coordinate-geometry/index.js').Point;
export type Fraction = import('../../core/index.js').Fraction;
export type Polynomial = import('../../core/index.js').Polynomial;
//# sourceMappingURL=index.d.ts.map