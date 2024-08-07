import { expect, it } from 'vitest';
import { answer } from './q2.soln';

it('2007p1q2', () => {
	expect(answer).toMatchSnapshot();
});
