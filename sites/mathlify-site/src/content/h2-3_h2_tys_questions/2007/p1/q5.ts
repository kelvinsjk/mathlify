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

import { Polynomial, quotient } from 'mathlify';
import { Question } from '$lib/classes/question';
import { mathlifierDj as mathlifier } from 'mathlifier';

export const question = new Question();

// (2x+7)/(x+2)
const num = new Polynomial([2, 7]);
const den = new Polynomial([1, 2]);
const exp = quotient(num, den);

// a
{
	question.addPart(
		mathlifier`Show that the equation ${{}} {y = ${exp}}
can be rewritten as ${{}} {y= A + \\frac{B}{${den}},}
where ${'A'}
and ${'B'}
are constants to be found.

Hence state a sequence of transformations which transform the graph
of ${{}}{y=\\frac{1}{x}}
to the graph of ${{}}{y= ${exp}.}`,
		{ marks: 4 }
	);
}
// b
{
	question.addPart(
		mathlifier`Sketch the graph of ${{}} {y = ${exp},}
giving the equations of any asymptotes and the coordinates
of any points of intersection with the ${'x\\text{-}'}
and ${'y\\text{-axes}.'}`,
		{ marks: 3 }
	);
}
