/**
 * gets a random fraction
 * @param  {RandomFracOptions} [options] - defaults to {numRange: [-9,9], denRange: [1,9], avoid: [0], allowInt: true}
 * @returns {Fraction} a random fraction
 */
export function getRandomFrac(options?: RandomFracOptions | undefined): Fraction;
/**
 * get n random fractions
 * @param {number} n
 * @param {RandomFracsOptions} [options] - defaults to {numRange: [-9,9], denRange: [1,9], avoid: [], allowInt: true, allowReps: true}
 * @returns {Fraction[]} - n random integers
 */
export function getRandomFracs(n: number, options?: RandomFracsOptions | undefined): Fraction[];
export type RandomFracOptions = {
    /**
     * - bounds (inclusive) for the numerator. defaults to [-9,9].
     */
    numRange?: [number, number] | undefined;
    /**
     * - bounds (inclusive) for the denominator. defaults to [1,9].
     */
    denRange?: [number, number] | undefined;
    /**
     * - numbers/fractions to avoid
     */
    avoid?: number | Fraction | (number | Fraction)[] | undefined;
    /**
     * - allow integer return. defaults to true
     */
    allowInt?: boolean | undefined;
};
export type RandomFracsOptions = {
    /**
     * - bounds (inclusive) for the numerator. defaults to [-9,9].
     */
    numRange?: [number, number] | undefined;
    /**
     * - bounds (inclusive) for the denominator. defaults to [1,9].
     */
    denRange?: [number, number] | undefined;
    /**
     * - numbers/fractions to avoid
     */
    avoid?: number | Fraction | (number | Fraction)[] | undefined;
    /**
     * - allow integers to be returned. defaults to true
     */
    allowInt?: boolean | undefined;
    /**
     * - allow repetition: defaults to true
     */
    allowReps?: boolean | undefined;
};
import { Fraction } from "../core/index.js";
//# sourceMappingURL=getRandomFrac.d.ts.map