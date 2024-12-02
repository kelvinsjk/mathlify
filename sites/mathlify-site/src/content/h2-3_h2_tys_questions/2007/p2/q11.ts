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

const times = [15, 30, 60, 90, 120, 150, 180, 240, 300];
const concentrations = [82, 65, 43, 37, 22, 19, 12, 6, 2];
const rows: string[] = [];
rows.push(`| --- | ${times.reduce((prev) => prev + ` :---: |`, '')}`);
rows.push(
	`| Time $ {(t \\text{ minutes})} $ | ${times.reduce((prev, curr) => prev + ` ${curr} |`, '')} `
);
rows.push(
	`| Concentration $\\text(x \\text{ micrograms}$ $\\text{per litre)}$ | ${concentrations.reduce((prev, curr) => prev + ` ${curr} |`, '')} `
);
const table = rows.join('\n');
const r = -0.912;
const t = 300;
const c = 15;
const tString = `{t=${t},}`;

question.addBody(
	mathlifier`Research is being carried our into how
the concentration of a drug in the bloodstream varies with time,
measured from when the drug is given.
Observations at successive times give the data shown in the
following table.

@${table}

It is given that the value of the
product moment correlation coefficient for this data is ${r.toFixed(3)},
correct to ${3}
decimal places. The scatter diagram for the data is shown below.

![scatter diagram](/images/h2/tys/2007_p2_q11_scatter.png)

`
);
// a
question.addPart(
	mathlifier`Calculate the equation of the regression line of ${'x'}
on ${'t'}.`,
	{ marks: 2 }
);
// b
question.addPart(
	mathlifier`Calculate the corresponding estimated value of ${'x'}
when ${tString}
and comment on the suitability of the linear mode.`,
	{ marks: 2 }
);
// c
question.addPart(
	mathlifier`The variable ${'y'}
is defined by ${{}} {y=\\ln x.}
For the variables ${'y'}
and ${'t'},`
);
question.addSubPart(
	mathlifier`calculate the product moment correlation coefficient
and comment on its value,`,
	{ marks: 2 }
);
question.addSubPart(mathlifier`calculate the equation of the appropriate regression line.`, {
	marks: 2
});
// d
question.addPart(
	mathlifier`Use a regression line to give the best estimate that you can
of the time when the drug concentration is ${c}
micrograms per litre.`,
	{ marks: 2 }
);
