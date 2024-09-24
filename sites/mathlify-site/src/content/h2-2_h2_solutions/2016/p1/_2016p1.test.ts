import { expect, it } from 'vitest';
import { answer as q10Ans } from './q10';
import { q3, q10 } from './_testAnswers';

it('2019 p1 answers', () => {
	// q3
	//expect(q3Ans).toEqual(q3);
	//expect(q3Ans).toMatchSnapshot();
	// q10
	expect(q10Ans.answer).toEqual(q10);
	expect(q10Ans.answer).toMatchSnapshot();
});
