/* The question here is the copyright of 
- Singapore Examinations and Assessment Board
- Cambridge Assessment International Education
- Ministry of Education, Singapore
- Government of Singapore

We provide this question on Mathlify under fair use for archival purposes.
These are questions more than 10 years old and are difficult to obtain
commercially.

For the newer questions, please purchase a copy of the
"ten year series" from authorized publishers and distributors.
*/

import { Expression, Polynomial } from 'mathlify';
import { Question } from '$lib/classes/question';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { dydxString } from '$lib/utils/typesetting/math';

export const question = new Question();

// 4 dI/dt = 2 - 3I

const rhs = new Polynomial([2, -3], { variable: 'I' });
const dIdt = dydxString({ y: 'I' });
const lhs = new Expression([4, dIdt]);
const initialI = '{I = 2}';
const initialT = '{t=0.}';

// a
question.addPart(
	mathlifier`The current ${'I'}
in an electric circuit at time ${'t'}
satisfies the differential equation

$${lhs} = ${rhs}.

Find ${'I'}
in terms of ${'t'},
given that ${initialI}
when ${initialT}`,
	{ marks: 6 }
);
// b
{
	question.addPart(
		mathlifier`State what happens to the current in this circuit
for large values of ${'t'}.`,
		{ marks: 1 }
	);
}
