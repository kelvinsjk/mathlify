import { determinant, determinantNumerical } from "./determinant";
/** @typedef {import('../../core/fraction.js').Fraction} Fraction */

/**
 * @overload
 * @param {[number|Fraction, number|Fraction]} coeffs1 - first set of coefficients (2 unknowns)
 * @param {number|Fraction} val1 - first value
 * @param {[number|Fraction, number|Fraction]} coeff2 - second set of coefficients (2 unknowns)
 * @param {number|Fraction} val2 - second value
 * @returns {[Fraction, Fraction]} solution of the system of linear equations
 */
/**
 * @overload
 * @param {[number|Fraction, number|Fraction, number|Fraction]} coeffs1 - first set of coefficients (3 unknowns)
 * @param {number|Fraction} val1 - first value
 * @param {[number|Fraction, number|Fraction, number|Fraction]} coeffs2 - second set of coefficients (3 unknowns)
 * @param {number|Fraction} val2 - second value
 * @param {[number|Fraction, number|Fraction, number|Fraction]} coeffs3 - third set of coefficients (3 unknowns)
 * @param {number|Fraction} val3 - third value
 * @returns {[Fraction, Fraction, Fraction]} solution of the system of linear equations
 */
/**
 * @overload
 * @param {[number|Fraction, number|Fraction, number|Fraction, number|Fraction]} coeffs1 - first set of coefficients (4 unknowns)
 * @param {number|Fraction} val1 - first value
 * @param {[number|Fraction, number|Fraction, number|Fraction, number|Fraction]} coeffs2 - second set of coefficients (4 unknowns)
 * @param {number|Fraction} val2 - second value
 * @param {[number|Fraction, number|Fraction, number|Fraction, number|Fraction]} coeffs3 - third set of coefficients (4 unknowns)
 * @param {number|Fraction} val3 - third value
 * @param {[number|Fraction, number|Fraction, number|Fraction, number|Fraction]} coeffs4 - fourth set of coefficients (4 unknowns)
 * @param {number|Fraction} val4 - fourth value
 * @returns {[Fraction, Fraction, Fraction, Fraction]} solution of the system of linear equations
 */
/**
 * solves a system of linear equations using Cramer's rule
 * works for 2x2, 3x3, 4x4 matrices only
 * @param {(number|Fraction)[]} coeffs1 - first set of coefficients
 * @param {number|Fraction} val1 - first value
 * @param {(number|Fraction)[]} coeffs2 - second set of coefficients
 * @param {number|Fraction} val2 - second value
 * @param {(number|Fraction)[]} [coeffs3] - third set of coefficients
 * @param {number|Fraction} [val3] - third value
 * @param {(number|Fraction)[]} [coeffs4] - fourth set of coefficients
 * @param {number|Fraction} [val4] - fourth value
 * @returns {Fraction[]} solution of the system of linear equations
 */
