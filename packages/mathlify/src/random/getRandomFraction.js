import { Fraction } from "../core/fraction.js";
import { getRandomInt } from "./getRandomInt.js";

/**
 * gets a random fraction
 * @param  {RandomFracOptions} [options] - defaults to {numRange: [-9,9], denRange: [1,9], avoid: [0], allowInt: true}
 * @returns {Fraction} a random fraction
 */
export function getRandomFraction(options) {
  const { numRange, denRange, avoid, allowInt } = {
    numRange: [-9, 9],
    denRange: [1, 9],
    avoid: [0],
    allowInt: true,
    ...options,
  };
  const avoidArr = Array.isArray(avoid) ? avoid : [avoid];
  let randomFrac = new Fraction(
    getRandomInt({ min: numRange[0], max: numRange[1] }),
    getRandomInt({
      min: denRange[0],
      max: denRange[1],
      avoid: 0,
    })
  );
  while (
    avoidArr.some((x) => randomFrac.is.equalTo(x)) ||
    (!allowInt && randomFrac.is.integer())
  ) {
    randomFrac = new Fraction(
      getRandomInt({ min: numRange[0], max: numRange[1] }),
      getRandomInt({
        min: denRange[0],
        max: denRange[1],
        avoid: 0,
      })
    );
  }
  return randomFrac;
}
/**
 * get n random fractions
 * @param {number} n
 * @param {RandomFracsOptions} [options] - defaults to {numRange: [-9,9], denRange: [1,9], avoid: [], allowInt: true, allowReps: true}
 * @returns {Fraction[]} - n random integers
 */
export function getRandomFractions(n, options) {
  const { avoid, allowReps } = {
    avoid: [],
    allowReps: true,
    ...options,
  };
  const avoidArr = Array.isArray(avoid) ? avoid : [avoid];
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error(
      `invalid ${n} received for getRandomInts. Only positive integers allowed`
    );
  }
  /** @type {Fraction[]} */
  const randomFracs = [];
  while (randomFracs.length < n) {
    let randomInt = getRandomFraction(options);
    randomFracs.push(randomInt);
    if (!allowReps) {
      avoidArr.push(randomInt);
      options = {
        ...options,
        avoid: avoidArr,
      };
    }
  }
  return randomFracs;
}

/**
 * @typedef {Object} RandomFracOptions
 * @property {[number, number]} [numRange=[-9,9]] - bounds (inclusive) for the numerator. defaults to [-9,9].
 * @property {[number, number]} [denRange=[1,9]] - bounds (inclusive) for the denominator. defaults to [1,9].
 * @property {number|Fraction|(number|Fraction)[]} [avoid] - numbers/fractions to avoid
 * @property {boolean} [allowInt] - allow integer return. defaults to true
 */

/**
 * @typedef {Object} RandomFracsOptions
 * @property {[number, number]} [numRange=[-9,9]] - bounds (inclusive) for the numerator. defaults to [-9,9].
 * @property {[number, number]} [denRange=[1,9]] - bounds (inclusive) for the denominator. defaults to [1,9].
 * @property {number|Fraction|(number|Fraction)[]} [avoid] - numbers/fractions to avoid
 * @property {boolean} [allowInt] - allow integers to be returned. defaults to true
 * @property {boolean} [allowReps] - allow repetition: defaults to true
 */
