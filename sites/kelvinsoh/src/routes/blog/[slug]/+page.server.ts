import { _get_blog_data } from '../+page.server';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import type { Tokens } from 'marked';
import temml from 'temml';

export const prerender = true;

export async function load({ params }) {
	const posts = await _get_blog_data();
	const post = posts.find((post) => post.slug === params.slug);

	if (!post) error(404);

	const content = await render_content(post.content);

	return {
		post: {
			...post,
			content
		}
	};
}

async function render_content(content: string) {
	const math = {
		name: 'math',
		level: 'inline',
		start(src: string) {
			return src.indexOf('$');
		}, // Hint to Marked.js to stop and check for a match
		tokenizer(src: string) {
			const displayMatch = src.match(/^\$\$([^$\n]+?)\$\$/); // only matches start of src
			const inlineMatch = src.match(/^\$([^$\n]+?)\$/); // only matches start of src

			if (displayMatch) {
				const trimText = displayMatch[1].trim();

				return {
					type: 'math',
					raw: displayMatch[0],
					text: trimText,
					displayMode: true
				};
			} else if (inlineMatch) {
				const trimText = inlineMatch[1].trim();
				return {
					type: 'math',
					raw: inlineMatch[0],
					text: trimText,
					displayMode: false
				};
			}
		},
		renderer(token: Tokens.Generic) {
			return temml.renderToString(token.text, {
				throwOnError: false,
				displayMode: token.displayMode
			});
		}
	};

	marked.use({ extensions: [math] });
	const transformed_content = await marked.parse(content);
	return transformed_content;
}
