import { Rational } from './rationalClass';
import { solveQuadratic, solveLinear } from '../polynomialMethods';
import { Fraction, Polynomial } from '../core';

/**
 * solves a rational inequality lhs < rhs
 * @param rhs defaults to `0`
 * @param options defaults to `{lessThan: true, equality: false}`
 *
 * only works for square free polynomials of degree at most 2
 */
export function solveRational(
	lhs: Rational,
	rhs: number | Fraction | Polynomial | Rational = 0,
	options?: { lessThan?: boolean; equality?: boolean },
): {
	combinedAnswer: string;
	intervals: string[];
	values: Fraction[];
} {
	const values: Fraction[] = [];
	const intervals: string[] = [];
	let combinedAnswer: string;
	// set up inequality
	let rational = lhs.minus(rhs);
	const x = rational.num.variable;
	const equality = options?.equality ?? false;
	let lessThan = options?.lessThan ?? true;
	if (
		rational.num.coeffs[rational.num.coeffs.length - 1]
			.times(rational.den.coeffs[rational.den.coeffs.length - 1])
			.isLessThan(0)
	) {
		rational = rational.negative();
		lessThan = !lessThan;
	}
	// zeros
	if (rational.num.degree === 1) {
		values.push(solveLinear(rational.num));
	} else if (rational.num.degree === 2) {
		const roots = solveQuadratic(rational.num);
		if (roots[0] instanceof Fraction) {
			values.push(roots[0], <Fraction>roots[1]);
		}
	} else if (rational.num.degree > 2) {
		throw new Error(`numerator of degree more than 2 not supported ${rational.num}`);
	}
	// poles
	values.push(...rational.poles);
	// sort critical values
	values.sort((a, b) => a.minus(b).valueOf());
	if (values.length === 1) {
		let sign: string;
		if (equality && !rational.den.subIn(values[0]).isEqualTo(0)) {
			sign = lessThan ? '\\leq' : '\\geq';
		} else {
			sign = lessThan ? '<' : '>';
		}
		intervals.push(`${x} ${sign} ${values[0]}`);
		combinedAnswer = `${intervals[0]}.`;
	} else if (values.length === 2) {
		if (lessThan) {
			const sign1 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? '<' : '\\leq';
			const sign2 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? '<' : '\\leq';
			intervals.push(`${values[0]} ${sign1} ${x} ${sign2} ${values[1]}`);
			combinedAnswer = `${intervals[0]}.`;
		} else {
			const sign1 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? '<' : '\\leq';
			const sign2 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? '>' : '\\geq';
			intervals.push(`${x} ${sign1} ${values[0]}`, `${x} ${sign2} ${values[1]}`);
			combinedAnswer = `{${intervals[0]}} \allowbreak \\textrm{ or } {${intervals[1]}.}`;
		}
	} else if (values.length === 3) {
		if (lessThan) {
			const sign1 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? '<' : '\\leq';
			const sign2 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? '<' : '\\leq';
			const sign3 = !equality || rational.den.subIn(values[2]).isEqualTo(0) ? '<' : '\\leq';
			intervals.push(`${x} ${sign1} ${values[0]}`, `${values[1]} ${sign2} ${x} ${sign3} ${values[2]}`);
			combinedAnswer = `{${intervals[0]}} \\allowbreak \\textrm{ or } {${intervals[1]}.}`;
		} else {
			const sign1 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? '<' : '\\leq';
			const sign2 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? '<' : '\\leq';
			const sign3 = !equality || rational.den.subIn(values[2]).isEqualTo(0) ? '>' : '\\geq';
			intervals.push(`${values[0]} ${sign1} ${x} ${sign2} ${values[1]}`, `${x} ${sign3} ${values[2]}`);
			combinedAnswer = `{${intervals[0]}} \\allowbreak \\textrm{ or } {${intervals[1]}.}`;
		}
	} else if (values.length === 4) {
		if (lessThan) {
			const sign1 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? '<' : '\\leq';
			const sign2 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? '<' : '\\leq';
			const sign3 = !equality || rational.den.subIn(values[2]).isEqualTo(0) ? '<' : '\\leq';
			const sign4 = !equality || rational.den.subIn(values[3]).isEqualTo(0) ? '<' : '\\leq';
			intervals.push(
				`${values[0]} ${sign1} ${x} ${sign2} ${values[1]}`,
				`${values[2]} ${sign3} ${x} ${sign4} ${values[3]}`,
			);
			combinedAnswer = `{${intervals[0]}} \\allowbreak \\textrm{ or } {${intervals[1]}.}`;
		} else {
			const sign1 = !equality || rational.den.subIn(values[0]).isEqualTo(0) ? '<' : '\\leq';
			const sign2 = !equality || rational.den.subIn(values[1]).isEqualTo(0) ? '<' : '\\leq';
			const sign3 = !equality || rational.den.subIn(values[2]).isEqualTo(0) ? '<' : '\\leq';
			const sign4 = !equality || rational.den.subIn(values[3]).isEqualTo(0) ? '>' : '\\geq';
			intervals.push(
				`${x} ${sign1} ${values[0]}`,
				`${values[1]} ${sign2} ${x} ${sign3} ${values[2]}`,
				`${x} ${sign4} ${values[3]}`,
			);
			combinedAnswer = `{${intervals[0]},} \\; \\allowbreak {${intervals[1]}} \\allowbreak \\textrm{ or } {${intervals[2]}.}`;
		}
	} else {
		throw new Error(`we currently do not support this inequality with critical values ${values}`);
	}
	return {
		combinedAnswer,
		intervals,
		values,
	};
}
