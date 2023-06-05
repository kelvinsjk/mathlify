export const slugs: string[] = ['00-foundation'];

export const title: string[] = ['Foundation with numbers'];

export const shortTitles: string[] = ['Foundation'];

export const descriptions: string[] = [
	`In this chapter, we develop our arithmetic skill with numbers, 
	branching from the familiar whole numbers to fractions and negative numbers.`
];

export const chapters: Chapter[] = [
	{
		slug: slugs[0],
		title: 'Foundation with numbers',
		shortTitle: 'Foundation',
		description: `In this chapter, we develop our arithmetic skill with numbers, 
			branching from the familiar whole numbers to fractions and negative numbers.`,
		sections: [
			{
				slug: '01-fractions',
				title: 'Fractions',
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

interface Chapter extends SubsectionShort {
	sections: SectionShort[];
	shortTitle: string;
	description: string;
}

interface SectionShort extends SubsectionShort {
	subsections: SubsectionShort[];
}

type SubsectionShort = {
	slug: string;
	title: string;
};
