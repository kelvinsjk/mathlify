import { expect, it } from 'vitest';
import { answer as q3Ans } from './q3';
import { q3, q5 } from './_testAnswers';

it('2019 p1 answers', () => {
	// q3
	expect(q3Ans.answer).toEqual(q3);
	expect(q3Ans.answer).toMatchSnapshot();
	// q5
	//expect(q5Ans.answer).toEqual(q5);
	//expect(q5Ans.answer).toMatchSnapshot();
});
