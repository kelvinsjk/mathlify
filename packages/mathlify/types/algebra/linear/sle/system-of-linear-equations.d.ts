/**
 * SLE class representing a system of linear equations
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @property {Fraction[][]} coeffs - coefficient matrix
 * @property {Fraction[]} values - the values on the right hand side
 * @property {string[]} variables - the variables
 * @property {"off"|"align"|"alignat"} alignMode - whether the equations are aligned (using align or alignat) or not (using gather)
 * @property {number} alignatArg - the number of columns to align at (only used if alignMode is "alignat")
 */
export class SLE {
    /**
     * constructor
     * @param {(number|Fraction)[][]} coeffs - the linear expressions (or coefficient matrix)
     * @param {(number|Fraction)[]} values - the right hand side of the equation
     * @param {{alignMode?: "off"|"align"|"alignat", variables?: string[]}} [options] - options object defaulting to `{alignMode: "alignat", variables: ['x', 'y', 'z', 'w']}`
     */
    constructor(coeffs: (number | Fraction)[][], values: (number | Fraction)[], options?: {
        alignMode?: "off" | "align" | "alignat" | undefined;
        variables?: string[] | undefined;
    } | undefined);
    /** @type {Fraction[][]} */
    coeffs: Fraction[][];
    /** @type {Fraction[]} */
    values: Fraction[];
    /** @type {"off"|"align"|"alignat"} */
    alignMode: "off" | "align" | "alignat";
    /** @type {number} */
    alignatArg: number;
    variables: string[];
    /**
     * returns a string representation of the SLE to be fed into a LaTeX align/align* / gather/gather* environment
     */
    toString(): string;
    /**
     * solves the system of linear equations, returning an array of strings "x = ..."
     * @returns {string[]} array of strings representing the solutions of the system of linear equations
     */
    solve(): string[];
}
/**
 * SLE class representing a system of linear equations
 * to plugged into a LaTeX align/align* /gather/gather* environment
 * @class
 * @property {number[][]} coeffs - coefficient matrix
 * @property {number[]} values - the values on the right hand side
 * @property {string[]} variables - the variables
 * @property {"off"|"align"|"alignat"} alignMode - whether the equations are aligned (using align or alignat) or not (using gather)
 * @property {number} toFixed - the number of decimal places to round to
 * @property {number} alignatArg - the number of columns to align at (only used if alignMode is "alignat")
 */
export class SLENumerical {
    /**
     * constructor
     * @param {(number|Fraction)[][]} coeffs - the linear expressions (or coefficient matrix)
     * @param {(number|Fraction)[]} values - the right hand side of the equation
     * @param {{alignMode?: "off"|"align"|"alignat", variables?: string[], toFixed?: number}} [options] - options object defaulting to `{alignMode: "alignat", variables: ['x', 'y', 'z', 'w'], toFixed: 2}`
     */
    constructor(coeffs: (number | Fraction)[][], values: (number | Fraction)[], options?: {
        alignMode?: "off" | "align" | "alignat" | undefined;
        variables?: string[] | undefined;
        toFixed?: number | undefined;
    } | undefined);
    /** @type {number[][]} */
    coeffs: number[][];
    /** @type {number[]} */
    values: number[];
    /** @type {"off"|"align"|"alignat"} */
    alignMode: "off" | "align" | "alignat";
    /** @type {number} */
    toFixed: number;
    /** @type {number} */
    alignatArg: number;
    variables: string[];
    /**
     * returns a string representation of the SLE to be fed into a LaTeX align/align* / gather/gather* environment
     */
    toString(): string;
    /**
     * solves the system of linear equations, returning an array of strings "x = ..."
     * @returns {string[]} array of strings representing the solutions of the system of linear equations
     */
    solve(): string[];
}
import { Fraction } from "../../../core/index.js";
//# sourceMappingURL=system-of-linear-equations.d.ts.map