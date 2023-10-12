import { PageContent } from '$lib';
export const title = 'Surd Basics I';
const page = new PageContent();

import { sample, shuffle } from 'lodash-es';
import { math } from 'mathlifier';
import { parts } from '$lib/typesetting/parts';

page.iExample(exampleGen, exampleArgs, { initialArg: 9 });
const preamble = `For each of the following, state whether the surd is a real number or not. If it is a real number, state its value.`;
page.iQn(qnGen, exampleArgs, { preamble });

export const content = page.content;

function exampleGen(base: number): string {
	const square = base ** 2;
	const a = `${math(`\\sqrt{-${square}}`)} is not a real number`;
	const b = `${math(`\\sqrt{${square}} = ${base}`)}`;
	const c = `${math(`-\\sqrt{${square}} = -${base}`)}`;
	const d = `${math(`\\sqrt{${base}^2} = ${base}`)}`;
	const e = `${math(`\\sqrt{(-${base})^2} = ${base}`)}`;
	const f = `${math(`\\sqrt{-${base}^2}`)} is not a real number`;
	return parts(a, b, c, d, e, f);
}

function exampleArgs(): number {
	const bases = Array.from(Array(14).keys()).slice(2);
	return sample(bases)!;
}

function qnGen(base: number): [string, string] {
	const square = base ** 2;
	const a = [`${math(`\\sqrt{-${square}}`)}`, `${math(`\\sqrt{-${square}}`)} is not a real number`];
	const b = [`${math(`\\sqrt{${square}}`)}`, `${math(`\\sqrt{${square}} = ${base}`)}`];
	const c = [`${math(`-\\sqrt{${square}}`)}`, `${math(`-\\sqrt{${square}} = -${base}`)}`];
	const d = [`${math(`\\sqrt{${base}^2}`)}`, `${math(`\\sqrt{${base}^2} = ${base}`)}`];
	const e = [
		`${math(`\\sqrt{(-${base})^2}`)}`,
		`${math(`\\sqrt{(-${base})^2} = \\sqrt{${square}} = ${base}`)}`,
	];
	const f = [
		`${math(`\\sqrt{-${base}^2}`)}`,
		`${math(`\\sqrt{-${base}^2} = \\sqrt{-${square}}`)} is not a real number`,
	];
	const qn = shuffle([a, b, c, d, e, f]);
	return [parts(...qn.map((x) => x[0])), parts(...qn.map((x) => x[1]))];
}

function qnArgs(): number {
	const bases = Array.from(Array(14).keys()).slice(2);
	return sample(bases)!;
}
