---
title: 'The dynamic import rabbit hole'
description: 'My year long grapple with dynamic imports'
author: Kelvin Soh
tags: Mathlified,Vite,Node
---

## Building Mathlified

Around two years ago, my newest project idea was to build a mathematical content
authoring framework where the framework takes a single code base and produces a
web page and a pdf (via LaTeX). I decided to build it as a Vite plugin: it
injects Svelte code to create the web page, and on the pdf side calls pdflatex
to generate the pdf after transforming the source code into a tex file.

As my first foray into this space I was definitely fumbling around in the dark
quite a bit, but in the end I managed to tape together something that worked for
my use cases and `vite-plugin-sveltekit-tex` has been powering
[one of my websites](https://mathsss.vercel.dev), and the main tool I use to
author worksheets for my students since the start of 2023. It has its own quirks
and warts but it sure beats authoring LaTeX directly. And I get the material
available in two formats too!

While developing the project the main pain point has been "dynamic imports". On
the authoring side I will be creating TypeScript files, and the plugin will need
to import from these files to get the information to generate the LaTeX code and
pdf. A bit of googling brought up vite's dynamic import and glob import
features, along with other articles about dynamic imports in node itself.

I went down a deep rabbit hole on these ideas, but unfortunately old me just
couldn't get it to work. Looking back I am surprised how I even got a
functioning project up with the extremely hacky workaround solution I came up
with.

This involved taking the source code of the module (in typescript), and writing
it to a file. With a dependency that `tsx` is installed globally, we use a child
process spawn to run another js/ts file whose job is to import the newly written
file and produce the pdf.

## A second stab

With fresher ideas about mathematics content on the web, I set out to write a
similar plugin. It's quite a rewarding feeling thinking about the growth of my
knowledge in this space as I now have a much better mental model of what I am
trying to do (and the server vs client divide). This time, I could use both the
vite glob import and the node dynamic import working. There is still a bit of
hacky workaround, but things worked.

But then I set off down another rabbit hole when trying to bug fix why things
aren't updating. Turns out these dynamic import are cached and a common
workaround is to add a query string at the end to avoid the cached version.

## A sudden discovery

And while playing around with vite's capabilities, I suddenly stumbled about
vite's ssrLoadModule feature, which avoided all the workarounds over dynamic
import I had. And it works perfectly for my dev-time use case.

It really made me marvel at how good of a tool Vite is, with so many its
features perfect for helping me achieve my desired goals. I look forward to
explore more about it as I continue building Mathlified.
