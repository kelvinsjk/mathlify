---
title: "Math on the web: the good parts"
date: 2023-09-23
tags:
  - Typesetting
authors: 
	- kelvinsoh
slug: blog/math-in-js
---

I still remember being introduced to [MathJax](https://www.mathjax.org/) around
a decade ago. It felt like
a game changer! I installed a [wordpress plugin](https://wordpress.org/plugins/mathjax-latex/)
on my blog/website, and it worked like a charm. Beautiful math on the web has finally arrived!

## MathJax and KaTeX

[KaTeX](https://katex.org/) introduced a faster experience (with its different implementation approach),
and by adding a couple of lines of HTML (using the CDN version with the auto-render extension), we
can get math rendering on any static site.

With version 3 MathJax has seen significant speed improvements so I can see a case for either. KaTeX still
seems faster, while MathJax trades off some speed for slightly more features. As far as I know these two are
still the de facto libraries of choice for anyone interested in this area.

## Some good implementations

This post is dedicated to some of my favorite websites and web apps over the years that have done
it right, before I go on my rants on things that are still not ideal and pontificate on the different approaches
that I have explored in digitalizing math content.

It goes without saying that this is a non-exhaustive list, and I will love to hear
about your favorites that I have missed out on.

### Mathematics Stack Exchange and MathOverflow

The seamless integration of MathJax to render mathematics in the question and answer
format is one of my favorite things about [Mathematics Stack Exchange](https://math.stackexchange.com/)
and [Math Overflow](https://mathoverflow.net/). You cannot beat these sites
if you want a high quality answer to your math question, with zero compromises in terms of
the rendering of the math content.

I really find it a pity their underlying business model seem to be targeting only large enterprises.
I feel the technology could be a good fit in a lot of educational settings like
in schools and smaller independently run communities with their individual philosophies, like the communities
on Reddit.

### StackEdit

As I started to explore creating more web content outside the confines of Wordpress,
Markdown became a natural tool. [StackEdit](https://stackedit.io/) is one of my favorite tools for Markdown. I very
much prefer the side-by-side writing and previewing experience (holdover from working with $\LaTeX$?)
over the WYSIWYG approach of other editors.

I've even sponsored them a couple of times to unlock the extra exporting features.
Unfortunately, I have been unable to find a good workflow in terms of sharing the content with others, and as
such do not use it as often nowadays. It's still a great tool if I want to jot down a quick note.

### Desmos and MathQuill

I was really impressed when I first discovered [Desmos](https://www.desmos.com/calculator). With its
ease of use, powerful features and being free to use, there should be no reason graphing calculators should
still be a thing, let alone cost as much as they still do.

Part of the reason why Desmos is so easy to use is because of the excellent (and open source) [MathQuill](http://mathquill.com/)
input (alongside Desmos's own virtual keyboard
that will be really important for mobile devices). $\LaTeX$ knowledge is no longer necessary to create beautiful math expressions.

### Math Live

When I started creating my own web applications, I wanted something like the input on Desmos, ideally open source.
[Math Live](https://cortexjs.io/mathlive/) is now my go-to library for math input, featuring an excellent virtual keyboard
packaged in a web component. I have used it in my Math Pro project ([example here](https://math-pro.vercel.app/questions/01/0101a))
and plan to customize it further to support future projects.
