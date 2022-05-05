import { binomCdf, binomCdfRange, binomPdf } from './binomial';
import type { Fraction } from 'mathlify';

export function binomialAssumptions(
	event1: string,
	trial: string,
	event2: string,
): [string, string] {
	return [
		`The probability of ${event1} is the same for each ${trial}`,
		`${event2} is independent of any other ${trial}`,
	];
}

export class Binomial {
	n: number;
	p: number | Fraction;
	variable: string;

	constructor(n: number, p: number | Fraction, variable = 'X') {
		this.n = n;
		this.p = p;
		this.variable = variable;
	}

	/**
	 * @returns [working, ans];
	 */
	cdfWorking(
		x: number,
		sign: '\\leq' | '\\geq' | '<' | '>' = '\\leq',
		workingMode = false,
	): [string, number] {
		return binomialCDFWorking(this.n, this.p.valueOf(), x, {
			sign,
			variable: this.variable,
			workingMode,
		});
	}

	cdfRangeWorking(
		x1: number,
		x2: number,
		sign1: '\\leq' | '<' = '\\leq',
		sign2: '<' | '\\leq' = '\\leq',
		workingMode = false,
	): [string, number] {
		return binomialCdfRangeWorking(this.n, this.p.valueOf(), x1, x2, {
			sign1,
			sign2,
			variable: this.variable,
			workingMode,
		});
	}

	pdfWorking(x: number, workingMode = false): [string, number] {
		const prob = binomPdf(this.n, this.p.valueOf(), x);
		let probString = `${prob}`.length > 5 ? `${prob.toPrecision(3)}` : `${prob}`;
		if (workingMode) {
			probString = prob.toPrecision(5);
		}
		return [`\\mathrm{P}(${this.variable}=${x}) &= ${probString}`, prob];
	}

	toString(): string {
		return `${this.variable} \\sim \\textrm{B}\\left(${this.n}, ${this.p}\\right)`;
	}

	static pdfFormula(n = 'n', p = 'p', x = 'x'): string {
		return `{${n} \\choose ${x}} ${n}^{${x}} (1-${p})^{${n}-${x}}`;
	}
}

function binomialCDFWorking(
	n: number,
	p: number,
	x: number,
	options?: { sign?: '\\leq' | '\\geq' | '<' | '>'; variable?: string; workingMode?: boolean },
): [string, number] {
	const { sign, variable, workingMode } = {
		sign: '\\leq',
		variable: 'X',
		workingMode: false,
		...options,
	};
	if (sign === `\\leq`) {
		const prob = binomCdf(n, p, x);
		let probString = `${prob}`.length > 5 ? `${prob.toPrecision(3)}` : `${prob}`;
		if (workingMode) {
			probString = prob.toPrecision(5);
		}
		return [`\\mathrm{P}(${variable} \\leq ${x}) &= ${probString}`, prob];
	} else if (sign === `<`) {
		const prob = binomCdf(n, p, x - 1);
		let probString = `${prob}`.length > 5 ? `${prob.toPrecision(3)}` : `${prob}`;
		if (workingMode) {
			probString = prob.toPrecision(5);
		}
		return [
			`\\mathrm{P}(${variable} < ${x}) &= \\mathrm{P}(${variable}\\leq ${
				x - 1
			})  \\\\ &= ${probString}`,
			prob,
		];
	} else if (sign === `>`) {
		const prob = 1 - binomCdf(n, p, x);
		let probString = `${prob}`.length > 5 ? `${prob.toPrecision(3)}` : `${prob}`;
		if (workingMode) {
			probString = prob.toPrecision(5);
		}
		return [
			`\\mathrm{P}(${variable} > ${x}) &= 1 - \\mathrm{P}(${variable}\\leq ${x})  \\\\ &= ${probString}`,
			prob,
		];
	} else {
		const prob = 1 - binomCdf(n, p, x - 1);
		let probString = `${prob}`.length > 5 ? `${prob.toPrecision(3)}` : `${prob}`;
		if (workingMode) {
			probString = prob.toPrecision(5);
		}
		return [
			`\\mathrm{P}(${variable} \\geq ${x}) &= 1 - \\mathrm{P}(${variable}\\leq ${
				x - 1
			})  \\\\ &= ${probString}`,
			prob,
		];
	}
}

function binomialCdfRangeWorking(
	n: number,
	p: number,
	x1: number,
	x2: number,
	options?: {
		sign1?: '\\leq' | '<';
		sign2?: '\\leq' | '<';
		variable?: string;
		workingMode?: boolean;
	},
): [string, number] {
	const { sign1, sign2, variable, workingMode } = {
		sign1: '\\leq',
		sign2: '\\leq',
		variable: 'X',
		workingMode: false,
		...options,
	};
	if (sign1 === `\\leq` && sign2 === `\\leq`) {
		const prob = binomCdfRange(n, p, x1, x2);
		let probString = `${prob}`.length > 5 ? `${prob.toPrecision(3)}` : `${prob}`;
		if (workingMode) {
			probString = prob.toPrecision(5);
		}
		return [
			`& \\mathrm{P}(${x1} ${sign1} ${variable} ${sign2} ${x2}) \\\\
			&= \\mathrm{P}(${variable} \\leq ${x2}) - \\mathrm{P}(${variable} \\leq ${x1 - 1})
		\\\\ &= ${probString}`,
			prob,
		];
	} else if (sign1 === `<` && sign2 === `\\leq`) {
		const prob = binomCdfRange(n, p, x1 + 1, x2);
		let probString = `${prob}`.length > 5 ? `${prob.toPrecision(3)}` : `${prob}`;
		if (workingMode) {
			probString = prob.toPrecision(5);
		}
		return [
			`& \\mathrm{P}(${x1} ${sign1} ${variable} ${sign2} ${x2}) \\\\
			&= \\mathrm{P}(${variable} \\leq ${x2}) - \\mathrm{P}(${variable} \\leq ${x1})
		\\\\ &= ${probString}`,
			prob,
		];
	} else if (sign1 === `\\leq` && sign2 === `<`) {
		const prob = binomCdfRange(n, p, x1, x2 - 1);
		let probString = `${prob}`.length > 5 ? `${prob.toPrecision(3)}` : `${prob}`;
		if (workingMode) {
			probString = prob.toPrecision(5);
		}
		return [
			`& \\mathrm{P}(${x1} ${sign1} ${variable} ${sign2} ${x2}) \\\\
			&= \\mathrm{P}(${variable} \\leq ${x2 - 1}) - \\mathrm{P}(${variable} \\leq ${x1 - 1})
		\\\\ &= ${probString}`,
			prob,
		];
	} else {
		// < <
		const prob = binomCdfRange(n, p, x1 + 1, x2 - 1);
		let probString = `${prob}`.length > 5 ? `${prob.toPrecision(3)}` : `${prob}`;
		if (workingMode) {
			probString = prob.toPrecision(5);
		}
		return [
			`& \\mathrm{P}(${x1} ${sign1} ${variable} ${sign2} ${x2}) \\\\
			&= \\mathrm{P}(${variable} \\leq ${x2 - 1}) - \\mathrm{P}(${variable} \\leq ${x1})
		\\\\ &= ${probString}`,
			prob,
		];
	}
}
