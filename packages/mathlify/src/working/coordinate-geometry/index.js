import { SquareRoot } from "../../surds/square-roots.js";

export { areaWorking } from "./area.js";

/** @typedef {import('../../coordinate-geometry/index.js').Point} Point  */
/** @typedef {import('../../core/index.js').Fraction} Fraction  */
/** @typedef {import('../../core/index.js').Polynomial} Polynomial  */

/**
 * @param {Point} pt1
 * @param {Point} pt2
 * @returns {{working: string, gradient: Fraction}}
 */
export function gradientWorking(pt1, pt2) {
  const pt1YBrackets = pt1.y.is.negative()
    ? `\\left( ${pt1.y} \\right)`
    : pt1.y.toString();
  const pt1XBrackets = pt1.x.is.negative()
    ? `\\left( ${pt1.x} \\right)`
    : pt1.x.toString();
  const working = `\\frac{ ${pt2.y} - ${pt1YBrackets} }{ ${pt2.x} - ${pt1XBrackets} }`;
  return { working, gradient: pt2.y.minus(pt1.y).divide(pt2.x.minus(pt1.x)) };
}

/**
 * @param {{m: Fraction, pt: Point}} params
 * @param {{aligned?: boolean}} [options]
 * @returns {{working: string, eqn: Polynomial}}
 */
export function lineWorking(params, options) {
  const eq = options && options.aligned ? "&=" : "=";
  if (params.m !== undefined && params.pt !== undefined) {
    const pt = params.pt;
    const yBrackets = pt.y.is.negative()
      ? `\\left( ${pt.y} \\right)`
      : pt.y.toString();
    const xBrackets = pt.x.is.negative()
      ? `\\left( ${pt.x} \\right)`
      : pt.x.toString();
    const working = `y - ${yBrackets} ${eq} ${params.m} \\left( x - ${xBrackets} \\right)`;
    return {
      working,
      eqn: pt.lineWithGradient(params.m),
    };
  }
  throw Error(`Error with params object ${params}`);
}

/**
 * @param {Point} pt1
 * @param {Point} pt2
 * @returns {{working: string, midPoint: Point}}
 */
export function midPointWorking(pt1, pt2) {
  const pt2X = pt2.x.is.negative() ? `\\left(${pt2.x}\\right)` : `${pt2.x}`;
  const pt2Y = pt2.y.is.negative() ? `\\left(${pt2.y}\\right)` : `${pt2.y}`;
  return {
    working: `\\left( \\frac{${pt1.x} + ${pt2X}}{2}, \\frac{${pt1.y} + ${pt2Y}}{2} \\right)`,
    midPoint: pt1.midPoint(pt2),
  };
}

/**
 * @param {Point} pt1
 * @param {Point} pt2
 * @returns {{working: string, distance: SquareRoot}}
 */
export function distanceWorking(pt1, pt2) {
  const pt2X = pt2.x.is.negative() ? `\\left(${pt2.x}\\right)` : `${pt2.x}`;
  const pt2Y = pt2.y.is.negative() ? `\\left(${pt2.y}\\right)` : `${pt2.y}`;
  return {
    working: `\\sqrt{ \\left( ${pt1.x} - ${pt2X} \\right)^2 + \\left( ${pt1.y} - ${pt2Y} \\right)^2 }`,
    distance: pt1.distanceTo(pt2),
  };
}
