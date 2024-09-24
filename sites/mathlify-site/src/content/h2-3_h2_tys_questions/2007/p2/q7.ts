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

import { e, i, pi } from 'mathlify';
import { Question } from '$lib/classes/question';
import { mathlifierDj as mathlifier } from 'mathlifier';

export const question = new Question();

question.addBody(mathlifier`The polynomial ${'P(z)'}
has real coefficients. The equation ${{}} {P(z)=0}
has a root ${{}} r${e}^{${i}\\theta},
where ${{}} {r>0}
and ${{}} {0 < \\theta < ${pi}.}`);

// a
{
	question.addPart(
		mathlifier`Write down a second root in terms of ${'r'}
and ${'theta'},
and hence show that a quadratic factor of ${'P(z)'}
is $${{}} z^2 - 2rz \\cos \\theta + r^2.`,
		{ marks: 3 }
	);
}
// b
question.addPart(mathlifier`Out of syllabus (roots of unity).`, { marks: 4 });
// c
question.addPart(mathlifier`Out of syllabus (requires previous part).`, { marks: 3 });
