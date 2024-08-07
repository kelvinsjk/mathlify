import { expect, it } from 'vitest';
import { answer } from './q1.soln';

it('2014p1q1', () => {
	expect(answer).toMatchSnapshot();
});
