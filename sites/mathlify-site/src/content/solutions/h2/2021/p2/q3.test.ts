import { expect, it } from 'vitest';
import { answer } from './q3.soln';

it('2021p2q3', () => {
	expect(answer).toMatchSnapshot();
});
