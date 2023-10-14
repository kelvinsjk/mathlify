import { PageContent } from '$lib';
import { sample, sampleSize, shuffle } from 'lodash-es';
import { math, newline } from 'mathlifier';
import { parts } from '$lib/typesetting/parts';
import { SquareRoot, Term } from 'mathlify';
import { surdBases, surdCoeffs } from '../../utils';

export const title = 'Simplifying Surds via Division';

const page = new PageContent();
// intro
page.display(`\\sqrt{\\frac{4}{9}} = \\frac{\\sqrt{4}}{\\sqrt{9}}`);
page.text(`In this section, we will investigate the division rule
	for surds and radicals, which behave very similarly to the multiplication rule
	from the previous section.
.`);

// example
page.iExample(exampleGen, exampleArgs, {
	initialArgs: [18, [6, 2], 3, [2, 1, 10, 1]],
	plural: true,
});
[2, 1, 10, 1];
// practice
const preamble = `Simplify the surds below using the multiplication rule.`;
page.iQn(qnGen, qnArgs, {
	preamble,
	initialArgs: [
		{ type: 1, param: 8 },
		{ type: 1, param: 63 },
		{ type: 1, param: 75 },
		{ type: 2, param: [3, 15] },
		{ type: 4, param: [2, 1, 8, 1] },
		{ type: 4, param: [10, 3, 15, 2] },
	],
});

export const content = page.content;

function exampleGen(
	param1: number,
	param2: [number, number],
	param3: number,
	param4: [number, number, number, number]
): string {
	const { ans: q1 } = q1Gen(param1);
	const { ans: q2 } = q2Gen(...param2);
	const { ans: q3 } = q3Gen(param3);
	const { ans: q4 } = q4Gen(...param4);
	return parts(q1, q2, q3, q4);
}

function exampleArgs(): Parameters<typeof exampleGen> {
	// q1
	const [base1, base2] = sampleSize(surdBases, 2);
	const coeff1 = sample(surdCoeffs[base1].slice(1));
	if (coeff1 === undefined) {
		throw new Error('undefined sampling');
	}
	const param1 = coeff1 ** 2 * base1;
	// q2
	let coeff2 = sample(surdCoeffs[base2].slice(1));
	while (coeff2 === base2 || new SquareRoot(coeff2 ?? 1).radicand.is.one()) {
		coeff2 = sample(surdCoeffs[base2].slice(1));
	}
	if (coeff2 === undefined) {
		throw new Error('undefined sampling');
	}
	const [a, b] = shuffle([coeff2 * base2, coeff2]);
	const param2: [number, number] = [a, b];
	// q3
	const param3 = sample([2, 3, 4, 5, 6, 7]);
	return [param1, param2, param3, q4Params()];
}

function qnGen(
	...params: (
		| { type: 1; param: number }
		| { type: 2; param: [number, number] }
		| { type: 3; param: number }
		| { type: 4; param: [number, number, number, number] }
	)[]
): [string, string] {
	let qns: [string, string][] = [];
	params.forEach((q) => {
		if (q.type === 1) {
			const { qn, ans } = q1Gen(q.param);
			qns.push([qn, ans]);
		} else if (q.type === 2) {
			const { qn, ans } = q2Gen(...q.param);
			qns.push([qn, ans]);
		} else if (q.type === 3) {
			const { qn, ans } = q3Gen(q.param);
			qns.push([qn, ans]);
		} else if (q.type === 4) {
			const { qn, ans } = q4Gen(...q.param);
			qns.push([qn, ans]);
		}
	});
	qns = shuffle(qns);
	return [parts(...qns.map((x) => x[0])), parts(...qns.map((x) => x[1]))];
}

function qnArgs(): Parameters<typeof qnGen> {
	const args: Parameters<typeof qnGen> = [];
	for (let i = 0; i < 3; i++) {
		args.push({ type: 1, param: q1Params() });
	}
	args.push({ type: 2, param: q2Params() });
	for (let i = 0; i < 2; i++) {
		args.push({ type: 4, param: q4Params() });
	}
	return args;
}

function simplifyRootXN(n: number, x = 'x'): [string, string] {
	if (n === 0) {
		return ['', ''];
	} else if (n === 1) {
		return ['', x];
	} else {
		const coeff = new Term([x, Math.floor(n / 2)]);
		return n % 2 === 0 ? [`${coeff}`, ''] : [`${coeff}`, x];
	}
}

function generate_axN(): [number, number] {
	const a = sample([1, 1, 2, 3, 4, 5, 6, 8, 9, 10]);
	const n = sample([0, 1, 2, 3]);
	if (a === 1 && n === 0) {
		return generate_axN();
	}
	return [a, n];
}

