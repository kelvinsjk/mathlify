import { expect, it } from 'vitest';
import { answer as q2Ans } from './q2';
import { q1, q2 } from './_testAnswers';

it('2007 p1 answers', () => {
	// q2
	expect(q2Ans.answer).toEqual(q2);
	expect(q2Ans.answer).toMatchSnapshot();
	// q5
	//expect(q5Ans.answer).toEqual(q5);
	//expect(q5Ans.answer).toMatchSnapshot();
});
