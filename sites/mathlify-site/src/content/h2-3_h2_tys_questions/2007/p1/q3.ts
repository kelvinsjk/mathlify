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

import { Expression, i, sum } from 'mathlify';
import { Question } from '$lib/classes/question';
import { mathlifierDj as mathlifier } from 'mathlifier';

export const question = new Question();

// ww^* + 2w = 3 + 4i

const w = new Expression('w');
const wStar = new Expression('w^*');
const lhs = sum([w, wStar], [2, w]);
const rhs = sum(3, [4, i]);
const aPlusBI = sum('a', [i, 'b']);

// a
{
	question.addPart(mathlifier`Out of syllabus (complex locus).`, { marks: 3 });
}
// b
{
	question.addPart(
		mathlifier`The complex number ${w}
is such that

$${lhs} = ${rhs},

where ${wStar}
is the complex conjugate of ${w}.
Find ${w}
in the form ${aPlusBI},
where ${'a'}
and ${'b'}
are real.`,
		{ marks: 4 }
	);
}
