---
title: 'Markup showdown'
description:
  'Designing the markup language for the Mathlified framework and exploring Djot'
author: Kelvin Soh
tags: Djot,Mathlified
---

## The Mathlified framework

The Mathlify CAS I have been blogging about is part of my efforts in creating a
more general framework (which I call Mathlified) to author mathematical content.

I will hopefully get around to blogging more about Mathlified, but for now the
main goals are:

- Code design: idiomatic source code that mimics mathematical writing and is
  easy to maintainable
- Cross-platform: support multiple targets from a single source of truth. At
  minimum that will include html and tex/pdf
- Free and open-source: licensed permissively and built on top of open source
  projects

## Markup languages

To accomplish the first two goals, we will need to transform our mathematical
ideas into the final content for consumption. This will involve a markup
language of some sort, and these are the options I have ruminated on:

### LaTeX

$\LaTeX$ is arguably the canonical way to write mathematics digitally. It
handles mathematically typesetting and produces beautiful documents, especially
suited for printouts and for viewing on larger screens.

However, using it as the base language to build Mathlified on top of feels
problematic. The language itself has always looked a bit clunky. "Developer
experience" (DX) is not ideal: for example, a minor syntax error or typo could
lead to crashes with a blank output which makes for a bad feedback loop.

The relatively steep learning curve of the language will also be made even
steeper when we introduce dynamic elements the framework aims to support. My
initial explorations make me convinced that we should be able to design a system
that is easier to learn so authors who do not already know $\LaTeX$ can still
produce high quality content with a gentler learning curve.

### HTML

My original inspiration for the Mathlified framework comes from my work in
building a web app in [Svelte](https://svelte.dev/). The modern responsive
design philosophy in building web pages/apps is ideal for creating content
suitable for the ubiquitous mobile screens.

HTML is then a natural candidate for our markup, with libraries like
[MathJax](https://www.mathjax.org/), [$\KaTeX$](https://www.katex.org/) or
[Temml](https://www.temml.org/) handling the mathematical typesetting. It is
unfortunately too verbose for the content-heavy use we have in mind to type by
hand.

### Custom DSL

A custom domain-specific language (DSL) built from scratch will allow us to
design all the features we want, but the cost in building out all the necessary
tooling to support it makes this option a non-starter for a solo hobby project.

### Markdown

This post, like in many developer blogs, is written in markdown. It is easy to
learn, very readable, and specifically speaks to my sensibilities given the
ASCII game guides I wrote on GameFAQs in the later 1990s to early 2000s.

It works best for static content, but projects like [MDX](https://mdxjs.com/)
and [mdsvex](https://mdsvex.pngwn.io/) have shown it can be modified to work
with dynamic elements.

Writing Markdown is a joy, and working with it with the many libraries and
plugins out there is almost always great. Until you run into a thorny edge case.
And in trying to fix what seems like a simple problem dive into a rabbit hole of
the problems with it (see John MacFarlane's
[blog post "Beyond Markdown"](https://johnmacfarlane.net/beyond-markdown.html)
and pngwn's
[proposal for penguin-flavoured-markdown](https://gist.github.com/pngwn/0ec0c35e49219dca297677e60efbf9b5)
for two of my favorite deep dives on this topic).

These issues, and the complexities of tying dynamic features and mathematical
markup within Markdown prevents me from going full-in on adopting Markdown.

### DSL built on top of JavaScript

The most promising of the explorations so far is to build a DSL on top of an
existing programming language.

Python and JavaScript are the typical recommendations for a first programming
language. I am especially partial to the latter, preferring its syntax and
ecosystem. Moreover, given that mobile is a key target for the project, using
JavaScript will allow us to author highly interactive content in a common
language.

We then have programming concepts like control flow and tooling like syntax
highlighting for free. To convert to content, we then provide a library/function
to convert our custom DSL into the output language (eg $\LaTeX$ or HTML). The
following example is a sample of how we envision our DSL will look like, where
we incorporate elements from markdown and JavaScript template literals/tag
functions.

```js
import { mathlify } from 'mathlifier';
// assigning variables, control flow
const a = 2;
const b = 3;
const x = -b / a;
// convert to content
const content = mathlify`# Roots of polynomials

## Solving linear equations

The root of the equation
${a}x + ${b} = 0
is ${x}.
`;
```

## Exploring djot

I just found out about [Djot](https://djot.net/), John MacFarlane's new markup
project. My initial exploration reading the docs and playing around with it is
very promising, and I am strongly considering using djot as the "backbone" of
the markup portion of Mathlified.

Our DSL will then mainly focus on handling mathematics (both static and dynamic,
potentially coming from the Mathlify CAS) to produce djot markup. We then
convert this markup into $\LaTeX$ and HTML/Svelte components for the write once,
run everywhere (where everywhere = pdf + web) experience we are targeting.
