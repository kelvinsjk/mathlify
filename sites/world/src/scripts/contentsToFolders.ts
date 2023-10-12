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
	<svelte:component this={components[element.type]} {...element} />
{/each}
`;

function tsTemplate(title: string) {
	return `import { PageContent } from '$lib';
export const title = "${title}";
const page = new PageContent();



export const content = page.content;
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
				tsTemplate(`Surd ${subsection.title}`)
			);
		});
	});
})();
