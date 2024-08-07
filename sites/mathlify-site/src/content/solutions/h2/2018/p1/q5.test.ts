import { expect, it } from 'vitest';
import { answer } from './q5.soln';

it('2018p1q5', () => {
	expect(answer).toMatchSnapshot();
});
