import { sumVerbatim, productVerbatim, fraction, brackets, type Expression, quotient } from '../index';
import temml from 'temml';

// ! Integer addition
let qns: Expression[] = [
	sumVerbatim(2, 5), // a + b
	sumVerbatim(2, -5), // a - b
	sumVerbatim(-2, 5), // -a + b
	sumVerbatim(-2, -5), // -a - b
	sumVerbatim(2, brackets(-5)), // a + (-b)
	sumVerbatim(2, ['()', -5]), // shorthand notation
	sumVerbatim(['()', -2], ['()', -5]), // (-a) + (-b)
	sumVerbatim(2, productVerbatim(-1, brackets(-5))), // a - (-b)
	sumVerbatim(2, [-1, brackets(-5)]), // shorthand notation
	sumVerbatim(['()', -2], [-1, ['()', -5]]), // (-a) - (-b)
];
let html = qns.map((qn) => `<div>${temml.renderToString(qn.toString())}</div>`).join('\n');
html += '<hr>\n';
let i = 0;
let answers: string[] = [];
for (const qn of qns) {
	let str = qn.toString();
	if (i < 4) {
		qn.simplify();
		str += ' = ' + qn.toString();
	} else if (i < 7) {
		qn._remove_brackets();
		str += ' = ' + qn.toString();
		str += ' = ' + qn.simplify().toString();
	} else {
		qn._remove_brackets();
		qn.simplify({ product: true });
		str += ' = ' + qn.toString();
		str += ' = ' + qn.simplify().toString();
	}
	answers.push(str);
	i++;
}
html += answers.map((ans) => `<div>${temml.renderToString(ans.toString())}</div>`).join('\n');
document.querySelector<HTMLDivElement>('#integer-addition')!.innerHTML = html;

// ! Multiplication of integers
qns = [
	productVerbatim(2, 5), // a b
	productVerbatim(2, -5), // a (-b)
	productVerbatim(-2, 5), // (-a) b
	productVerbatim(-2, -5), // (-a) (-b)
];
qns.forEach((qn) => (qn.multiplicationSign = ' \\times '));
html = qns.map((qn) => `<div>${temml.renderToString(qn.toString())}</div>`).join('\n');
html += '<hr>\n';
i = 0;
answers = [];
for (const qn of qns) {
	let str = qn.toString();
	if (i < 4) {
		qn.simplify();
		str += ' = ' + qn.toString();
	}
	answers.push(str);
	i++;
}
html += answers.map((ans) => `<div>${temml.renderToString(ans.toString())}</div>`).join('\n');
document.querySelector<HTMLDivElement>('#integer-multiplication')!.innerHTML = html;

// ! Division of integers
qns = [
	fraction(10, 5, { verbatim: true }), // a / b
	fraction(10, -5, { verbatim: true }), // a / (-b)
	quotient(-10, 5, { verbatim: true }), // (-a) / b. uses quotient to avoid the - a/b default typesetting
	fraction(-10, -5, { verbatim: true }), // (-a) / (-b)
];
qns.forEach((qn) => (qn.multiplicationSign = ' \\times '));
html = qns
	.map((qn) => {
		return `<div>${temml.renderToString('\\displaystyle ' + qn.toString())}</div>`;
	})
	.join('\n');
html += '<hr>\n';

i = 0;
answers = [];
for (const qn of qns) {
	let str = qn.toString();
	if (i < 4) {
		qn.simplify();
		str += ' = ' + qn.toString();
	}
	answers.push(str);
	i++;
}
html += answers
	.map((ans) => {
		return `<div>${temml.renderToString('\\displaystyle ' + ans.toString())}</div>`;
	})
	.join('\n');
document.querySelector<HTMLDivElement>('#integer-division')!.innerHTML = html;
