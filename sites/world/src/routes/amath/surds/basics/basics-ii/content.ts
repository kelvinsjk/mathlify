import { PageContent } from '$lib';
import { sample, shuffle, random } from 'lodash-es';
import { math } from 'mathlifier';
import { parts } from '$lib/typesetting/parts';
import { pythagoreanTriples } from '../../utils';

export const title = 'Surds Basics II';

const page = new PageContent();
// intro
page.display(`\\sqrt{3^2 + 4^2} \\quad \\textrm{ vs } \\quad \\sqrt{3^2} + \\sqrt{4^2}`);
page.text(`In this section, we will investigate the properties of square roots
under addition and subtraction.`);
// example
page.iExample(exampleGen, exampleArgs, { initialArgs: [3, 4], plural: true });
// practice
const preamble = `Evaluate each of the following expressions.`;
page.iQn(qnGen, qnArgs, { preamble, initialArgs: new Array(4).fill([5, 12]) });

export const content = page.content;

function exampleGen(a: number, b: number): string {
	const c2 = a ** 2 + b ** 2;
	const c = Math.sqrt(c2);
	const q1 = `${math(`\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${c2}} = ${c}`)}`;
	const q2 = `${math(`\\sqrt{${a}^2} + \\sqrt{${b}^2} = ${a} + ${b} = ${a + b}`)}`;
	const q3 = `${math(`\\sqrt{${c}^2 - ${b}^2} = \\sqrt{${a ** 2}} = ${a}`)}`;
	const q4 = `${math(`\\sqrt{${c}^2} - \\sqrt{${b}^2} = ${c} - ${b} = ${c - b}`)}`;
	return parts(q1, q2, q3, q4);
}

function exampleArgs(): number[] {
	const triple = sample(pythagoreanTriples);
	let multiple = 1;
	if (triple === undefined) {
		console.warn('triple is undefined');
		return [3, 4];
	}
	if (triple[0] === 3) {
		multiple = random(-1, 8);
	} else if (triple[0] === 5) {
		multiple = random(0, 3);
	}
	if (multiple <= 1) {
		multiple = 1;
	}
	return shuffle(triple.map((x) => x * multiple).slice(0, 2));
}

function qnGen(...triples: number[][]): [string, string] {
	let qns: [string, string][] = [];
	triples.forEach((triple, i) => {
		const [a, b] = triple;
		const c2 = a ** 2 + b ** 2;
		const c = Math.sqrt(c2);
		switch (i) {
			case 0:
				qns.push([
					`${math(`\\sqrt{${a}^2 + ${b}^2}`)}`,
					`${math(`\\sqrt{${a}^2 + ${b}^2} = \\sqrt{${c2}} = ${c}`)}`,
				]);
				break;
			case 1:
				qns.push([
					`${math(`\\sqrt{${a}^2} + \\sqrt{${b}^2}`)}`,
					`${math(`\\sqrt{${a}^2} + \\sqrt{${b}^2} = ${a} + ${b} = ${a + b}`)}`,
				]);
				break;
			case 2:
				qns.push([
					`${math(`\\sqrt{${c}^2 - ${b}^2}`)}`,
					`${math(`\\sqrt{${c}^2 - ${b}^2} = \\sqrt{${a ** 2}} = ${a}`)}`,
				]);
				break;
			case 3:
				qns.push([
					`${math(`\\sqrt{${c}^2} - \\sqrt{${b}^2}`)}`,
					`${math(`\\sqrt{${c}^2} - \\sqrt{${b}^2} = ${c} - ${b} = ${c - b}`)}`,
				]);
				break;
		}
	});
	qns = shuffle(qns);
	return [parts(...qns.map((x) => x[0])), parts(...qns.map((x) => x[1]))];
}

function qnArgs(): number[][] {
	const triples: number[][] = [];
	for (let i = 0; i < 4; i++) {
		let triple = exampleArgs();
		while (triples.some((t) => t[0] + t[1] === triple[0] + triple[1])) {
			triple = exampleArgs();
		}
		triples.push(triple);
	}
	return triples;
}
