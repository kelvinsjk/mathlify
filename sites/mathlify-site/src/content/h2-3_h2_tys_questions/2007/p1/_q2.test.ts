import { expect, it } from 'vitest';
import { question } from './q2';

it('2007p1q2 qn', () => {
	expect(question).toMatchSnapshot();
});
