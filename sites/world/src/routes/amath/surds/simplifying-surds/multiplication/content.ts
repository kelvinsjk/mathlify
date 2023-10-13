import { PageContent } from '$lib';
import { sample, sampleSize, shuffle } from 'lodash-es';
import { math, newline, strong } from 'mathlifier';
import { parts } from '$lib/typesetting/parts';
import { SquareRoot, Term } from 'mathlify';
import { surdBases, surdCoeffs } from '../../utils';

export const title = 'Simplifying Surds via Multiplication';

const page = new PageContent();
// intro
page.display(`\\sqrt{4 \\times 3} = \\sqrt{4} \\times \\sqrt{3}`);
page.text(`In this section, we will investigate the multiplication rule
	${math(`\\sqrt{ab} = \\sqrt{a} \\times \\sqrt{b}`)} when ${math(`a`)} and ${math(`b`)} are
	both nonnegative.
.`);
page.text(`This is useful in ${strong(`simplifying`)} square roots
	when radicands contain a perfect square. For example, we can express
	${math(`12`)} as ${math(`4 \\times 3`)} which helps us
	simplify ${math(`\\sqrt{12}`)} to ${math(`\\sqrt{4} \\times \\sqrt{3} = 2 \\sqrt{3}.`)}
`);
page.text(`Observe the use of perfect squares in the previous example. We do not
	express ${math(`12`)} as ${math(`6 \\times 2`)} though that is technically valid as neither
	${math(`6`)} nor ${math(`2`)} are perfect squares, preventing us from simplifying the square root.
`);

// example
page.iExample(exampleGen, exampleArgs, {
	initialArgs: [18, [6, 2], 3, [2, 1, 10, 1]],
	plural: true,
});
[2, 1, 10, 1];
// practice
const preamble = `.`;
page.iQn(qnGen, qnArgs, { preamble, initialArgs: new Array(4).fill([5, 12]) });

export const content = page.content;

function exampleGen(
	param1: number,
	param2: [number, number],
	param3: number,
	param4: [number, number, number, number]
): string {
	const surd1 = new SquareRoot(param1);
	const k1 = surd1.coeff;
	const p1 = surd1.radicand;
	const q1 = `${math(
		`\\sqrt{${param1}} = \\sqrt{${k1.square()} \\times ${p1}} = \\sqrt{${k1.square()}} \\times \\sqrt{${p1}} = ${surd1}`,
		{ wrap: true }
	)}`;
	const [a2, b2] = param2;
	const surd2 = new SquareRoot(a2 * b2);
	const k2 = surd2.coeff;
	const p2 = surd2.radicand;
	const q2 = `${math(
		`\\sqrt{${a2}} \\times \\sqrt{${b2}} = \\sqrt{${k2
			.square()
			.times(p2)}} = \\sqrt{${k2.square()} \\times ${p2}} = ${surd2}`,
		{ wrap: true }
	)}`;
	const n3 = param3;
	const final3 = simplifyRootXN(n3);
	const q3 =
		`Assuming ${math(`x \\geq 0,`)} ${newline}` +
		(n3 === 2
			? math(`\\sqrt{x^2} = ${final3}`, { wrap: true })
			: n3 % 2 === 0
			? math(`\\sqrt{x^${n3}} = \\sqrt{\\left( x^${n3 / 2} \\right)^2} = ${final3}`, {
					wrap: true,
			  })
			: math(
					`\\sqrt{x^${n3}} = \\sqrt{x^${n3 - 1} \\cdot x} = \\sqrt{x^${
						n3 - 1
					}}  \\sqrt{x} = ${final3}`,
					{
						wrap: true,
					}
			  ));
	const [a4, n4a, b4, n4b] = param4;
	const radicand1 = new Term(a4, ['y', n4a]);
	const radicand2 = new Term(b4, ['y', n4b]);
	const sqrt4 = new SquareRoot(a4 * b4);
	const var4 = simplifyRootXN(n4a + n4b, 'y');
	const working4 = `\\sqrt{${radicand1.times(radicand2)}}`;
	const final4 = `${sqrt4.times(var4)}`;
	const finalAns =
		final4 === working4 || (sqrt4.coeff.is.one() && n4a + n4b <= 1) ? '' : ` = ${final4}`;
	const q4 = `${math(
		`\\sqrt{${radicand1}} \\times \\sqrt{${radicand2}} = \\sqrt{${radicand1.times(
			radicand2
		)}}${finalAns}`,
		{ wrap: true }
	)}`;
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
	// q4
	const [a1, n1] = generate_axN();
	const [a2, n2] = generate_axN();
	const param4: [number, number, number, number] = [a1, n1, a2, n2];
	return [param1, param2, param3, param4];
}

function qnGen(...bases: number[]): [string, string] {
	let qns: [string, string][] = [];
	bases.forEach((base, i) => {});
	qns = shuffle(qns);
	return [parts(...qns.map((x) => x[0])), parts(...qns.map((x) => x[1]))];
}

function qnArgs(): number[] {
	return [];
}

function simplifyRootXN(n: number, x = 'x'): string {
	if (n === 0) {
		return '';
	} else if (n === 1) {
		return `\\sqrt{${x}}`;
	} else {
		const coeff = new Term([x, Math.floor(n / 2)]);
		return n % 2 === 0 ? `${coeff}` : `${coeff} \\sqrt{${x}}`;
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
