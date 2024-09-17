import { turso } from '../..';
import { techniques } from '../qns-techniques';

const parts: {
	id: string;
	topic: string;
	section: string;
	subsection: string;
	variant?: number;
}[] = [];

const fnChapter = [
	{
		section: 'concepts',
		subsections: [
			{ subsection: 'intervals' },
			{ subsection: 'domain-and-range', variant: 1 },
			{ subsection: 'domain-and-range', variant: 2 }
		]
	},
	{
		section: 'inverse',
		subsections: [
			{ subsection: 'existence' },
			{ subsection: 'domain' },
			{ subsection: 'formula' },
			{ subsection: 'restriction' },
			{ subsection: 'relationship', variant: 1 },
			{ subsection: 'relationship', variant: 2 }
		]
	},
	{
		section: 'composite',
		subsections: [
			{ subsection: 'existence' },
			{ subsection: 'formula' },
			{ subsection: 'range' },
			{ subsection: 'self-compose' },
			{ subsection: 'compose-inverse' }
		]
	},
	{
		section: 'more',
		subsections: [
			{ subsection: 'self-inverse' },
			{ subsection: 'piecewise' },
			{ subsection: 'modulus' },
			{ subsection: 'discriminant' }
		]
	}
];

const topic = 'functions';
for (const { subsections, section } of fnChapter) {
	for (const { subsection, variant } of subsections) {
		if (variant !== undefined) {
			parts.push({
				id: `functions/${section}/${subsection}/${variant}`,
				topic,
				section,
				subsection,
				variant
			});
		} else {
			parts.push({
				id: `functions/${section}/${subsection}`,
				topic,
				section,
				subsection
			});
		}
	}
}

const result = await turso.insert(techniques).values(parts);

console.log(result);
