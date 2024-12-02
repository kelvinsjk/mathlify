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

export const question = new Question();

const couples = 6;
const n = couples * 2;

question.addBody(mathlifier`A group of ${n}
people consists of ${couples}
married couples.`);

// a
question.addPart(mathlifier`The group stands in a line.`);
// ai, aii
question.addSubPart(
	mathlifier`Find the number of
different possible orders.`,
	{ marks: 1 }
);
question.addSubPart(
	mathlifier`Find the number of
different possible orders in which each man
stands next to his wife.`,
	{ marks: 3 }
);
// b
question.addPart(mathlifier`The group stands in a circle.`);
// bi, bii, b iii
question.addSubPart(
	mathlifier`Find the number of
different possible arrangements.`,
	{ marks: 1 }
);
question.addSubPart(
	mathlifier`Find the number of
different possible arrangements if men and women alternate.`,
	{ marks: 2 }
);
question.addSubPart(
	mathlifier`Find the number of
different possible arrangements if 
each man stands next to his wife and
men and women alternate.`,
	{ marks: 2 }
);
