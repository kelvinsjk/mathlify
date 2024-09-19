import type { NavNodePlusColor } from '$lib/components/mathlified/Nav.svelte';

const functions: NavNodePlusColor[] = [
	{ name: '2023 P1 Q7', slug: '2023/p1/q7', fileSlug: '', color: 'red' },
	{ name: '2022 P1 Q6', slug: '2022/p1/q6', fileSlug: '', color: 'red' },
	{ name: '2021 P2 Q3', slug: '2021/p2/q3', fileSlug: '', color: 'red' },
	{ name: '2019 P1 Q5', slug: '2019/p1/q5', fileSlug: '', color: 'red' },
	{ name: '2018 P1 Q5', slug: '2018/p1/q5', fileSlug: '', color: 'red' },
	// both functions and graphs
	{ name: '2017 P2 Q3', slug: '2017/p2/q3', fileSlug: '', color: 'red' },
	{ name: '2016 P1 Q10', slug: '2016/p1/q10', fileSlug: '', color: 'red' },
	{ name: '2015 P2 Q3', slug: '2015/p2/q3', fileSlug: '', color: 'red' },
	{ name: '2014 P1 Q1', slug: '2014/p1/q1', fileSlug: '', color: 'red' },
	//! blue/green start
	{ name: '2013 P1 Q3', slug: '2013/p1/q3', fileSlug: '', color: 'blue' },
	// both functions and graphs
	{ name: '2012 P1 Q7', slug: '2012/p1/q7', fileSlug: '', color: 'green' },
	{ name: '2011 P2 Q3', slug: '2011/p2/q3', fileSlug: '', color: 'blue' },
	{ name: '2010 P1 Q5', slug: '2010/p1/q5', fileSlug: '', color: 'green' },
	{ name: '2009 P2 Q3', slug: '2009/p2/q3', fileSlug: '', color: 'blue' },
	{ name: '2008 P2 Q4', slug: '2008/p2/q4', fileSlug: '', color: 'green' },
	// open start
	{ name: '2007 P1 Q2', slug: '2007/p1/q2', fileSlug: '' }
];

const graphs: NavNodePlusColor[] = [
	{ name: '2022 P1 Q10', slug: '2022/p1/q10', fileSlug: '', color: 'red' },
	{ name: '2021 P1 Q6', slug: '2021/p1/q6', fileSlug: '', color: 'red' },
	{ name: '2019 P1 Q3', slug: '2019/p1/q3', fileSlug: '', color: 'red' },
	// both curves and differentiation: to remove from differentiation after this exits red
	{ name: '2017 P1 Q4', slug: '2017/p1/q4', fileSlug: '', color: 'red' },
	// both functions and graphs
	{ name: '2017 P2 Q3', slug: '2017/p2/q3', fileSlug: '', color: 'red' },
	{ name: '2016 P1 Q3', slug: '2016/p1/q3', fileSlug: '', color: 'red' },
	{ name: '2015 P1 Q5', slug: '2015/p1/q5', fileSlug: '', color: 'red' },
	//! blue/green start
	// both curves and equations
	{ name: '2013 P2 Q1', slug: '2013/p2/q1', fileSlug: '', color: 'blue' },
	// both functions and graphs
	{ name: '2012 P1 Q7', slug: '2012/p1/q7', fileSlug: '', color: 'green' },
	// should this be in equations too?
	{ name: '2012 P2 Q3', slug: '2012/p2/q3', fileSlug: '', color: 'green' },
	// should this be in functions too?
	{ name: '2010 P2 Q4', slug: '2010/p2/q4', fileSlug: '', color: 'green' },
	// both graphs and definite integrals
	{ name: '2009 P1 Q4', slug: '2009/p1/q4', fileSlug: '', color: 'blue' },
	{ name: '2009 P1 Q6', slug: '2009/p1/q6', fileSlug: '', color: 'blue' },
	// ! open start
	{ name: '2007 P1 Q5', slug: '2007/p1/q5', fileSlug: '' }
];

export const topicalDirectory: Record<string, NavNodePlusColor[]> = {
	functions,
	graphs
};

export const questionsToTopic: Record<string, string[]> = {};

const iterator: [string, NavNodePlusColor[]][] = [
	['functions', functions],
	['graphs', graphs]
];

for (const [topic, questions] of iterator) {
	for (const qn of questions) {
		if (questionsToTopic[qn.name]) {
			questionsToTopic[qn.name].push(topic);
		} else {
			questionsToTopic[qn.name] = [topic];
		}
	}
}
