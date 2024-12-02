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
import { quotient } from 'mathlify';

export const question = new Question();

const p = quotient(1, 8);

question.addBody(mathlifier`A player throws three darts at a target.
The probability that he is successful in hitting the target with
his first throw is ${p}.
For each of his second and third throws, the probability of success is

- twice the probability of success on the preceding throw if that throw was successful,
- the same as the probability of success on the preceding throw if that throw was unsuccessful.`);
// a
question.addPart(mathlifier`Construct a probability tree showing this information.`, { marks: 3 });
// b
question.addPart(mathlifier`Find`);
question.addSubPart(`the probability that all three throws are successful,`, { marks: 2 });
question.addSubPart(`the probability that at least two throws are successful,`, { marks: 2 });
question.addSubPart(
	`the probability that the third throw is successful
given that exactly two of the three throws are successful.`,
	{ marks: 4 }
);
