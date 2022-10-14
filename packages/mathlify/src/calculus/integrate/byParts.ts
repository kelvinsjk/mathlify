import { PowerFn, CosFn, SinFn, ExpFn } from '../classes';
import { Expression, Term, Fraction, numberToFraction } from '../../core';
import { Angle, cos, sin } from '../../trigo';

/**
 * integration by parts:
 * (1a) x^n cos x
 * (1b) x^n sin x
 * (1c) x^n exp x
 */
export function byParts(u: PowerFn, vPrime: CosFn | SinFn | ExpFn): Expression {
	if (u instanceof PowerFn) {
		if (vPrime instanceof CosFn || vPrime instanceof SinFn || vPrime instanceof ExpFn) {
			return powerTrigo(u, vPrime);
		}
	}
	throw new Error(`integration type not supported`);
}

function powerTrigo(u: PowerFn, vPrime: CosFn | SinFn | ExpFn, firstTerms?: Expression, sign = 1): Expression {
	if (!u.n.isInteger() || u.n.isLessThan(0)) {
		throw new Error(`power ${u.n} not supported`);
	}
	const v = vPrime.integrate();
	if (u.n.isEqualTo(0)) {
		const vTerm = new Term(v.coeff, u.coeff, `${v.removeCoeff()}`);
		return firstTerms ? firstTerms.plus(vTerm.times(sign)) : new Expression(vTerm);
	}
	const uPrime = u.differentiate().power;
	const uvTerm = new Term(u.coeff, v.coeff, `${u.removeCoeff()}`, `${v.removeCoeff()}`);
	const frontTerms = firstTerms ? firstTerms.plus(uvTerm.times(sign)) : new Expression(uvTerm);
	return powerTrigo(uPrime, v, frontTerms, sign * -1);
}

/**
 * integration by parts:
 * (1a) x^n cos x
 * (1b) x^n sin x
 * (1c) x^n exp x
 */
export function byPartsD(
	u: PowerFn,
	vPrime: CosFn | SinFn,
	lower: number | Fraction | Angle,
	upper: number | Fraction | Angle,
): Expression;
export function byPartsD(u: PowerFn, vPrime: ExpFn, lower: number | Fraction, upper: number | Fraction): Expression;
export function byPartsD(
	u: PowerFn,
	vPrime: CosFn | SinFn | ExpFn,
	lower: number | Fraction | Angle,
	upper: number | Fraction | Angle,
): Expression {
	if (u instanceof PowerFn) {
		if (vPrime instanceof CosFn || vPrime instanceof SinFn) {
			return powerTrigoD(u, vPrime, lower, upper);
		} else if (vPrime instanceof ExpFn) {
			return powerExpD(u, vPrime, lower as number | Fraction, upper as number | Fraction);
		}
	}
	throw new Error(`integration type not supported`);
}

function powerTrigoD(
	u: PowerFn,
	vPrime: CosFn | SinFn,
	lower: number | Fraction | Angle,
	upper: number | Fraction | Angle,
	firstTerms?: Expression,
	sign = 1,
): Expression {
	if (!u.n.isInteger() || u.n.isLessThan(0)) {
		throw new Error(`power ${u.n} not supported`);
	}
	const v = vPrime.integrate();
	const vTermLower = (v instanceof CosFn ? cos(lower) : sin(lower)).times(v.coeff);
	const vTermUpper = (v instanceof CosFn ? cos(upper) : sin(upper)).times(v.coeff);
	if (u.n.isEqualTo(0)) {
		return firstTerms
			? firstTerms.plus(vTermUpper.times(sign).times(u.coeff)).minus(vTermLower.times(sign).times(u.coeff))
			: new Expression(vTermUpper, vTermLower.negative());
	}
	const uPrime = u.differentiate().power;
	lower = new Angle(lower instanceof Angle ? lower.k : lower, { domain: 'all' });
	upper = new Angle(upper instanceof Angle ? upper.k : upper, { domain: 'all' });
	const uTermLower = new Term(u.coeff, lower.k.pow(u.n.num), u.n.isEqualTo(1) ? `\\pi` : `\\pi^{${u.n}}`);
	const uTermUpper = new Term(u.coeff, upper.k.pow(u.n.num), u.n.isEqualTo(1) ? `\\pi` : `\\pi^{${u.n}}`);
	const uvTermUpper = uTermUpper.times(vTermUpper);
	const uvTermLower = uTermLower.times(vTermLower);
	const frontTerms = firstTerms
		? firstTerms.plus(uvTermUpper.times(sign)).minus(uvTermLower.times(sign))
		: new Expression(uvTermUpper, uvTermLower.negative());
	return powerTrigoD(uPrime, v, lower, upper, frontTerms, sign * -1);
}
function powerExpD(
	u: PowerFn,
	vPrime: ExpFn,
	lower: number | Fraction,
	upper: number | Fraction,
	firstTerms?: Expression,
	sign = 1,
): Expression {
	if (!u.n.isInteger() || u.n.isLessThan(0)) {
		throw new Error(`power ${u.n} not supported`);
	}
	lower = numberToFraction(lower);
	upper = numberToFraction(upper);
	const v = vPrime.integrate();
	const vTermUpper = upper.isEqualTo(0)
		? new Term(v.coeff)
		: new Term(v.coeff, upper.isEqualTo(1) ? `\\mathrm{e}` : `\\mathrm{e}^{${upper}}`);
	const vTermLower = lower.isEqualTo(0)
		? new Term(v.coeff)
		: new Term(v.coeff, lower.isEqualTo(1) ? `\\mathrm{e}` : `\\mathrm{e}^{${lower}}`);
	if (u.n.isEqualTo(0)) {
		return firstTerms
			? firstTerms.plus(vTermUpper.times(sign).times(u.coeff)).minus(vTermLower.times(sign).times(u.coeff))
			: new Expression(vTermUpper, vTermLower.negative());
	}
	const uPrime = u.differentiate().power;
	const uvTermUpper = vTermUpper.times(u.subIn(upper));
	const uvTermLower = vTermLower.times(u.subIn(lower));
	const frontTerms = firstTerms
		? firstTerms.plus(uvTermUpper.times(sign)).minus(uvTermLower.times(sign))
		: new Expression(uvTermUpper, uvTermLower.negative());
	return powerExpD(uPrime, v, lower, upper, frontTerms, sign * -1);
}
