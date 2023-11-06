export function quotientRuleWorking(quotient: Polynomial, options: {
    den: Polynomial | number | Fraction | [Polynomial, number | Fraction];
    aligned?: boolean | undefined;
}): {
    y: RationalFn;
    dydx: RationalFn;
    num: Polynomial;
    den: Polynomial;
    denPow: Fraction;
    working: string;
};
export function quotientRuleWorking(quotient: RationalFn, options?: {
    aligned?: boolean | undefined;
} | undefined): {
    y: RationalFn;
    dydx: RationalFn;
    num: Polynomial;
    den: Polynomial;
    denPow: Fraction;
    working: string;
};
import { Polynomial } from '../../core/index.js';
import { Fraction } from '../../core/index.js';
import { RationalFn } from '../../calculus/index.js';
//# sourceMappingURL=quotient-rule.d.ts.map