export function cramersRule(
  coeffs1,
  val1,
  coeffs2,
  val2,
  coeffs3,
  val3,
  coeffs4,
  val4
) {
  if (coeffs1.length === 2) {
    const det = determinant(...coeffs1, ...coeffs2);
    const detX = determinant(val1, coeffs1[1], val2, coeffs2[1]);
    const detY = determinant(coeffs1[0], val1, coeffs2[0], val2);
    if (det.is.zero()) {
      throw new Error(
        `determinant 0: no roots found for ${coeffs1}, ${coeffs2}`
      );
    }
    return [detX.divide(det), detY.divide(det)];
  } else if (coeffs1.length === 3 && coeffs3 && val3 !== undefined) {
    const det = determinant(...coeffs1, ...coeffs2, ...coeffs3);
    const detX = determinant(
      val1,
      coeffs1[1],
      coeffs1[2],
      val2,
      coeffs2[1],
      coeffs2[2],
      val3,
      coeffs3[1],
      coeffs3[2]
    );
    const detY = determinant(
      coeffs1[0],
      val1,
      coeffs1[2],
      coeffs2[0],
      val2,
      coeffs2[2],
      coeffs3[0],
      val3,
      coeffs3[2]
    );
    const detZ = determinant(
      coeffs1[0],
      coeffs1[1],
      val1,
      coeffs2[0],
      coeffs2[1],
      val2,
      coeffs3[0],
      coeffs3[1],
      val3
    );
    if (det.is.zero()) {
      throw new Error(
        `determinant 0: no roots found for ${coeffs1}, ${coeffs2}, ${coeffs3}`
      );
    }
    return [detX.divide(det), detY.divide(det), detZ.divide(det)];
  } else if (
    coeffs1.length === 4 &&
    coeffs3 &&
    val3 !== undefined &&
    coeffs4 &&
    val4 !== undefined
  ) {
    const det = determinant(...coeffs1, ...coeffs2, ...coeffs3, ...coeffs4);
    const detX = determinant(
      val1,
      coeffs1[1],
      coeffs1[2],
      coeffs1[3],
      val2,
      coeffs2[1],
      coeffs2[2],
      coeffs2[3],
      val3,
      coeffs3[1],
      coeffs3[2],
      coeffs3[3],
      val4,
      coeffs4[1],
      coeffs4[2],
      coeffs4[3]
    );
    const detY = determinant(
      coeffs1[0],
      val1,
      coeffs1[2],
      coeffs1[3],
      coeffs2[0],
      val2,
      coeffs2[2],
      coeffs2[3],
      coeffs3[0],
      val3,
      coeffs3[2],
      coeffs3[3],
      coeffs4[0],
      val4,
      coeffs4[2],
      coeffs4[3]
    );
    const detZ = determinant(
      coeffs1[0],
      coeffs1[1],
      val1,
      coeffs1[3],
      coeffs2[0],
      coeffs2[1],
      val2,
      coeffs2[3],
      coeffs3[0],
      coeffs3[1],
      val3,
      coeffs3[3],
      coeffs4[0],
      coeffs4[1],
      val4,
      coeffs4[3]
    );
    const detW = determinant(
      coeffs1[0],
      coeffs1[1],
      coeffs1[2],
      val1,
      coeffs2[0],
      coeffs2[1],
      coeffs2[2],
      val2,
      coeffs3[0],
      coeffs3[1],
      coeffs3[2],
      val3,
      coeffs4[0],
      coeffs4[1],
      coeffs4[2],
      val4
    );
    if (det.is.zero()) {
      throw new Error(
        `determinant 0: no roots found for ${coeffs1}, ${coeffs2}, ${coeffs3}, ${coeffs4}`
      );
    }
    return [
      detX.divide(det),
      detY.divide(det),
      detZ.divide(det),
      detW.divide(det),
    ];
  }
  throw new Error("only 2x2, 3x3 and 4x4 equations are supported");
}

/**
 * @overload
 * @param {[number|Fraction, number|Fraction]} coeffs1 - first set of coefficients (2 unknowns)
 * @param {number|Fraction} val1 - first value
 * @param {[number|Fraction, number|Fraction]} coeff2 - second set of coefficients (2 unknowns)
 * @param {number|Fraction} val2 - second value
 * @returns {[number, number]} solution of the system of linear equations
 */
/**
 * @overload
 * @param {[number|Fraction, number|Fraction, number|Fraction]} coeffs1 - first set of coefficients (3 unknowns)
 * @param {number|Fraction} val1 - first value
 * @param {[number|Fraction, number|Fraction, number|Fraction]} coeffs2 - second set of coefficients (3 unknowns)
 * @param {number|Fraction} val2 - second value
 * @param {[number|Fraction, number|Fraction, number|Fraction]} coeffs3 - third set of coefficients (3 unknowns)
 * @param {number|Fraction} val3 - third value
 * @returns {[number, number, number]} solution of the system of linear equations
 */
/**
 * @overload
 * @param {[number|Fraction, number|Fraction, number|Fraction, number|Fraction]} coeffs1 - first set of coefficients (4 unknowns)
 * @param {number|Fraction} val1 - first value
 * @param {[number|Fraction, number|Fraction, number|Fraction, number|Fraction]} coeffs2 - second set of coefficients (4 unknowns)
 * @param {number|Fraction} val2 - second value
 * @param {[number|Fraction, number|Fraction, number|Fraction, number|Fraction]} coeffs3 - third set of coefficients (4 unknowns)
 * @param {number|Fraction} val3 - third value
 * @param {[number|Fraction, number|Fraction, number|Fraction, number|Fraction]} coeffs4 - fourth set of coefficients (4 unknowns)
 * @param {number|Fraction} val4 - fourth value
 * @returns {[number, number, number, number]} solution of the system of linear equations
 */
