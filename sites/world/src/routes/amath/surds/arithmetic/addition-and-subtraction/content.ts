import { PageContent } from '$lib';
import { sample, sampleSize, shuffle } from 'lodash-es';
import { math } from 'mathlifier';
import { parts } from '$lib/typesetting/parts';

export const title = "Surds Addition and Subtraction";

const page = new PageContent();
// intro
page.display(``);
page.text(`In this section, we will investigate .`);
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
	bases.forEach((base,i)=>{

	})
	qns = shuffle(qns);
	return [parts(...qns.map((x) => x[0])), parts(...qns.map((x) => x[1]))];
}

function qnArgs(): number[] {
	return [];
}
