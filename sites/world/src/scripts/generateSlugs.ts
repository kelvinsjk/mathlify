import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Contents } from '../lib';
import { kebabCase, flattenDeep } from 'lodash-es';

// takes a contents.ts file and creates an array of file paths

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

(async () => {
	const contents = (await import(`../routes/amath/${process.argv[2]}/contents.ts`))
		.contents as Contents;
	console.log(contents);
	const slugs = contents.map((section) => {
		const subsections = section.subsections.map((subsection) => {
			return [
				{
					section: section.title,
					subsection: subsection.title,
					slug: kebabCase(section.title) + '/' + kebabCase(subsection.title),
				},
			];
		});
		return subsections;
	});
	console.log(flattenDeep(slugs));
	fs.outputFileSync(
		path.resolve(__dirname, `../routes/amath/${process.argv[2]}/slugs.ts`),
		'export const slugs = ' + JSON.stringify(flattenDeep(slugs))
	);
})();
