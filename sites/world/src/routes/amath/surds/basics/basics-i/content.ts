import { PageContent } from '$lib';
import { sample, sampleSize, shuffle } from 'lodash-es';
import { math } from 'mathlifier';
import { parts } from '$lib/typesetting/parts';

export const title = 'Surd Basics I';

const page = new PageContent();
// intro
page.display(`\\sqrt{2}`);
page.text(`In this section, we will investigate some properties of surds/radicals involving positive
and negative numbers.`);
// example
page.iExample(exampleGen, exampleArgs, { initialArgs: 9, plural: true });
// practice
const preamble = `For each of the following, state whether the surd is a real number. If it is a real number, simplify and express it as an integer.`;
page.iQn(qnGen, qnArgs, { preamble, initialArgs: new Array(7).fill(7) });

export const content = page.content;

function exampleGen(base: number): string {
	const square = base ** 2;
	const a = `${math(`\\sqrt{-${square}}`)} is not a real number`;
	const b = `${math(`\\sqrt{${square}} = ${base}`)}`;
	const c = `${math(`-\\sqrt{${square}} = -${base}`)}`;
	const d = `${math(`\\left(\\sqrt{${base}}\\right)^2 = ${base}`)}`;
	const e = `${math(`\\sqrt{${base}^2} = ${base}`)}`;
	const f = `${math(`\\sqrt{(-${base})^2} = ${base}`)}`;
	const g = `${math(`\\sqrt{-${base}^2}`)} is not a real number`;
	return parts(a, b, c, d, e, f, g);
}

function exampleArgs(): number {
	const bases = Array.from(Array(14).keys()).slice(2);
	const base = sample(bases);
	if (base === undefined) {
		throw new Error('base is undefined');
	} else {
		return base;
	}
}

function qnGen(...bases: number[]): [string, string] {
	let qns: [string, string][] = [];
	bases.forEach((base, i) => {
		const square = base ** 2;
		switch (i) {
			case 0:
				qns.push([
					`${math(`\\sqrt{-${square}}`)}`,
					`${math(`\\sqrt{-${square}}`)} is not a real number`,
				]);
				break;
			case 1:
				qns.push([`${math(`\\sqrt{${square}}`)}`, `${math(`\\sqrt{${square}} = ${base}`)}`]);
				break;
			case 2:
				qns.push([`${math(`-\\sqrt{${square}}`)}`, `${math(`-\\sqrt{${square}} = -${base}`)}`]);
				break;
			case 3:
				qns.push([
					`${math(`\\left(\\sqrt{${base}}\\right)^2`)}`,
					`${math(`\\left(\\sqrt{${base}}\\right)^2 = ${base}`)}`,
				]);
				break;
			case 4:
				qns.push([`${math(`\\sqrt{${base}^2}`)}`, `${math(`\\sqrt{${base}^2} = ${base}`)}`]);
				break;
			case 5:
				qns.push([
					`${math(`\\sqrt{(-${base})^2}`)}`,
					`${math(`\\sqrt{(-${base})^2} = \\sqrt{${square}} = ${base}`)}`,
				]);
				break;
			case 6:
				qns.push([
					`${math(`\\sqrt{-${base}^2}`)}`,
					`${math(`\\sqrt{-${base}^2} = \\sqrt{-${square}}`)} is not a real number`,
				]);
				break;
		}
	});
	qns = shuffle(qns);
	return [parts(...qns.map((x) => x[0])), parts(...qns.map((x) => x[1]))];
}

function qnArgs(): number[] {
	const bases = Array.from(Array(14).keys()).slice(1);
	return sampleSize(bases, 7);
}
