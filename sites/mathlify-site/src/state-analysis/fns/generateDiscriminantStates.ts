import { chooseRandomSubset } from '$lib/utils/random';
import {
	rationalQns as r1a,
	surd2Qns as s2a,
	surd3Qns as s3a,
	surd5Qns as s5a
} from './_discriminant_filter_states1';
import {
	rationalQns as r1b,
	surd2Qns as s2b,
	surd3Qns as s3b,
	surd5Qns as s5b
} from './_discriminant_filter_states2';
import {
	rationalQns as r1c,
	surd2Qns as s2c,
	surd3Qns as s3c,
	surd5Qns as s5c,
	surd7Qns as s7c
} from './_discriminant_filter_states3';

const states: {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	type: 1 | 2 | 3;
	surd: boolean;
}[] = [];

const rationalA = chooseRandomSubset(r1a, 8).map(
	([x]) =>
		({
			a: x[0],
			b: x[1],
			c: x[2],
			d: x[3],
			e: x[4],
			type: 1,
			surd: false
		}) as const
);
const rationalB = chooseRandomSubset(r1b, 8).map(
	([x]) =>
		({
			a: x[0],
			b: x[1],
			c: x[2],
			d: x[3],
			e: x[4],
			type: 2,
			surd: false
		}) as const
);
const rationalC = chooseRandomSubset(r1c, 8).map(
	([x]) =>
		({
			a: x[0],
			b: 0,
			c: x[1],
			d: x[2],
			e: x[3],
			type: 3,
			surd: false
		}) as const
);
const surd2a = chooseRandomSubset(s2a, 4).map(
	([x]) =>
		({
			a: x[0],
			b: x[1],
			c: x[2],
			d: x[3],
			e: x[4],
			type: 1,
			surd: true
		}) as const
);
const surd2b = chooseRandomSubset(s2b, 4).map(
	([x]) =>
		({
			a: x[0],
			b: x[1],
			c: x[2],
			d: x[3],
			e: x[4],
			type: 2,
			surd: true
		}) as const
);
const surd2c = chooseRandomSubset(s2c, 3).map(
	([x]) =>
		({
			a: x[0],
			b: 0,
			c: x[1],
			d: x[2],
			e: x[3],
			type: 3,
			surd: true
		}) as const
);
const surd3a = chooseRandomSubset(s3a, 4).map(
	([x]) =>
		({
			a: x[0],
			b: x[1],
			c: x[2],
			d: x[3],
			e: x[4],
			type: 1,
			surd: true
		}) as const
);
const surd3b = chooseRandomSubset(s3b, 4).map(
	([x]) =>
		({
			a: x[0],
			b: x[1],
			c: x[2],
			d: x[3],
			e: x[4],
			type: 2,
			surd: true
		}) as const
);
const surd3c = chooseRandomSubset(s3c, 3).map(
	([x]) =>
		({
			a: x[0],
			b: 0,
			c: x[1],
			d: x[2],
			e: x[3],
			type: 3,
			surd: true
		}) as const
);
const surd5a = chooseRandomSubset(s5a, 4).map(
	([x]) =>
		({
			a: x[0],
			b: x[1],
			c: x[2],
			d: x[3],
			e: x[4],
			type: 1,
			surd: true
		}) as const
);
const surd5b = chooseRandomSubset(s5b, 4).map(
	([x]) =>
		({
			a: x[0],
			b: x[1],
			c: x[2],
			d: x[3],
			e: x[4],
			type: 2,
			surd: true
		}) as const
);
const surd5c = chooseRandomSubset(s5c, 3).map(
	([x]) =>
		({
			a: x[0],
			b: 0,
			c: x[1],
			d: x[2],
			e: x[3],
			type: 3,
			surd: true
		}) as const
);
const surd7c = chooseRandomSubset(s7c, 3).map(
	([x]) =>
		({
			a: x[0],
			b: 0,
			c: x[1],
			d: x[2],
			e: x[3],
			type: 3,
			surd: true
		}) as const
);

states.push(...rationalA, ...rationalB, ...rationalC);
states.push(...surd2a, ...surd3a, ...surd5a);
states.push(...surd2b, ...surd3b, ...surd5b);
states.push(...surd2c, ...surd3c, ...surd5c, ...surd7c);

import { outputFileSync } from 'fs-extra/esm';
import * as prettier from 'prettier';

const json = await prettier.format(JSON.stringify(states), { parser: 'json' });
outputFileSync('src/state-analysis/fns/discriminant_states_2024_0911.json', json);
