export const sections = [
	{
		title: 'Concepts of function, domain and range',
		shortTitle: 'Concepts',
		slug: '01-concepts',
		subsections: [
			{ title: 'Describing sets of real numbers', slug: '01-interval', shortTitle: 'Interval' },
			{ title: 'Function, domain and range', slug: '02-functions', shortTitle: 'Functions' },
		],
	},
	{
		title: 'Inverse functions',
		shortTitle: 'Inverse',
		slug: '02-inverse',
		subsections: [
			{
				title: 'Existence of inverse functions',
				slug: '01-existence',
				shortTitle: 'Inverse existence',
			},
			{
				title: 'Domain and range of inverse functions',
				slug: '02-domain',
				shortTitle: 'Domain and range',
			},
			{
				title: 'Formula of inverse functions',
				slug: '03-formula',
				shortTitle: 'Finding the inverse',
			},
			{ title: 'Domain restriction', slug: '04-restriction', shortTitle: 'Domain restriction' },
			{
				title: 'Relationship between a function and its inverse',
				slug: '05-relationship',
				shortTitle: 'Inverse relationship',
			},
		],
	},
	{
		title: 'Composite functions',
		shortTitle: 'Composite',
		slug: '03-composite',
		subsections: [
			{
				title: 'Existence of composite functions',
				slug: '01-existence',
				shortTitle: 'Composite existence',
			},
			{
				title: 'Formula and domain of composite functions',
				slug: '02-formula',
				shortTitle: 'Formula and domain',
			},
			{ title: 'Range of composite functions', slug: '03-range', shortTitle: 'Composite range' },
			{
				title: 'Special composite functions I',
				slug: '04-special-1',
				shortTitle: 'Special composite 1',
			},
			{
				title: 'Special composite functions II',
				slug: '05-special-2',
				shortTitle: 'Special composite 2',
			},
		],
	},
	// {
	// 	title: 'More on functions',
	// 	shortTitle: 'More',
	// 	slug: '04-more',
	// 	subsections: [
	// 		{ title: 'Self inverse functions', slug: '01-self-inverse', shortTitle: 'Self inverse' },
	// 		{ title: 'Piecewise functions', slug: '02-piecewise', shortTitle: 'Piecewise' },
	// 		{ title: 'Modulus functions', slug: '03-modulus', shortTitle: 'Modulus' },
	// 		{ title: 'Repeating functions', slug: '04-repeating', shortTitle: 'Repeating' },
	// 		{
	// 			title: 'Using the quadratic discriminant',
	// 			slug: '05-discriminant',
	// 			shortTitle: 'Discriminant',
	// 		},
	// 	],
	// },
];

export const subsections = sections
	.map((s) =>
		s.subsections.map((ss) => ({ sectionSlug: s.slug, sectionShortTitle: s.shortTitle, ...ss })),
	)
	.flat();
