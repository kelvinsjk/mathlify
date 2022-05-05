import adapter from '@sveltejs/adapter-auto';
import { kitDocsPlugin } from '@svelteness/kit-docs/node';
import Icons from 'unplugin-icons/vite';
import markdownKatex from 'markdown-it-katex';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],

	kit: {
		adapter: adapter(),

		prerender: {
			default: true,
			entries: ['*']
		},

		vite: {
			plugins: [
				Icons({ compiler: 'svelte' }),
				kitDocsPlugin({
					shiki: {
						theme: 'material-ocean'
					},
					markdown: {
						configureParser: async (parser) => {
							parser.use(markdownKatex);
						}
					}
				})
			],
			resolve: {
				alias: {
					$lib: path.resolve('./src/lib')
				}
			}
		}
	}
};

export default config;
