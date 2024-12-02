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
import { modified } from '$lib/utils/typesetting/utils';
import { mathlifierDj as mathlifier } from 'mathlifier';

export const question = new Question();
const pA = 24;
const pB = 0.3;

question.addBody(
	mathlifier`@${modified}
	
	In a large population, ${pA}\\%
have a particular gene ${'A'},
and ${pB.toFixed(1)}\\%
have gene ${'B'}`
);
// a
question.addPart(
	mathlifier`Find the probability that, in a random
sample of ${10}
people from the population, at most ${4}
have gene ${'A'}.`,
	{ marks: 2 }
);
// removed approximation from old syllabus
// b (new : nested binomial)
question.addPart(
	mathlifier`\\* ${100}
samples of ${10}
people are taken from
the population. Find the probability that more than ${90}
of these samples have at most ${4}
having gene ${'A'}.`,
	{ marks: 3 }
);
// c (adapted from (ii)
question.addPart(
	mathlifier`\\* A random sample of ${1000}
people is taken from the population.
Find the probability that at least ${2}
but fewer than ${5}
have gene ${'B'}.`,
	{ marks: 2 }
);
