---
title: 'Yet another rewrite'
description: 'Taking a step back to push forward'
author: Kelvin Soh
tags: Mathlify
---

## Picking things back up

Sometimes life gets in your way and the combination of other commitments and
decreased motivation meant a couple of months without much work on the Mathlify
project.

I picked things back up a week ago and decided to undertake (yet) another
rewrite to prune the parts of the existing codebase. There were a bit too many
random hacks and workarounds in getting the certain features, and I think the
restructuring of the code has made things better.

In fact, I have now been able to add features (the major one being calculus
operations) relatively effortlessly (much to my surprise).

We can now handle solving and typesetting the solutions for all of the 2023 A
Levels H1 Pure Mathematics section with only a couple of minor workarounds.

## The way forward

The two main steps forward I forsee:

- To hook back all the tests for this rewrite (I am not looking forward to
  rectifying all the failing tests, especially the obscure edge cases).
- To embark on tackling H2 Mathematics, which was where things started

## The Mathlify universe

Outside of the work on the CAS and JS-to-HTML/LaTeX projects, my opinion on the
direction of the overarching Mathlify project is starting to firm up.

The following are some of the points I want to document for potential reference
in the future:

- Built on free and open source whenever possible
- Most Mathlify custom code will be licensed permissively (eg MIT)
- Most Mathlify content will likely be licensed with a
  [https://creativecommons.org/licenses/by-nc/4.0/](CC BY-NC) licensed. It's not
  as permissive as above, but I think it straddles the fine line between open
  sharing and commercial interests
- Most of the backbone infrastructure will also be FOSS. The main exceptions are
  free (but not open source) products and services like GitHub and Vercel for
  hosting.
- The Mathlify website/app will ideally be local-first
- We will eventually plan to monetize certain features but we should keep an
  unwavering commitment to extensive free resources.
- Our content will be largely organized around "skills": programmatically
  generated questions and past examination solutions can be linked together via
  this underlying structure
