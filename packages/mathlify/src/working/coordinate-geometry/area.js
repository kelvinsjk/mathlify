import { UnsimplifiedExpression } from "../expression/expression-working.js";
import { Term } from "../../core/index.js";
/** @typedef {import('../../coordinate-geometry/index.js').Point} Point  */
/** @typedef {import('../../core/index.js').Fraction} Fraction  */

/**
 * @param {Point[]} pts
 * @returns {{matrix: string, working: string, area: Fraction}}
 */
export function areaWorking(...pts) {
  let row1 = "";
  let row2 = "";
  /** @type {({term: Term, addition: boolean}|Fraction)[]} */
  const pluses = [];
  /** @type {({term: Term, addition: boolean}|Fraction)[]} */
  const minuses = [];
  pts.forEach((pt, i) => {
    if (i !== 0) {
      row1 += " &";
      row2 += " &";
    }
    row1 += pt.x.toString();
    row2 += pt.y.toString();
    if (i === pts.length - 1) {
      const plus = pt.x.times(pts[0].y);
      const minus = pt.y.times(pts[0].x);
      pluses.push({
        term: new Term(plus.abs()),
        addition: plus.is.not.negative(),
      });
      minuses.push({
        term: new Term(minus.abs()),
        addition: minus.is.not.negative(),
      });
    } else if (i === 0) {
      const plus = pt.x.times(pts[i + 1].y);
      const minus = pt.y.times(pts[i + 1].x);
      pluses.push(plus);
      minuses.push(minus);
    } else {
      const plus = pt.x.times(pts[i + 1].y);
      const minus = pt.y.times(pts[i + 1].x);
      pluses.push({
        term: new Term(plus.abs()),
        addition: plus.is.not.negative(),
      });
      minuses.push({
        term: new Term(minus.abs()),
        addition: minus.is.not.negative(),
      });
    }
  });
  row1 += ` & ${pts[0].x.toString()}`;
  row2 += ` & ${pts[0].y.toString()}`;
  const matrix = `\\frac{1}{2} \\begin{vmatrix}\n\t${row1} \\\\\n\t${row2}\n\\end{vmatrix}`;
  const exp1 = new UnsimplifiedExpression(...pluses);
  const exp2 = new UnsimplifiedExpression(...minuses);
  const working = `\\frac{1}{2} \\left| ${exp1} - \\left( ${exp2} \\right) \\right|`;
  const area = exp1
    .simplify()
    .minus(exp2.simplify())
    .cast.toFraction()
    .divide(2)
    .abs();
  return { matrix, working, area };
}