function q1Gen(a: number): { qn: string; ans: string } {
	const surd1 = new SquareRoot(a);
	const k1 = surd1.coeff;
	const p1 = surd1.radicand;
	const ans = `${math(
		`\\sqrt{${a}} = \\sqrt{${k1.square()} \\times ${p1}} = \\sqrt{${k1.square()}} \\times \\sqrt{${p1}} = ${surd1}`,
		{ wrap: true }
	)}`;
	const qn = math(`\\sqrt{${a}}`);
	return { qn, ans };
}
function q2Gen(a: number, b: number): { qn: string; ans: string } {
	const surd2 = new SquareRoot(a * b);
	const k2 = surd2.coeff;
	const p2 = surd2.radicand;
	const ans = `${math(
		`\\sqrt{${a}} \\times \\sqrt{${b}} = \\sqrt{${k2
			.square()
			.times(p2)}} = \\sqrt{${k2.square()} \\times ${p2}} = ${surd2}`,
		{ wrap: true }
	)}`;
	const qn = math(`\\sqrt{${a}} \\times \\sqrt{${b}}`);
	return { qn, ans };
}
function q3Gen(n: number): { qn: string; ans: string } {
	const [coeff3, radicand3] = simplifyRootXN(n);
	const final3 = radicand3 ? `${coeff3} \\sqrt{${radicand3}}` : coeff3;
	const ans =
		`Assuming ${math(`x \\geq 0,`)} ${newline}` +
		(n === 2
			? math(`\\sqrt{x^2} = ${final3}`, { wrap: true })
			: n % 2 === 0
			? math(`\\sqrt{x^${n}} = \\sqrt{\\left( x^${n / 2} \\right)^2} = ${final3}`, {
					wrap: true,
			  })
			: math(
					`\\sqrt{x^${n}} = \\sqrt{x^${n - 1} \\cdot x} = \\sqrt{x^${
						n - 1
					}}  \\sqrt{x} = ${final3}`,
					{
						wrap: true,
					}
			  ));
	const qn = math(`\\sqrt{x^{${n}}}`);
	return { qn, ans };
}
function q4Gen(a: number, n1: number, b: number, n2: number): { qn: string; ans: string } {
	const radicand1 = new Term(a, ['y', n1]);
	const radicand2 = new Term(b, ['y', n2]);
	const sqrt4 = new SquareRoot(a * b);
	const coeff4a = sqrt4.coeff;
	const radicand4a = sqrt4.radicand;
	const [coeff4b, radicand4b] = simplifyRootXN(n1 + n2, 'y');
	const working4 = `\\sqrt{${radicand1.times(radicand2)}}`;
	const finalRadicand =
		radicand4a.is.one() && radicand4b === ''
			? undefined
			: radicand4b === ''
			? new SquareRoot(radicand4a)
			: `\\sqrt{${new Term(radicand4a, radicand4b)}}`;
	let finalAns = '';
	if (coeff4a.is.not.one() || coeff4b !== '') {
		if (finalRadicand === undefined) {
			finalAns = `= ${new Term(coeff4a, coeff4b)}`;
		} else if (typeof finalRadicand === 'string') {
			finalAns = `= ${new Term(coeff4a, coeff4b, finalRadicand)}`;
		} else {
			finalAns = `= ${new Term(coeff4a, coeff4b).times(finalRadicand)}`;
		}
	}
	const ans = `${math(
		`\\sqrt{${radicand1}} \\times \\sqrt{${radicand2}} = ${working4}${finalAns}`,
		{
			wrap: true,
		}
	)}`;
	const qn = math(`\\sqrt{${radicand1}} \\times \\sqrt{${radicand2}}`);
	return { qn, ans };
}

function q1Params(): number {
	const base1 = sample(surdBases);
	const coeff1 = sample(surdCoeffs[base1].slice(1));
	if (coeff1 === undefined) {
		throw new Error('undefined sampling');
	}
	return coeff1 ** 2 * base1;
}

function q2Params(): [number, number] {
	const base2 = sample(surdBases);
	let coeff2 = sample(surdCoeffs[base2].slice(1));
	while (coeff2 === base2 || new SquareRoot(coeff2 ?? 1).radicand.is.one()) {
		coeff2 = sample(surdCoeffs[base2].slice(1));
	}
	if (coeff2 === undefined) {
		throw new Error('undefined sampling');
	}
	const [a, b] = shuffle([coeff2 * base2, coeff2]);
	return [a, b];
}

function q4Params(): [number, number, number, number] {
	const [a1, n1] = generate_axN();
	const [a2, n2] = generate_axN();
	return [a1, n1, a2, n2];
}
