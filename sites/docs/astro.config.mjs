import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import startlightBlog from "starlight-blog";
import starlightLinksValidator from "starlight-links-validator";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlightLinksValidator(),
    startlightBlog({
      authors: {
        kelvinsoh: {
          name: "Kelvin Soh",
          url: "https://github.com/kelvinsjk",
        },
      },
    }),
    starlight({
      title: "My Docs",
      social: {
        github: "https://github.com/kelvinsjk/mathlify",
      },
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", link: "/guides/example/" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
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
