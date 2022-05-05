import { Fraction, Polynomial } from 'mathlify';
import { ReciprocalTerm } from './reciprocalTermClass';
import { solveLinear } from '../polynomials';

/**
 * applies cover up rule to get partial fraction decomposition of
 * N(x) / (D_1(x) D_2(x) ... D_n(x))
 * where D_i(x) are linear Polynomials and
 *
 * WARNING: we do not check for proper fractions: use with care
 */
export function partialFractions(
	denominators: Polynomial[],
	numerator: number | Fraction | Polynomial = 1,
): ReciprocalTerm[] {
	if (denominators.length === 0) {
		throw new Error('Cannot partial fractions with empty denominator');
	}
	if (typeof numerator === 'number' || numerator instanceof Fraction) {
		numerator = new Polynomial([numerator], { variableAtom: denominators[0].variableAtom });
	}
	const reciprocalTerms: ReciprocalTerm[] = [];
	denominators.forEach((denominator, i) => {
		const x = solveLinear(denominator);
		const k = (<Polynomial>numerator).subXAs(x);
		const coeff = denominators
			.filter((_, j) => j !== i)
			.reduce((prev, curr) => prev.divide(curr.subXAs(x)), k);
		reciprocalTerms.push(new ReciprocalTerm(coeff, denominator));
	});
	return reciprocalTerms;
}
