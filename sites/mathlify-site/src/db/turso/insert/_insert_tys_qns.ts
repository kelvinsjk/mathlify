import { turso } from '../..';
import { tysQuestionsTexts } from '../qns-techniques';

import { question as qn2008 } from '../../../content/h2-3_h2_tys_questions/2008/p2/q4';
import { eq } from 'drizzle-orm';

const qns: {
	id: string;
	year: number;
	paper: number;
	question: number;
	text: string;
}[] = [];

qns.push({
	id: '2008/p2/q4',
	year: 2008,
	paper: 2,
	question: 4,
	text: JSON.stringify(qn2008.question)
});

//const result = await turso.insert(tysQuestionsTexts).values(qns);

const result = await turso
	.select({ text: tysQuestionsTexts.text })
	.from(tysQuestionsTexts)
	.where(eq(tysQuestionsTexts.id, '2008/p2/q4'));
console.log(result);
