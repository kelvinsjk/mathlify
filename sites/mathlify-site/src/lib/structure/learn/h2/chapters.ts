import type { ChapterOnly } from '$lib/types/learn';

export const chapters: ChapterOnly[] = [
	{ title: 'Equations and inequalities', shortTitle: 'Eqns & Inequalities', slug: 'eqns' },
	{ title: 'Functions', shortTitle: 'Functions', slug: 'fns' },
	{ title: 'Graphs and transformations', shortTitle: 'Graphs', slug: 'graphs' },
	{ title: 'Sequences and series', shortTitle: 'AP/GP', slug: 'apgp' },
	{
		title: 'Differentiation I: implicit differentiation and parametric curves',
		shortTitle: 'Differentiation I',
		slug: 'differentiation-1',
	},
	{
		title: 'Differentiation II: maxima, minima and rates of change',
		shortTitle: 'Differentiation II',
		slug: 'differentiation-2',
	},
	{ title: 'Maclaurin series', shortTitle: 'Maclaurin', slug: 'maclaurin' },
	{ title: 'Integration techniques', shortTitle: 'Integration', slug: 'integration' },
	{
		title: 'Definite integrals: areas and volumes',
		shortTitle: 'Integration II',
		slug: 'integration-2',
	},
	{ title: 'Differential equations', shortTitle: 'DEs', slug: 'de' },
	{
		title: 'Vectors I: basics, dot and cross products',
		shortTitle: 'Vectors I',
		slug: 'vectors-1',
	},
	{ title: 'Vectors II: lines and planes', shortTitle: 'Vectors II', slug: 'vectors-2' },
	{ title: 'Complex numbers', shortTitle: 'Complex', slug: 'complex' },
];
