export function quotientRuleWorking(quotient: RationalFn, options?: {
    aligned?: boolean | undefined;
    step2Preamble?: string | undefined;
} | undefined): {
    y: RationalFn;
    dydx: RationalFn;
    num: Polynomial;
    den: Polynomial;
    denPow: Fraction;
    working: string;
};
export function quotientRuleWorking(quotient: Polynomial, options: {
    den: Polynomial | number | Fraction | [Polynomial, number | Fraction];
    aligned?: boolean | undefined;
    step2Preamble?: string | undefined;
}): {
    y: RationalFn;
    dydx: RationalFn;
    num: Polynomial;
    den: Polynomial;
    denPow: Fraction;
    working: string;
};
import { RationalFn } from "../../calculus/index.js";
import { Polynomial } from "../../core/index.js";
import { Fraction } from "../../core/index.js";
//# sourceMappingURL=quotient-rule.d.ts.map