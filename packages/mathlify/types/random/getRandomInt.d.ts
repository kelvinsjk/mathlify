/**
 * gets a random integer
 * @param  {RandomIntOptions} [options] - defaults to {min: -9, max: 9, avoid: []}
 * @returns {number} a random integer between min and max (inclusive)
 */
export function getRandomInt(options?: RandomIntOptions | undefined): number;
/**
 * get n random integers
 * @param {number} n
 * @param {RandomIntsOptions} [options] - defaults to {min: -9, max: 9, avoid: [], allowReps: true}
 * @returns {number[]} - n random integers
 */
export function getRandomInts(n: number, options?: RandomIntsOptions | undefined): number[];
export type RandomIntOptions = {
    /**
     * - lower bound (inclusive). defaults to -9.
     */
    min?: number | undefined;
    /**
     * - upper bound (inclusive). defaults to 9
     */
    max?: number | undefined;
    /**
     * - numbers to avoid
     */
    avoid?: number | number[] | undefined;
};
export type RandomIntsOptions = {
    /**
     * - lower bound (inclusive). defaults to -9.
     */
    min?: number | undefined;
    /**
     * - upper bound (inclusive). defaults to 9
     */
    max?: number | undefined;
    /**
     * - numbers to avoid
     */
    avoid?: number | number[] | undefined;
    /**
     * - allow repetition: defaults to true
     */
    allowReps?: boolean | undefined;
};
//# sourceMappingURL=getRandomInt.d.ts.map