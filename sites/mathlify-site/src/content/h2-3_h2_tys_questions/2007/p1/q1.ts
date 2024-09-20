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

import { Polynomial, quotient, sum } from 'mathlify';
import { combineFraction } from 'mathlify/algebra';
import { Question } from '$lib/classes/question';
import { mathlifierDj as mathlifier } from 'mathlifier';

export const question = new Question();

// (2x^2 - x - 19) / (x^2 + 3x + 2)
// (x^2 - 4x - 21) / (x^2 + 3x + 2)

const num = new Polynomial([2, -1, -19]);
const den = new Polynomial([1, 3, 2]);
const frac = quotient(num, den);
const secondTerm = 1;
const lhs = sum(frac, -secondTerm);
const rhs = combineFraction(lhs);

// a
{
	question.addPart(
		mathlifier`Show that

$${lhs} = ${rhs}.`,
		{ marks: 1 }
	);
}
// b
{
	question.addPart(
		mathlifier`Hence, without using a calculator, solve the inequality

$${frac} > ${secondTerm}.`,
		{ marks: 4 }
	);
}
