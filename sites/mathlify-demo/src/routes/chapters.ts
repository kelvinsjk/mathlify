export const chapters: Chapter[] = [
	{
		title: '00-foundation',
		description: 'Foundations with numbers',
		sections: [
			{
				title: '01-fractions',
				description: 'Fractions',
				subsections: [
					{
						title: '01-multiplying-integers',
						description: 'Multiplication with whole numbers'
					},
					{
						title: '02-multiplying-fractions',
						description: 'Multiplication with fractions'
					}
				]
			}
		]
	}
];

type Chapter = {
	title: string;
	description: string;
	sections: Section[];
};

type Section = {
	title: string;
	description: string;
	subsections: Subsection[];
};

type Subsection = {
	title: string;
	description: string;
};
