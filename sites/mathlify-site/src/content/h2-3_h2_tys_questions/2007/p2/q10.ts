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

import { Question } from '$lib/classes/question';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { Polynomial } from 'mathlify';

export const question = new Question();

const poly = new Polynomial([3, -5, 2], { variable: 'r' });

question.addBody(mathlifier`A geometric series has a common ratio ${'r'},
and an arithmetic series has first term ${'a'}
and common difference ${'d'},
where ${'a'}
and ${'d'}
are non-zero.

The first three terms of the geometric series are
equal to the first, fourth and sixth terms respectively of the arithmetic series`);

// a
question.addPart(mathlifier`Show that ${{}} {${poly}.}`, { marks: 4 });
// b
question.addPart(
	mathlifier`Deduce that the geometric series is convergent
and find, in terms of ${'a'},
the sum to infinity.`,
	{ marks: 5 }
);
// c
question.addPart(
	mathlifier`The sum of the first ${'n'}
terms of the arithmetic series is denoted by ${'S'}.
Given that ${{}} {a>0,}
find the set of possible values of ${'n'}
for which ${'S'}
exceeds ${'4a'}.`,
	{ marks: 5 }
);
