# About Mathlify

Under construction...

## Main areas

### Learn

In this section, we provide notes and learning

### Solutions

In this section, we provide worked answers and solutions to past national
examinations. A focus of these solutions is content responsive to different
screen sizes and the use of the Mathlify computer algebra system

## Motivation

Free and open source whenever possible.

We also aim for a local-first paradigm instead of the more traditional
server-centric design.

### Pro features

Some features may be monetized in the future. At the moment, these content are
stored on a cloud database. We remain committed to the development of the core
mathlify features (the tech, and the content under "learn" and "solutions" at
the very least) under open source, but are leaving the possibility of
monetization for more advanced features (typically those that helps fellow
educators save time and effort)

## The plumbing

The key technologies behind this are:

### Mathlify Computer Algebra System

The Mathlify Computer Algebra System (CAS) is a CAS designed for presenting
mathematical content. It is a JavaScript/Typescript library that facilitates the
ease of authoring content in an interactive environment.

### Markup

We like the simplicity of markdown, but have run into bugs caused by various
edge cases with markdown. By using Djot, we are able to keep a markdown-like
syntax and have been able to get a more consistent developer experience. With
Djot not being HTML-centric, we believe that our content can be more easily
ported to $`\LaTeX`/PDFs for a "write once, run everywhere" experience.

For mathematical markup, we are partial to Temml, which I believe is a good
modern alternative to MathJax and KaTeX.

### Website/App

We are powered by Svelte(Kit), with local $`\LaTeX` integration powered by the
Mathlified framework which runs as a Vite plugin.

In the future, we may bring in interactive input to help students check their
answers. We have worked with MathLive in the past and think it's the best open
source solution at the moment

We are using shadcn svelte for some of the components and theming, and Supabase
for database storage, but aren't particular tied to these and may swap them out
any time.
