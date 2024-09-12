import { turso } from '../..';
import { tysQuestionsToTechniques } from '../qns-techniques';

const qs: [string, string][] = [
	// ['2021/p2/q3/a/i', 'functions/composite/formula'],
	// ['2021/p2/q3/b/i', 'functions/concepts/domain-and-range/2'],
	// ['2021/p2/q3/b/ii', 'functions/inverse/formula']
	// ['2019/p1/q5/a', 'functions/inverse/formula'],
	// ['2019/p1/q5/a', 'functions/inverse/domain'],
	// ['2019/p1/q5/b', 'functions/composite/formula'],
	// ['2018/p1/q5', 'functions/composite/formula'],
	// ['2018/p1/q5', 'functions/composite/compose-inverse'],
	// ['2017/p2/q3/a/iv', 'functions/inverse/relationship/2'],
	// ['2017/p2/q3/b/i', 'functions/concepts/domain-and-range/2'],
	// ['2017/p2/q3/b/ii', 'functions/composite/self-compose'],
	// ['2017/p2/q3/b/ii', 'functions/composite/compose-inverse'],
	// ['2016/p1/q10/a/i', 'functions/inverse/formula'],
	// ['2016/p1/q10/a/i', 'functions/inverse/domain'],
	// ['2016/p1/q10/a/ii', 'functions/composite/formula'],
	// ['2016/p1/q10/a/ii', 'functions/composite/compose-inverse'],
	// ['2016/p1/q10/b/i', 'functions/more/piecewise'],
	// ['2015/p2/q3/a/i', 'functions/inverse/existence'],
	// ['2015/p2/q3/a/ii', 'functions/inverse/formula'],
	// ['2015/p2/q3/a/ii', 'functions/inverse/domain'],
	// ['2015/p2/q3/b', 'functions/more/discriminant']
	// ['2014/p1/q1/a', 'functions/composite/self-compose'],
	// ['2014/p1/q1/a', 'functions/inverse/formula'],
	// ['2014/p1/q1/b', 'functions/composite/compose-inverse']
	// ['2007/p1/q2/a', 'functions/composite/existence'],
	// ['2007/p1/q2/a', 'functions/composite/formula'],
	// ['2007/p1/q2/b', 'functions/inverse/domain'],
	// ['2007/p1/q2/b', 'functions/inverse/formula']
	// ['2008/p2/q4/b', 'functions/inverse/formula'],
	// ['2008/p2/q4/b', 'functions/inverse/domain'],
	// ['2008/p2/q4/d', 'functions/inverse/relationship/1'],
	// ['2009/p2/q3/a', 'functions/inverse/formula'],
	// ['2009/p2/q3/a', 'functions/composite/compose-inverse'],
	// ['2009/p2/q3/a', 'functions/concepts/domain-and-range/1'],
	// ['2009/p2/q3/b', 'functions/composite/existence'],
	// ['2010/p2/q4/b', 'functions/inverse/restriction'],
	// ['2010/p2/q4/c', 'functions/composite/formula'],
	// ['2010/p2/q4/e', 'functions/composite/range'],
	// ['2011/p2/q3/a', 'functions/inverse/formula'],
	// ['2011/p2/q3/a', 'functions/inverse/domain'],
	// ['2011/p2/q3/c', 'functions/inverse/relationship/1'],
	// ['2012/p1/q7/a', 'functions/more/self-inverse'],
	// ['2013/p2/q1/a', 'functions/composite/existence'],
	// ['2013/p2/q1/b', 'functions/composite/formula'],
	// ['2022/p1/q6/b', 'functions/inverse/formula'],
	// ['2022/p1/q6/c', 'functions/composite/self-compose'],
	// ['2022/p1/q6/c', 'functions/composite/compose-inverse'],
	// ['2022/p1/q6/d', 'functions/more/self-inverse'],
	// ['2023/p1/q7/b', 'functions/concepts/domain-and-range/1'],
	// ['2023/p1/q7/c', 'functions/composite/self-compose'],
	// ['2023/p1/q7/c', 'functions/composite/existence'],
	// ['2023/p1/q7/d', 'functions/inverse/restriction'],
	// ['2023/p1/q7/e', 'functions/inverse/formula'],
	// ['2023/p1/q7/e', 'functions/inverse/domain']
	['2023/p1/q7/e', 'functions/more/modulus']
];
const parts = qs.map(([question, technique]) => ({
	question,
	technique
}));
const result = await turso.insert(tysQuestionsToTechniques).values(parts);

console.log(result);

// TODO: 2017/p2/q3/a: transformations
// TODO: 2010/p2/q4/a: graphs (rational)
// TODO: 2010/p2/q4/d: rational inequalities
// TODO: 2011/p2/q3/c: GC technique (zero)
// TODO: 2012/p1/q7/b: graphs (rational)
// TODO: 2012/p1/q7/c: transformations
// TODO: 2022/p1/q6/a: transformations
// TODO: 2023/p1/q7/a: graphs (rational), transformations (modulus)

// Weird questions
// TODO: 2016/p1/q10/b/ii: inverse existence 2?
