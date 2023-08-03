/** Constant class
 * @property {string} identifier - the identifier of this constant (eg 'pi')
 * @property {string} string - the LaTeX string representation of this constant (eg '\\pi')
 * @property {number|undefined} x - the value of this constant in JS number format (can be undefined)
 * @property {"constant"} kind - mathlify constant class
 */
export class Constant {
    /**
     * Creates a Constant instance, which is made up of
     * @param {string} identifier - the string representation of this constant (eg '\\pi')
     * @param {ConstantOptions} [options] - `options to allow a LaTeX string (defaults to identifier),
     * and a number value (defaults to undefined)
     *
     * // TODO: UnknownConstant that allows morphing to a Fraction or Variable?
     */
    constructor(identifier: string, options?: ConstantOptions | undefined);
    identifier: string;
    string: string;
    value: number | undefined;
    kind: string;
    /**
     * casts this constant as a number (might be undefined)
     * @returns {number|undefined} this constant in js number primitive type (might be undefined)
     */
    valueOf(): number | undefined;
    /**
     * casts this constant as a latex string
     * @returns {string} the latex string representation of this constant
     */
    toString(): string;
    /**
     * @typedef {Object} ConstantJSON
     * @property {string} kind - 'constant'
     * @property {string} identifier - identifier
     * @property {string} string - LaTeX string
     * @property {number|undefined} value - value
     * @property {[string, {string: string, value: number|undefined}]} args - array of arguments to reconstruct current constant
     */
    /**
     * serializes object. can be used with the static
     * `Constant.FromJSON` method to recreate this
     * class instance
     * @returns {ConstantJSON}
     */
    toJSON(): {
        /**
         * - 'constant'
         */
        kind: string;
        /**
         * - identifier
         */
        identifier: string;
        /**
         * - LaTeX string
         */
        string: string;
        /**
         * - value
         */
        value: number | undefined;
        /**
         * - array of arguments to reconstruct current constant
         */
        args: [string, {
            string: string;
            value: number | undefined;
        }];
    };
}
export type ConstantOptions = {
    /**
     * - the LaTeX string representation of this constant (eg '\\pi')
     */
    string?: string | undefined;
    /**
     * - the value of this constant in JS number format (can be undefined)
     */
    value?: number | undefined;
};
//# sourceMappingURL=constant.d.ts.map