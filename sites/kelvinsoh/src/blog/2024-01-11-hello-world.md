---
title: 'Hello world'
description: 'The customary hello world post'
author: Kelvin Soh
tags: temml
---

The customary hello world post.

## MathML

I have been using [KaTeX](https://katex.org/) for the longest
time. However, after reading about
[the completion of the MathML in Chromium project](https://mathml.igalia.com/),
I think MathML should be the way to go going forward.

[Temml](https://temml.org/) seems really promising and is what this
site uses.

## Temml

> The solutions to the quadratic equation
> $ax^2 + bx + c = 0$ where $a \neq 0$
> are
> $$ x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}. $$

I am already getting decent results without
including any of the css stylesheets and fonts.
(Note to self: remember this
and add them if I ever encounter any issues).

## Tangent

As an aside, I currently maintain a KaTeX
wrapper library and
forgetting to load the required
css stylesheet is the most common source of
support requests.
