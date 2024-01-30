import { Expression, Sum } from '..';
import temml from 'temml';

const qns: Expression[] = [
	new Expression(new Sum(2, 5)),
	new Expression(new Sum(2, -5)),
	new Expression(new Sum(-2, 5)),
	new Expression(new Sum(-2, -5)),
	new Expression(new Sum(2, Expression.brackets(-5))),
	new Expression(new Sum(Expression.brackets(-2), Expression.brackets(-5))),
];
let html = qns.map((qn) => `<div>${temml.renderToString(qn.toString())}</div>`).join('\n');
html += '<hr>\n';

let i = 0;
const extra: Expression[] = [];
for (const qn of qns) {
	if (i < 4) {
		qn.simplify();
	} else {
		qn._remove_brackets();
		const q2 = qn.clone();
		extra.push(q2.simplify());
	}
	i++;
}
qns.push(...extra);

html += qns.map((qn) => `<div>${temml.renderToString(qn.toString())}</div>`).join('\n');

document.querySelector<HTMLDivElement>('#app')!.innerHTML = html;
