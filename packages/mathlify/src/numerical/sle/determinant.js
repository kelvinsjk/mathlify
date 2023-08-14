import { numberToFraction } from "../../utils";
/** @typedef {import('../../core/fraction.js').Fraction} Fraction */

/**
 * determinant of a 2x2 [[a b], [c d]] matrix
 * or a 3x3 [[a b c], [d e f], [g h i]] matrix
 * or a 4x4 matrix
 * @param {(number|Fraction)[]} args - matrix elements
 * @returns {Fraction} determinant of the matrix
 */
export function determinant(...args) {
  const argsFrac = args.map((x) => numberToFraction(x));
  if (argsFrac.length === 4) {
    return argsFrac[0].times(argsFrac[3]).minus(argsFrac[1].times(argsFrac[2]));
  } else if (argsFrac.length === 9) {
    return argsFrac[0]
      .times(determinant(argsFrac[4], argsFrac[5], argsFrac[7], argsFrac[8]))
      .minus(
        argsFrac[1].times(
          determinant(argsFrac[3], argsFrac[5], argsFrac[6], argsFrac[8])
        )
      )
      .plus(
        argsFrac[2].times(
          determinant(argsFrac[3], argsFrac[4], argsFrac[6], argsFrac[7])
        )
      );
  } else if (argsFrac.length === 16) {
    const threeByThree1 =
      /** @type {[number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction]} */ ([
        ...argsFrac.slice(1, 4),
        ...argsFrac.slice(5, 8),
        ...argsFrac.slice(9, 12),
      ]);
    const a = argsFrac[12].times(determinant(...threeByThree1));
    const threeByThree2 =
      /** @type {[number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction]} */ ([
        argsFrac[0],
        ...argsFrac.slice(2, 5),
        ...argsFrac.slice(6, 9),
        ...argsFrac.slice(10, 12),
      ]);
    const b = argsFrac[13].times(determinant(...threeByThree2));
    const threeByThree3 =
      /** @type {[number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction]} */ ([
        ...argsFrac.slice(0, 2),
        ...argsFrac.slice(3, 6),
        ...argsFrac.slice(7, 10),
        ...argsFrac.slice(11, 12),
      ]);
    const c = argsFrac[14].times(determinant(...threeByThree3));
    const threeByThree4 =
      /** @type {[number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction, number|Fraction]} */ ([
        ...argsFrac.slice(0, 3),
        ...argsFrac.slice(4, 7),
        ...argsFrac.slice(8, 11),
      ]);
    const d = argsFrac[15].times(determinant(...threeByThree4));
    return a.negative().plus(b).minus(c).plus(d);
  }
  throw new Error(
    `determinant of a matrix of size other than 2x2 or 3x3 or 4x4 is not supported. ${argsFrac.length} elements received.`
  );
}

/**
 * determinant of a 2x2 [[a b], [c d]] matrix
 * or a 3x3 [[a b c], [d e f], [g h i]] matrix
 * @param {(number|Fraction)[]} args - matrix elements
 * @returns {number} determinant of the matrix
 */
export function determinantNumerical(...args) {
  const argsNum = args.map((x) => x.valueOf());
  if (args.length === 4) {
    return argsNum[0] * argsNum[3] - argsNum[1] * argsNum[2];
  } else if (args.length === 9) {
    return (
      argsNum[0] * determinantNumerical(args[4], args[5], args[7], args[8]) -
      argsNum[1] * determinantNumerical(args[3], args[5], args[6], args[8]) +
      argsNum[2] * determinantNumerical(args[3], args[4], args[6], args[7])
    );
  } else if (args.length === 16) {
    const threeByThree1 =
      /** @type {[number, number, number, number, number, number, number, number, number]} */ ([
        ...args.slice(1, 4),
        ...args.slice(5, 8),
        ...args.slice(9, 12),
      ]);
    const a = argsNum[12] * determinantNumerical(...threeByThree1);
    const threeByThree2 =
      /** @type {[number, number, number, number, number, number, number, number, number]} */ ([
        args[0],
        ...args.slice(2, 5),
        ...args.slice(6, 9),
        ...args.slice(10, 12),
      ]);
    const b = argsNum[13] * determinantNumerical(...threeByThree2);
    const threeByThree3 =
      /** @type {[number, number, number, number, number, number, number, number, number]} */ ([
        ...args.slice(0, 2),
        ...args.slice(3, 6),
        ...args.slice(7, 10),
        ...args.slice(11, 12),
      ]);
    const c = argsNum[14] * determinantNumerical(...threeByThree3);
    const threeByThree4 =
      /** @type {[number, number, number, number, number, number, number, number, number]} */ ([
        ...args.slice(0, 3),
        ...args.slice(4, 7),
        ...args.slice(8, 11),
      ]);
    const d = argsNum[15] * determinantNumerical(...threeByThree4);
    return -a + b - c + d;
  }
  throw new Error(
    `determinant of a matrix of size other than 2x2 or 3x3 is not supported. size ${args.length} received.`
  );
}
