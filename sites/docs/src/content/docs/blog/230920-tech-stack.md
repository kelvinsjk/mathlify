---
title: Our tech stack
date: 2023-09-20
tags:
  - Setup
authors: 
	- kelvinsoh
slug: blog/tech-stack
---

This post highlights the tech stack behind Mathlify Docs.

## Astro Starlight

This project is built primarily using [Astro Starlight](https://starlight.astro.build).
My go-to framework for documentation has so far been the excellent
[VitePress](https://vitepress.dev/) but given that most of my projects are
done in [SvelteKit](https://kit.svelte.dev/), there is a bit of overhead in reusing
code across projects.

My hope is that Astro Starlight will give a good set of defaults for authoring
documentation, while the underlying Astro framework can be used to work with
Svelte code. I am also interested to explore other frameworks like Vue and React
so having a codebase that supports all of them will be a plus.

## Blog

The blog layout integration is done using [starlight-blog](https://github.com/HiDeoo/starlight-blog)
by [HiDeoo](https://github.com/HiDeoo/).

## Math

As our content is markdown-based, we render math/$\LaTeX$ using
the [remark-math](https://www.npmjs.com/package/remark-math)
and [rehype-katex](https://www.npmjs.com/package/rehype-katex) plugins.

The [KaTeX](https://katex.org/) css is added to our site layout using
the starlight config option.

For cases where I want to do some calculations in javascript and use the results as
part of the content, I use MDX along with the
`mathlify-x` library (under construction). I will blog about this as I explore
this idea further.

## Astro config file reference

```js
// astro.config.mjs
export default defineConfig({
  integrations: [
    // ...
    starlightBlog(),
    starlight({
      // ...
      head: [
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
            integrity:
              "sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn",
            crossorigin: "anonymous",
          },
        },
      ],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
```

## PSA: markdown plugin versions

As of the time of writing, Astro is of version 3.1.2 using a markdown-remark system that
corresponds to version 10.x.x of [unified](https://github.com/unifiedjs/unified).
The latest versions of remarkMath (6.0.0) aligns with the new major version of unified (11.0.x),
and caused issues with showing displayed mathematics. Switching to remarkMath version 5.1.x resolved
the issue, and I will stick with that until Astro updates to the latest unified version.
