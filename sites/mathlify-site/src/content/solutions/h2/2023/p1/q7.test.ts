import { expect, it } from 'vitest';
import { answer } from './q7.soln';

it('2023p1q7', () => {
	expect(answer).toMatchSnapshot();
});
