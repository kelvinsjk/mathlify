---
title: 'Decisions about trees'
description: 'Laying the foundations of the Mathlify computer algebra system'
author: Kelvin Soh
tags: Mathlify
draft: true
---

I started a hobby project during the covid lockdowns to
generate mathematical problems.

And before I knew it what
started as a series of helper functions morphed into something
resembling a computer algebra system (CAS), which I shall refer to as
Mathlify.

## Goals of Mathlify

I have slight different goals than most other CASes out there.
I do not need a powerful and general system: just enough to handle
material common at the high school and beginning college level will suffice.

I have two main priorities when developing Mathlify:

### Idiomatic code

The program should operate at an abstraction
level similar to our target audience.
The code written by an end-user should
resemble the steps a teacher will lay out to his/her students.

### Mathematical display

Mathematical display should be a first-class citizen. We mathematics folks love
our white/blackboards because the display output is produced simultaneously alongside
problem solving and computational thinking.

Most of today's digital mathematical content are generated in two steps: we perform the necessary
analysis and computation (using pen and paper, calculators and/or a CAS of choice) and then
digitize our findings (on your word processor or typesetting language).

I hope that Mathlify can help us accomplish both steps simultaneously.

## Representing mathematical expressions

How do we represent mathematical expressions such as
$\frac{-5+z}{8} - x^2$ in a computer algebra system?

Trees such as the [Binary expression tree](https://en.wikipedia.org/wiki/Binary_expression_tree)
can f

## Structuring the Mathlify computer algebra system
