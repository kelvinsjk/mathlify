/** @typedef {import('../../coordinate-geometry/index.js').Point} Point  */
/** @typedef {import('../../core/index.js').Fraction} Fraction  */
/**
 * @param {Point[]} pts
 * @returns {{matrix: string, working: string, area: Fraction}}
 */
export function areaWorking(...pts: Point[]): {
    matrix: string;
    working: string;
    area: Fraction;
};
export type Point = import('../../coordinate-geometry/index.js').Point;
export type Fraction = import('../../core/index.js').Fraction;
//# sourceMappingURL=area.d.ts.map