/**
 * solves a system of linear equations using Cramer's rule
 * works for 2x2, 3x3, 4x4 matrices only
 * @param {(number|Fraction)[]} coeffs1 - first set of coefficients
 * @param {number|Fraction} val1 - first value
 * @param {(number|Fraction)[]} coeffs2 - second set of coefficients
 * @param {number|Fraction} val2 - second value
 * @param {(number|Fraction)[]} [coeffs3] - third set of coefficients
 * @param {number|Fraction} [val3] - third value
 * @param {(number|Fraction)[]} [coeffs4] - fourth set of coefficients
 * @param {number|Fraction} [val4] - fourth value
 * @returns {number[]} solution of the system of linear equations
 */
export function cramersRuleNumerical(
  coeffs1,
  val1,
  coeffs2,
  val2,
  coeffs3,
  val3,
  coeffs4,
  val4
) {
  if (coeffs1.length === 2) {
    const det = determinantNumerical(...coeffs1, ...coeffs2);
    const detX = determinantNumerical(val1, coeffs1[1], val2, coeffs2[1]);
    const detY = determinantNumerical(coeffs1[0], val1, coeffs2[0], val2);
    return [detX / det, detY / det];
  } else if (coeffs1.length === 3 && coeffs3 && val3 !== undefined) {
    const det = determinantNumerical(...coeffs1, ...coeffs2, ...coeffs3);
    const detX = determinantNumerical(
      val1,
      coeffs1[1],
      coeffs1[2],
      val2,
      coeffs2[1],
      coeffs2[2],
      val3,
      coeffs3[1],
      coeffs3[2]
    );
    const detY = determinantNumerical(
      coeffs1[0],
      val1,
      coeffs1[2],
      coeffs2[0],
      val2,
      coeffs2[2],
      coeffs3[0],
      val3,
      coeffs3[2]
    );
    const detZ = determinantNumerical(
      coeffs1[0],
      coeffs1[1],
      val1,
      coeffs2[0],
      coeffs2[1],
      val2,
      coeffs3[0],
      coeffs3[1],
      val3
    );
    return [detX / det, detY / det, detZ / det];
  } else if (
    coeffs1.length === 4 &&
    coeffs3 &&
    val3 !== undefined &&
    coeffs4 &&
    val4 !== undefined
  ) {
    const det = determinantNumerical(
      ...coeffs1,
      ...coeffs2,
      ...coeffs3,
      ...coeffs4
    );
    const detX = determinantNumerical(
      val1,
      coeffs1[1],
      coeffs1[2],
      coeffs1[3],
      val2,
      coeffs2[1],
      coeffs2[2],
      coeffs2[3],
      val3,
      coeffs3[1],
      coeffs3[2],
      coeffs3[3],
      val4,
      coeffs4[1],
      coeffs4[2],
      coeffs4[3]
    );
    const detY = determinantNumerical(
      coeffs1[0],
      val1,
      coeffs1[2],
      coeffs1[3],
      coeffs2[0],
      val2,
      coeffs2[2],
      coeffs2[3],
      coeffs3[0],
      val3,
      coeffs3[2],
      coeffs3[3],
      coeffs4[0],
      val4,
      coeffs4[2],
      coeffs4[3]
    );
    const detZ = determinantNumerical(
      coeffs1[0],
      coeffs1[1],
      val1,
      coeffs1[3],
      coeffs2[0],
      coeffs2[1],
      val2,
      coeffs2[3],
      coeffs3[0],
      coeffs3[1],
      val3,
      coeffs3[3],
      coeffs4[0],
      coeffs4[1],
      val4,
      coeffs4[3]
    );
    const detW = determinantNumerical(
      coeffs1[0],
      coeffs1[1],
      coeffs1[2],
      val1,
      coeffs2[0],
      coeffs2[1],
      coeffs2[2],
      val2,
      coeffs3[0],
      coeffs3[1],
      coeffs3[2],
      val3,
      coeffs4[0],
      coeffs4[1],
      coeffs4[2],
      val4
    );
    return [detX / det, detY / det, detZ / det, detW / det];
  }
  throw new Error("only 2x2, 3x3 and 4x4 equations are supported");
}
