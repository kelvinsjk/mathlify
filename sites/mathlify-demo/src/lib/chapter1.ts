import type { Chapter } from './chapters';

export const chapter1: Chapter = {
	title: 'Algebraic Expressions',
	shortTitle: 'Expressions',
	description: `In this chapter, we start learning about algebraic expressions.`,
	sections: [
		{
			title: 'Fractions',
			shortTitle: 'Fractions',
			description: `In this section, we learn how to add, subtract, multiply and divide
      fractions.`,
			subsections: [
				{
					slug: '01-simplifying-fractions',
					title: 'Simplifying fractions',
					shortTitle: 'Simplification',
				},
				{
					slug: '02-multiplying-integers',
					title: 'Multiplication with whole numbers',
					shortTitle: 'Multiplication 1',
				},
				{
					slug: '03-multiplying-fractions',
					title: 'Multiplication with fractions',
					shortTitle: 'Multiplication 2',
				},
				{
					slug: '04-dividing-fractions',
					title: 'Division with fractions',
					shortTitle: 'Division 1',
				},
				{
					slug: '05-dividing-integers',
					title: 'Division with whole numbers',
					shortTitle: 'Division 2',
				},
				{
					slug: '06-adding-fractions',
					title: 'Addition of fractions',
					shortTitle: 'Addition',
				},
				{
					slug: '07-subtracting-fractions',
					title: 'Subtraction of fractions',
					shortTitle: 'Subtraction',
				},
			],
		},
		{
			title: 'Negative Numbers',
			shortTitle: 'Negatives',
			description: `In this section, we learn how to
        add and subtract, multiply and divide
        negative numbers.`,
			subsections: [
				{
					slug: '01-addition-negative-integers',
					title: 'Plus/minus: negative whole numbers',
					shortTitle: 'Plus/Minus',
				},
				{
					slug: '02-multiplying-negative-integers',
					title: 'Times/divide: negative whole numbers',
					shortTitle: 'Times/Divide',
				},
				{
					slug: '03-simplifying-fractions',
					title: 'Simplification of negative fractions',
					shortTitle: 'Fractions 1',
				},
				{
					slug: '04-fraction-arithmetic',
					title: 'Negative fractions arithmetic',
					shortTitle: 'Fractions 2',
				},
			],
		},
	],
};
