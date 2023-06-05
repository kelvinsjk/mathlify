export const chapters: Chapter[] = [
	{
		title: 'Foundation with numbers',
		shortTitle: 'Foundation',
		description: `In this chapter, we develop our arithmetic skill with numbers, 
			branching from the familiar whole numbers to fractions and negative numbers.`,
		sections: [
			{
				title: 'Fractions',
				shortTitle: 'Fractions',
				description: `In this section, we learn how to add, subtract, multiply and divide
        fractions.`,
				subsections: [
					{
						slug: '01-simplifying-fractions',
						title: 'Simplifying fractions'
					},
					{
						slug: '02-multiplying-integers',
						title: 'Multiplication with whole numbers'
					},
					{
						slug: '03-multiplying-fractions',
						title: 'Multiplication with fractions'
					},
					{
						slug: '04-dividing-fractions',
						title: 'Division with fractions'
					},
					{
						slug: '05-dividing-integers',
						title: 'Division with whole numbers'
					}
				]
			}
		]
	}
];

interface Chapter {
	title: string;
	shortTitle: string;
	description: string;
	sections: Section[];
}

interface Section {
	title: string;
	description: string;
	shortTitle: string;
	subsections: Subsection[];
}

type Subsection = {
	slug: string;
	title: string;
};
