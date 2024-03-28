export namespace solvers {
    function zeroProduct(exp: import("../../../core").Expression | Equation, variable?: string | undefined): {
        working: string;
        cols: number;
        roots: import("../../../core").Expression[];
    };
    /**
     * @param {Expression|Polynomial|Equation} exp
     * @param {string} [variable='x'] - we will use variable if exp not of Polynomial class
     * @param {{hideFirstLine?: boolean, aligned?: boolean}} [options]
     * @returns {{factorizationWorking: EquationWorking, rootsWorking:string, cols: number, roots: Expression[]}}
     */
    function quadratic(exp: import("../../../core").Expression | import("../../../core").Polynomial | Equation, variable?: string | undefined, options?: {
        hideFirstLine?: boolean | undefined;
        aligned?: boolean | undefined;
    } | undefined): {
        factorizationWorking: EquationWorking;
        rootsWorking: string;
        cols: number;
        roots: import("../../../core").Expression[];
    };
}
export type Polynomial = import('../../../core').Polynomial;
export type Expression = import('../../../core').Expression;
import { Equation } from '../../../equation/index';
import { EquationWorking } from '../eqn-working/index.js';
//# sourceMappingURL=index.d.ts.map