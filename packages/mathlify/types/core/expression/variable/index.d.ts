/**
 * Variable Class
 * @property {string} name - the string representation of the variable
 * */
export class Variable {
    /**
     * @constructor
     * Creates a Variable
     * @param {string} name - the string representation of the variable
     */
    constructor(name: string);
    /** @type {'variable'} */
    type: 'variable';
    name: string;
    /**
     * @returns {string} `this.name`
     */
    toString(): string;
    /** @returns {string} */
    toLexicalString(): string;
    /**
     * @returns {Variable}
     */
    clone(): Variable;
    /**
     * @param {string} variable
     * @returns {boolean}
     */
    contains(variable: string): boolean;
}
//# sourceMappingURL=index.d.ts.map