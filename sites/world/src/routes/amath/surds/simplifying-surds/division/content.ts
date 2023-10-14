import { PageContent } from '$lib';
import { sample, sampleSize, shuffle } from 'lodash-es';
import { math, newline } from 'mathlifier';
import { parts } from '$lib/typesetting/parts';
import { Fraction, SquareRoot, Term } from 'mathlify';
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
	initialArgs: [
		[9, 4],
		[6, 2],
		[8, 3, 2, 1, 'x'],
	],
	plural: true,
});
[2, 1, 10, 1];
// practice
const preamble = `Simplify the surds below using the division rule. You may assume that ${math(
	`x \\geq 0.`
)}`;
page.iQn(qnGen, qnArgs, {
	preamble,
	initialArgs: [
		{ type: 1, param: [1, 25] },
		{ type: 1, param: [81, 16] },
		{ type: 2, param: [18, 2] },
		{ type: 3, param: [12, 2, 3, 1, 'x', false] },
	],
});

export const content = page.content;

function exampleGen(
	param1: [number, number],
	param2: [number, number],
	param3: [number, number, number, number, string, boolean?]
): string {
	const { ans: q1 } = q1Gen(...param1);
	const { ans: q2 } = q2Gen(...param2);
	const { ans: q3 } = q3Gen(...param3);
	return parts(q1, q2, q3);
}

function exampleArgs(): Parameters<typeof exampleGen> {
	return [q1Params(), q2Params(), q3Params()];
}

function qnGen(
	...params: (
		| { type: 1; param: [number, number] }
		| { type: 2; param: [number, number] }
		| { type: 3; param: [number, number, number, number, string, boolean] }
	)[]
): [string, string] {
	let qns: [string, string][] = [];
	params.forEach((q) => {
		if (q.type === 1) {
			const { qn, ans } = q1Gen(...q.param);
			qns.push([qn, ans]);
		} else if (q.type === 2) {
			const { qn, ans } = q2Gen(...q.param);
			qns.push([qn, ans]);
		} else if (q.type === 3) {
			const { qn, ans } = q3Gen(...q.param);
			qns.push([qn, ans]);
		}
	});
	qns = shuffle(qns);
	return [parts(...qns.map((x) => x[0])), parts(...qns.map((x) => x[1]))];
}

function qnArgs(): Parameters<typeof qnGen> {
	const args: Parameters<typeof qnGen> = [];
	for (let i = 0; i < 2; i++) {
		args.push({ type: 1, param: q1Params() });
	}
	args.push({ type: 2, param: q2Params() });
	args.push({ type: 3, param: q3Params(false) });
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

function q1Gen(a: number, b: number): { qn: string; ans: string } {
	const frac = new Fraction(a, b);
	const sqrt = new SquareRoot(frac);
	const ans = `${math(
		`\\displaystyle \\sqrt{${frac}} = \\frac{\\sqrt{${a}}}{\\sqrt{${b}}} = ${sqrt}`
	)}`;
	const qn = math(`\\displaystyle \\sqrt{${frac}}`);
	return { qn, ans };
}
function q2Gen(a: number, b: number): { qn: string; ans: string } {
	const frac = new Fraction(a, b);
	const sqrt = new SquareRoot(frac);
	const working = sqrt.is.rational() ? `= \\sqrt{${frac}}` : '';
	const ans = `${math(
		`\\displaystyle \\frac{\\sqrt{${a}}}{\\sqrt{${b}}} = \\sqrt{\\frac{${a}}{${b}}} ${working} = ${sqrt}`,
		{ wrap: true }
	)}`;
	const qn = math(`\\displaystyle \\frac{\\sqrt{${a}}}{\\sqrt{${b}}}`);
	return { qn, ans };
}
function q3Gen(
	a: number,
	n1: number,
	b: number,
	n2: number,
	x: string,
	exampleMode = true
): { qn: string; ans: string } {
	const radicand1 = n1 === 0 ? new Term(a) : new Term(a, [x, n1]);
	const radicand2 = n2 === 0 ? new Term(b) : new Term(b, [x, n2]);
	const frac = new Fraction(a, b);
	const n3 = n1 - n2;
	const radicand3 = n3 === 0 ? new Term(frac) : new Term(frac, [x, n3]);
	const sqrt = new SquareRoot(frac);
	const coeff = sqrt.coeff;
	const radicandNum = sqrt.radicand;
	const [coeffX, radicandX] = simplifyRootXN(n3, x);
	let finalRadicand: undefined | string = undefined;
	if (radicandX) {
		finalRadicand = coeff.is.one() ? radicandX : `${new Term(radicandNum, radicandX)}`;
	} else if (radicandNum.is.not.one()) {
		finalRadicand = `\\sqrt{${radicandNum}}`;
	}
	let finalAns = '';
	if (coeff.is.not.one() || coeffX !== '') {
		if (finalRadicand === undefined) {
			finalAns = `= ${new Term(coeff, coeffX)}`;
		} else {
			finalAns = `= ${new Term(coeff, coeffX, `\\sqrt{${finalRadicand}}`)}`;
		}
	}
	let ans = `${math(
		`\\displaystyle \\frac{\\sqrt{${radicand1}}}{\\sqrt{${radicand2}}} = \\sqrt{${radicand3}} ${finalAns}`,
		{
			wrap: true,
		}
	)}`;
	if (exampleMode) {
		ans = `Assuming ${math(`x \\geq 0,`)} ${newline}` + ans;
	}
	const qn = math(`\\displaystyle \\frac{\\sqrt{${radicand1}}}{\\sqrt{${radicand2}}}`);
	return { qn, ans };
}

function q1Params(): [number, number] {
	let [a, b] = sampleSize(Array.from(Array(13).keys()).slice(2), 2);
	const frac = new Fraction(a, b);
	a = frac.num;
	b = frac.den;
	if (b === 1) {
		[a, b] = [b, a];
	}
	return [a ** 2, b ** 2];
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
	return [coeff2 * base2, coeff2];
}

function q3Params(exampleMode = true): [number, number, number, number, string, boolean] {
	const n1 = sample([1, 2, 3]);
	const n2s: Record<number, number[]> = {
		1: [0, 1],
		2: [0, 1, 2],
		3: [0, 1, 2, 3],
	};
	const n2 = sample(n2s[n1]);
	if (n2 === undefined) {
		throw new Error('undefined sampling');
	}
	const a = sample([2, 3, 5, 6, 7, 1, 4, 9, 16, 25]);
	if (a === 1 && n1 - n2 === 0) {
		return q3Params(exampleMode);
	}
	const multiple = a < 16 ? sample([2, 3, 5, 6, 7, 8]) : sample([2, 3, 5]);
	const b = a * multiple;
	return [b, n1, multiple, n2, 'x', exampleMode];
}
