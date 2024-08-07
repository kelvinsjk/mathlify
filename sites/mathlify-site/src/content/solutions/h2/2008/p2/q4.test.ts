import { expect, it } from 'vitest';
import { answer } from './q4.soln';

it('2008p2q4', () => {
	expect(answer).toMatchSnapshot();
});
