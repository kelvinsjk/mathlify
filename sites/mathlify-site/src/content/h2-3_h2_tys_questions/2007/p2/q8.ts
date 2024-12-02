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

const matrix = [
	[2.2, 0.5],
	[10.5, 2.1]
];
const rows = ['| --- | :---: | :---: |', '| | Mean mass | Standard deviation |'];
const headings = ['Chickens', 'Turkeys'];
for (let i = 0; i < 2; i++) {
	rows.push(`| ${headings[i]} | ${matrix[0][i].toFixed(1)} | ${matrix[1][i].toFixed(1)} |`);
}
const table = rows.join('\n');
const chickenCost = 3;
const turkeyCost = 5;
const chickenPrice = 7;
const turkeyPrice = 55;
const totalPrice = chickenPrice + turkeyPrice;

question.addBody(
	mathlifier`Chickens and turkeys are sold by weight.
The masses, in kg, of chickens and turkeys are modelled as
having independent normal distributions with means and
standard deviations as shown in the table.

@${table}

Chickens are sold at ${{}}\\$${chickenCost}
per kg and turkeys at ${{}}\\$${turkeyCost}
per kg.`
);
// a
question.addPart(
	mathlifier`Find the probability that a randomly chosen
chicken has a selling price exceeding ${{}}\\$${chickenPrice}.`,
	{ marks: 2 }
);
// b
question.addPart(
	mathlifier`Find the probability of the event that both a randomly chosen
chicken has a selling price exceeding ${{}}\\$${chickenPrice}
and a randomly chosen turkey has a selling price exceeding ${{}}\\$${turkeyPrice}.`,
	{ marks: 3 }
);
// c
question.addPart(
	mathlifier`Find the probability that the total selling price
of a randomly chosen chicken and a randomly chosen turkey is more than
${{}}\\$${totalPrice}.`,
	{ marks: 4 }
);
// d
question.addPart(
	mathlifier`Explain why the answer to part (c) is greater
than the answer to part (b).`,
	{ marks: 1 }
);
