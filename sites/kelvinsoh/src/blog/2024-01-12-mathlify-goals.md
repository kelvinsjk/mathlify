---
title: 'Goals of Mathlify'
description: 'Building my own computer algebra system'
author: Kelvin Soh
tags: Mathlify
---

I started a hobby project during the covid lockdowns to
generate mathematical problems.

And before I knew it, what
started as a series of helper functions morphed into something
resembling a computer algebra system (CAS).

"_If it looks like a duck, ..._". Thus the Mathlify library/CAS is born.

## Why not use a preexisting CAS?

[![XKCD comic: standards](https://imgs.xkcd.com/comics/standards.png)](https://xkcd.com/927/)

I do not need a powerful and general system: just enough to handle
material common at the high school and beginning college level will suffice.

Working on the web platform I also wish to stay within the JavaScript language to
facilitate interactive apps.

Currently my main goals for the project are
starting to crystalize around the following two ideas.

## Main priorities in developing Mathlify

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
