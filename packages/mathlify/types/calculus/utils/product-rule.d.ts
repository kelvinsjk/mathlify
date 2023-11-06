export function productRulePoly(t1: [Polynomial, number | Fraction] | Polynomial, t2: [Polynomial, number | Fraction] | Polynomial, options?: {
    quotientMode?: boolean | undefined;
    polyReturn: true;
} | undefined): Polynomial;
export function productRulePoly(t1: [Polynomial, number | Fraction] | Polynomial, t2: [Polynomial, number | Fraction] | Polynomial, options?: {
    quotientMode?: boolean | undefined;
} | undefined): ExpressionProduct;
export type Fraction = import('../../core/index.js').Fraction;
export type Polynomial = import('../../core/index.js').Polynomial;
import { ExpressionProduct } from '../../algebra/index.js';
//# sourceMappingURL=product-rule.d.ts.map