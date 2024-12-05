import { expect, it } from 'vitest';
import { question as q1 } from './q1';
import { question as q2 } from './q2';
import { question as q3 } from './q3';
import { question as q4 } from './q4';
import { question as q5 } from './q5';
import { question as q6 } from './q6';
import { question as q7 } from './q7';
import { question as q8 } from './q8';
import { question as q9 } from './q9';
import { question as q10 } from './q10';
import { question as q11 } from './q11';

it('2007 p2 qns', () => {
	expect(q1).toMatchSnapshot();
	expect(q2).toMatchSnapshot();
	expect(q3).toMatchSnapshot();
	expect(q4).toMatchSnapshot();
	expect(q5).toMatchSnapshot();
	expect(q6).toMatchSnapshot();
	expect(q7).toMatchSnapshot();
	expect(q8).toMatchSnapshot();
	expect(q9).toMatchSnapshot();
	expect(q10).toMatchSnapshot();
	expect(q11).toMatchSnapshot();
});
