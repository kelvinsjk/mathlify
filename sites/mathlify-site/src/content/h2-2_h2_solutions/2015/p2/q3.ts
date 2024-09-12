import { Answer } from '$lib/classes/answer';
import { Expression, Polynomial } from 'mathlify';
import { specialExistence } from '$content/h2-1_h2_learn/01_functions/02_inverse/01_existence/02_practice';
import { specialInverse } from '$content/h2-1_h2_learn/01_functions/02_inverse/03_formula/02_practice';
import { discriminantRange } from '$content/h2-1_h2_learn/01_functions/04_more/04_discriminant/02_practice';
import svg from '$static/images/h2/fns/2015p2q3a.svg?raw';
import { QED } from '$lib/typesetting/utils';

export const answer = new Answer();

// (a)
// | 1 / 1-x^2 |
// equivalent to | ba^2 / x^2 - a^2 |
// from the learn/practice section
// where b=-1 and a=1

// (b)
// (2+x) / (1-x^2)
// equivalent to (dx+e)/(c^2 - a^2x^2)

const [a, b] = [1, -1];
const exp = new Expression([a, '/', new Polynomial([a * a, 0, -1], { ascending: true })]);
const state: Parameters<typeof specialInverse>[0] = {
	fnType: 'special',
	a,
	b,
	restriction: { type: 'right', x: a, inclusive: false },
	definition: false,
	// dummies
	c: 1,
	unknownConstants: false
};

// ai
{
	const { ans, soln } = specialExistence(state);
	const imag = `\`\`\` =html\n${svg}\n\`\`\`\n\n`;
	answer.addSubPart(ans, imag + soln + ` $${QED}$`);
}
// aii
{
	const { ans, soln } = specialInverse(state, exp);
	answer.addSubPart(ans, soln);
}

// b
const stateB: Parameters<typeof discriminantRange>[0] = {
	a: 1,
	b: 0,
	c: 1,
	d: 1,
	e: 2,
	type: 3
};
{
	const { ans, soln } = discriminantRange(stateB);
	answer.addPart(ans, soln);
}
