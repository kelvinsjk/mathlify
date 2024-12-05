---
title: 'The Mathlifier manifesto'
description: 'Building a mathematical markup language'
author: Kelvin Soh
tags: Mathlifier
---

## Humble beginnings

As I moved on from Wordpress to writing my own web projects in JavaScript, I
found myself calling `katex.renderToString(...)` over and over again.

This, along with a few opinions (inline mathematics should not break over lines,
displayed mathematics should scroll when overflowing and we do not throw on
errors) led me to create Mathlifier, a simple wrapper around KaTeX.

The project started to grow in scope as I chased the "write once, render
anywhere" paradigm. With development of V3 of the library to start soon, I
thought I should document what we are trying to achieve.

## The core goals

- Content should be easy to write and read.
- Scripting and templating capabilities allow for dynamic content with less
  errors
- Content can be transformed to various output formats
- Built on free and open source technologies

### Readability

LaTeX is probably the language that comes to mind when writing mathematics, but
the syntax isn't ideal for the other capabilities we want to support.

On the other hand, Markdown is easy to learn and write. Mathlifier thus aims to
use a Markdown-like syntax to accomplish its goals.

### Scripting and templating

Scripting and templating capabilities allow for dynamic content to be written
with Mathlifier, supporting the development of app-like interactivity in
addition to static content. Even for static content, we have found that using
scripting and templating features cut down on critical typographical errors.

Jupyter notebooks, RMarkdown and MDX are some examples of the workflow we hope
to achieve in Mathlifier. typst is also an interesting project I try to keep an
eye on as a more print-focused approach with built in scripting and templating.

### Write once, render anywhere

Mathlifier stems from my projects in the educational space. For in person class
work, I still want to create high quality printed materials like the PDFs I can
generate with LaTeX. Meanwhile, mobile devices are now ubiquitous, so supporting
them natively (via responsive web content at this juncture) is how I think we
can best move mathematical educational content forward in the modern age.

## Our current approach

### Djot

I love writing in Markdown, but have suffered numerous paper cuts in developing
around it. When I read John McFarlane's
[Beyond Markdown essay](https://johnmacfarlane.net/beyond-markdown.html) and
found out that he has created [Djot](https://djot.net/) I immediately gave it a
try.

So far it has worked exceedingly well as the base language on which Mathlifier
is built on.

### JavaScript for scripting and templating

I like the JavaScript language and tooling ecosystem, and will use it as the
scripting language behind Mathlifier. The tagged template function is thus a
natural construct to use for templating.

With Djot handling prose markup and JavaScript objects representing more complex
content structures, the main thing the Mathlifier library will need to do is to
enhance the authoring experience around math markup.

### Custom AST on top of Djot

In V2 of Mathlifier, we used three separate functions, `mathlifier`,
`mathlifierDj`, and `mathlifierTex` to convert source material to HTML, Djot and
LaTeX. Djot was the base language if we want to transform from one medium to
another.

The main difficulty in this process is in how the amsmath environments (eg the
`align` environment) is handled: in LaTeX these environments were standalone but
they must be placed in displayed math environments in the HTML formulations.
This led to some inelegant workarounds to make it work.

In V3, we aim to build our own custom AST on top of Djot, which allows for more
graceful transformation between different mediums. We still delegate most of the
work to Djot, but will store "environments" separately in our custom AST. This
can also potentially unlock functionality as users can customize how Mathlifier
handles the environments they want to use.

### Math on the web

While Mathlifier started as a KaTeX wrapper, we have since switched to
[Temml](https://temml.org/).
