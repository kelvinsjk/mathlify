import { expect, it } from 'vitest';
import { question as q2 } from './q2';

it('2007 p1 qn', () => {
	expect(q2).toMatchSnapshot();
});
