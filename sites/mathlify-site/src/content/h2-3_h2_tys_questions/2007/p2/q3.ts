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

import { Polynomial } from 'mathlify';
import { Question } from '$lib/classes/question';
import { mathlifierDj as mathlifier } from 'mathlifier';

export const question = new Question();

const ascending = true;
const poly1 = new Polynomial([1, 1], { ascending });
const poly2 = new Polynomial([4, -1], { ascending });
const poly3 = new Polynomial([1, 0, 2], { ascending });

const exp1 = `{(${poly1})^n,}`;
const exp2 = `{(${poly2})^{\\frac{3}{2}} (${poly3})^{\\frac{3}{2}}}`;

// a
question.addPart(
	mathlifier`By successively differentiating ${exp1}
find Maclaurin's series for ${exp1}
up to and including the term in ${'x^3'}.`,
	{ marks: 4 }
);
// b
question.addPart(
	mathlifier`Obtain the expansion of ${exp2}
up to and including the term in ${'x^3'}.`,
	{ marks: 5 }
);
// c
question.addPart(
	mathlifier`Find the set of values of ${'x'}
for which the expansion in part (b) is valid.`,
	{ marks: 2 }
);
