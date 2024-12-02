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

import { Expression, pi } from 'mathlify';
import { Question } from '$lib/classes/question';
import { mathlifierDj as mathlifier } from 'mathlifier';
import { definiteIntegralString, xAxis } from '$lib/utils/typesetting/math';

export const question = new Question();

const upper = new Expression([[5, '/', 3], pi]);
const integral1 = definiteIntegralString('\\sin^2 x', 0, upper);
const integral2 = definiteIntegralString('\\cos^2 x', 0, upper);
const curve = `{y=x^2 \\sin x,}`;
const halfPi = new Expression([[1, '/', 2], pi]);
const line = `{x = ${halfPi}}`;

// a
question.addPart(
	mathlifier`Find the exact value of $${{}} \\displaystyle ${integral1}.

	Hence find the exact value of ${{}} \\displaystyle ${integral2}.`,
	{ marks: 6 }
);
// b
question.addPart(
	mathlifier`The region ${'R'}
is bounded by the curve ${curve}
the line ${line}
and part of the ${xAxis}
between ${'0'}
and ${halfPi}.
Find`
);
// bi
question.addSubPart(mathlifier`the exact area of ${'R'},`, { marks: 5 });
// bii
question.addSubPart(
	mathlifier`the numerical value of
the volume of revolution formed when ${'R'}
is rotated completely about the ${xAxis},
giving your answer correct to ${3}
decimal places.`,
	{ marks: 2 }
);
