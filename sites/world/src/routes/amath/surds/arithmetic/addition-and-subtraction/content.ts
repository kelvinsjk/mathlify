import { PageContent } from '$lib';
import { sample, sampleSize, shuffle } from 'lodash-es';
import { math } from 'mathlifier';
import { parts } from '$lib/typesetting/parts';

export const title = 'Surds Addition and Subtraction';

const page = new PageContent();
// intro
//TODO: link to simplify surds
page.display(`2\\sqrt{5} + \\sqrt{5} = 3\\sqrt{5}`);
page.text(`In this section, we will investigate addition and subtraction of
	surds and radicals. In particular, it behaves like the addition and subtraction of
	like and unlike terms in algebra. We will also have to simplify surds
	before we can add or subtract them
.`);
// example
page.iExample(exampleGen, exampleArgs, { initialArgs: [3, 4], plural: true });
// practice
const preamble = `.`;
page.iQn(qnGen, qnArgs, { preamble, initialArgs: new Array(4).fill([5, 12]) });

export const content = page.content;

function exampleGen(
	radicand: number,
	coeffs: [number, number],
	radicand2: number,
	coeffs2: [number, number]
): string {
	const { ans: q1 } = q1Gen(radicand, ...coeffs);
	const { ans: q2 } = q2Gen(radicand, ...coeffs);
	const { ans: q3 } = q3Gen(radicand, ...coeffs, radicand2, ...coeffs2);
	return parts(q1, q2, q3);
}

function exampleArgs(): number {
	return 0;
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

function q1Gen(radicand: number, coeff1: number, coeff2: number): { ans: string; steps: string } {
	const ans = math(`${coeff}\\sqrt{${radicand}}`);
	const steps = math(`${coeff}\\sqrt{${radicand}}`);
	return { ans, qn };
}
