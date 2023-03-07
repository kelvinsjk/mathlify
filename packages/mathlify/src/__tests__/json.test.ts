import { test, suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Fraction, Term, Expression, Polynomial, JSONParse, SquareRoot, Imaginary } from '../index';

const json = suite('json methods');

const oneSixth = new Fraction(1, 6);
const oneSixthJSON = JSON.stringify(oneSixth);
const oneSixthParsed = JSONParse(oneSixthJSON) as Fraction;
const oneSixthX = new Term(oneSixth, 'x');
const oneSixthXJson = JSON.stringify(oneSixthX);
const oneSixthXParsed = JSONParse(oneSixthXJson) as Term;
const oneSixthX1 = new Expression(oneSixthX, 1);
const oneSixthX1Json = JSON.stringify(oneSixthX1);
const oneSixthX1Parsed = JSONParse(oneSixthX1Json) as Expression;
const oneSixthX2 = new Polynomial([oneSixth, 2]);
const oneSixthX2Json = JSON.stringify(oneSixthX2);
const oneSixthX2Parsed = JSONParse(oneSixthX2Json) as Polynomial;
const mixed = [oneSixth, oneSixthX2];
const mixedJson = JSON.stringify(mixed);
const [oneSixthV2, oneSixthX2V2] = JSONParse(mixedJson) as [Fraction, Polynomial];
const sixthRoot2 = new SquareRoot(2, oneSixth);
const i = new Imaginary();

json('single item', () => {
	//assert.throws(() => JSONParse('{"type":"impossible","args":[1]}'));
	assert.is(oneSixthJSON, '{"type":"fraction","args":[1,6]}');
	assert.is(JSON.stringify(i), '{"type":"imaginary","args":[{"type":"fraction","args":[1,1]}]}');
	assert.is(oneSixthParsed.isEqualTo(oneSixth), true);
	//assert.is(oneSixthXJson, '{"type":"term","args":[{"type":"fraction","args":[1,6]},"x"]}');
	assert.is(oneSixthXParsed.toString(), '\\frac{1}{6} x');
	//assert.is(
	//	oneSixthX1Json,
	//	'{"type":"expression","args":[{"type":"term","args":[{"type":"fraction","args":[1,6]},"x"]},{"type":"term","args":[{"type":"fraction","args":[1,1]},""]}]}',
	//);
	assert.is(oneSixthX1Parsed.toString(), '\\frac{1}{6} x + 1');
	//assert.is(
	//	oneSixthX2Json,
	//	'{"type":"polynomial","args":[[{"type":"fraction","args":[1,6]},{"type":"fraction","args":[2,1]}],{"ascending":false,"degree":1,"variableAtom":"x"}]}',
	//);
	assert.is(oneSixthX2Parsed.toString(), '\\frac{1}{6} x + 2');
	assert.is(oneSixthV2.isEqualTo(oneSixth), true);
	assert.is(oneSixthX2V2.toString(), '\\frac{1}{6} x + 2');
	assert.is(`${JSONParse(JSON.stringify(sixthRoot2))}`, `\\frac{1}{6} \\sqrt{2}`);
});

json.run();
