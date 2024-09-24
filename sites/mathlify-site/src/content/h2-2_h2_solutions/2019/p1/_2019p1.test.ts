import { expect, it } from 'vitest';
import { answer as q5Ans } from './q5';
import { q3, q5 } from './_testAnswers';

it('2019 p1 answers', () => {
	// q3
	//expect(q3Ans).toEqual(q3);
	//expect(q3Ans).toMatchSnapshot();
	// q5
	expect(q5Ans.answer).toEqual(q5);
	expect(q5Ans.answer).toMatchSnapshot();
});
