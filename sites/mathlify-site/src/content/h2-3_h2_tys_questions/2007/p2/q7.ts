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

const sumX = 4626;
const sumX2 = 147691;
const mu = 30;
const alpha = 5;
const n = 150;

export const question = new Question();

question.addBody(mathlifier`A large number of students in a
college have completed a geography project. The time, ${'x'}
hours, taken by a student to complete the project is noted
for a random sample of ${n}
students. The results are summarised by

$${{}} \\sum x = ${sumX}, \\quad \\sum x^2 = ${sumX2.toLocaleString()}.`);

// a
question.addPart(mathlifier`Find unbiased estimates of the population mean and variance.`, {
	marks: 2
});
// b
question.addPart(
	mathlifier`Test, at the ${alpha}\\%
significance level, whether the population mean time for a student to complete
the project exceeds ${mu}
hours.`,
	{ marks: 4 }
);
// c
question.addPart(
	mathlifier`State, giving a reason, whether any assumptions about
the population are needed in order for the test to be valid.`,
	{ marks: 1 }
);
