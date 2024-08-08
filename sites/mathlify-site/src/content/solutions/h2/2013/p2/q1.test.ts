import { expect, it } from 'vitest';
import { answer } from './q1.soln';

it('2013p2q1', () => {
	expect(answer).toMatchSnapshot();
});
