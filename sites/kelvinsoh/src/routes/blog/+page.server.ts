import { extractFrontmatter } from './utils';

export const prerender = true;
// modified from
// https://github.com/sveltejs/svelte/blob/svelte-4/sites/svelte.dev/src/lib/server/blog/index.js
// on 2024-01-11

const BLOG_NAME_REGEX = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;

export async function _get_blog_data() {
	const base = './src/blog';
	const { readdir, readFile } = await import('node:fs/promises');

	const blog_posts: BlogPost[] = [];
	for (const file of (await readdir(base)).reverse()) {
		if (!BLOG_NAME_REGEX.test(file)) continue;

		const { date, date_formatted, slug } = get_date_and_slug(file);
		const { metadata, body } = extractFrontmatter(await readFile(`${base}/${file}`, 'utf-8'));
		const authors = metadata.author.split(',').map((author) => author.trim());
		const authorUrls = metadata.authorURL?.split(',').map((author) => author.trim()) ?? [];
		if (metadata.draft !== 'true') {
			blog_posts.push({
				date,
				date_formatted,
				content: body,
				description: metadata.description,
				draft: metadata.draft === 'true',
				slug,
				title: metadata.title,
				file,
				authors: authors.map((author, i) => ({
					name: author,
					url: authorUrls[i]
				}))
				//sections: await get_sections(body)
			});
		}
	}
	return blog_posts;
}

export async function load() {
	const blog_posts = await _get_blog_data();
	return {
		posts: blog_posts.map(({ slug, date, date_formatted, title, description, draft }) => ({
			slug,
			date,
			date_formatted,
			title,
			description,
			draft
		}))
	};
}

interface BlogPost {
	title: string;
	description: string;
	date: string;
	date_formatted: string;
	draft: boolean;
	slug: string;
	file: string;
	authors: {
		name: string;
		url?: string;
	}[];
	content: string;
}

function get_date_and_slug(filename: string) {
	const match = BLOG_NAME_REGEX.exec(filename);
	if (!match) throw new Error(`Invalid filename for blog: '${filename}'`);

	const [, date, slug] = match;
	const [y, m, d] = date.split('-');
	const date_formatted = `${months[+m - 1]} ${+d} ${y}`;

	return { date, date_formatted, slug };
}

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
