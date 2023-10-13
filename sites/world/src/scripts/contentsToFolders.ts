import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Contents } from '../lib';
import { kebabCase } from 'lodash-es';

// takes a contents.ts file and creates the folders and files for the subsections
// current base directory is 'src/routes/amath/'

const svelteTemplate = `<script lang="ts">
	import { components } from '$lib/components';
	import { content, title } from './content';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<h1>{title}</h1>

{#each content as element}
	{@const type = element.type}
	{#if type === 'h2' || type === 'h3' || type === 'p' || type === 'display'}
		<svelte:component this={components[element.type]} {...element.props} />
	{:else if type === 'example'}
		<svelte:component this={components[element.type]} {...element.props} />
	{:else if type === 'iExample'}
		<svelte:component this={components[element.type]} {...element.props} />
	{:else if type === 'iQn'}
		<svelte:component this={components[element.type]} {...element.props} />
	{:else}
		{console.log(element)}
		<p>Error: Unknown element received</p>
	{/if}
{/each}
`;

function tsTemplate(title: string) {
	return `import { PageContent } from '$lib';
import { sample, sampleSize, shuffle } from 'lodash-es';
import { math } from 'mathlifier';
import { parts } from '$lib/typesetting/parts';

export const title = "${title}";

const page = new PageContent();
// intro
page.display(\`\`);
page.text(\`In this section, we will investigate .\`);
// example
page.iExample(exampleGen, exampleArgs, { initialArgs: [3, 4], plural: true });
// practice
const preamble = \`.\`;
page.iQn(qnGen, qnArgs, { preamble, initialArgs: new Array(4).fill([5, 12]) });

export const content = page.content;

function exampleGen(base: number): string {
	const q1 = \`\${math(\`\`)}\`;
	const q2 = \`\${math(\`\`)}\`;
	const q3 = \`\${math(\`\`)}\`;
	const q4 = \`\${math(\`\`)}\`;
	return parts(q1, q2, q3, q4);
}

function exampleArgs(): number {
	return 0;
}

function qnGen(...bases: number[]): [string, string] {
	let qns: [string, string][] = [];
	bases.forEach((base,i)=>{

	})
	qns = shuffle(qns);
	return [parts(...qns.map((x) => x[0])), parts(...qns.map((x) => x[1]))];
}

function qnArgs(): number[] {
	return [];
}
`;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

(async () => {
	const contents = (await import(`../routes/amath/${process.argv[2]}/contents.ts`))
		.contents as Contents;
	console.log(contents);
	contents.forEach((section) => {
		const sectionTitle = kebabCase(section.title);
		section.subsections.forEach((subsection) => {
			if (subsection.title === 'Basics I') return;
			if (subsection.title === 'Basics II') return;
			const subsectionTitle = kebabCase(subsection.title);
			fs.outputFileSync(
				path.resolve(
					__dirname,
					`../routes/amath/${process.argv[2]}/${sectionTitle}/${subsectionTitle}/+page.svelte`
				),
				svelteTemplate
			);
			fs.outputFileSync(
				path.resolve(
					__dirname,
					`../routes/amath/${process.argv[2]}/${sectionTitle}/${subsectionTitle}/content.ts`
				),
				tsTemplate(
					`${process.argv[2][0].toUpperCase()}${process.argv[2].slice(1)} ${subsection.title}`
				)
			);
		});
	});
})();
