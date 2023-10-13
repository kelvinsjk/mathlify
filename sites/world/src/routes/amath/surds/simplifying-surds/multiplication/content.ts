import { PageContent } from '$lib';
import { sample, sampleSize, shuffle } from 'lodash-es';
import { math, strong } from 'mathlifier';
import { parts } from '$lib/typesetting/parts';

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
page.iExample(exampleGen, exampleArgs, { initialArgs: [3, 4], plural: true });
// practice
const preamble = `.`;
page.iQn(qnGen, qnArgs, { preamble, initialArgs: new Array(4).fill([5, 12]) });

export const content = page.content;

function exampleGen(base: number): string {
	const q1 = `${math(``)}`;
	const q2 = `${math(``)}`;
	const q3 = `${math(``)}`;
	const q4 = `${math(``)}`;
	return parts(q1, q2, q3, q4);
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
