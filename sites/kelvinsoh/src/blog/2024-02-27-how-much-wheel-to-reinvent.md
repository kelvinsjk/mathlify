---
title: 'How much of the wheel to reinvent?'
description: 'Thoughts on working on mathlify vs alternatives like Typst'
author: Kelvin Soh
tags: Typst,Ramblings
---

## Sticking with the tried and tested

I like to produce my own material (notes, custom worksheets, question
compilations, etc) and for years my tool of choice has been $\LaTeX$ in
[TeXnicCenter](https://www.texniccenter.org/).

It did a decent job for my purpose and sensibilities then with just enough GUI
elements, syntax highlighting, one-click compilation to PDF and error logs. And
it became my workhorse for the longest time. An unchanging workhorse, given its
last release in 2013, and that I have used it regularly until at least 2020.

## Discovering a more modern approach

I tried venturing into web development in 2020 and eventually discovered
[VS Code](https://code.visualstudio.com/). Having been working with text-editing
experience not that different from [Notepad++](https://notepad-plus-plus.org/)
from the early/mid 2000s, the text editing experience in VS Code felt so
revolutionary. How have I been working the past decade plus without these
tools?!

And with the discovery of the
[LaTeX-Workshop](https://github.com/James-Yu/LaTeX-Workshop) extension along
with personal customizations via
[snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets) I
enjoyed a huge productivity boost.

But yet the increased productivity only left me wanting more: $\LaTeX$ produces
such beautiful output documents, but the language and syntax feels a bit clunky
at times. Moreover, I was starting to experiment with code generation ideas to
further enhance my previous workflow of alternating between calculation tools
(calculators, CASes and the trusty pen and paper or chalk and board) and
markup/typesetting tools to produce content.

Before I knew it, what started as a primarily hobby project to make a math
app/website became much deeper experiments in developing tooling to support the
creation of mathematical content.

## Reinventing the wheel, V0

As the major tools that I know of (late 2000s versions of MATLAB, Mathematica,
SymPy and Markdown) all differed significantly from my personal goals, I decided
to build my own, with very little external dependencies.

The prototype Mathlified framework builds on top of

- JavaScript/Typescript for control flow and general purpose programming
- HTML output via KaTeX
- PDF generation via $\LaTeX$

These are then coordinated via the following custom libraries

- Mathlify CAS to handle mathematical calculations and manipulations
- Mathlifier as a KaTeX wrapper to simplify the generation of mathematical
  markup within JavaScript template strings
- Mathlifier2 to product LaTeX strings instead of KaTeX HTML output
- Vite-plugin-sveltekit-tex to coordinate everything on top of Vite's and
  SvelteKit's infrastructure. A JS/TS file is then all we need to have a Svelte
  webapp/webpage up and running, along with the generation of $\LaTeX$ markup
  and PDF.

## Temml/djot

## Typst
