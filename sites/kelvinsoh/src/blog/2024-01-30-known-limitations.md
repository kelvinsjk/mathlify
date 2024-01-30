---
title: 'Known limitations'
description: 'The limitations of Mathlify and what we plan to implement'
author: Kelvin Soh
tags: Mathlify,Mathlify Specs
---

In this post, we list out mathematical expressions that we have
encountered that Mathlify cannot handle. Of those, some will be planned
features to come in a future update, while others are not on the current
road map

## Planned features

- The `Sqrt` class as a `Fn`
- The `Exponent` class
- $\frac{-2}{3}$ is currently typeset as $- \frac{2}{3}$. We will use the `Quotient` class to typeset the former.

## Not on roadmap

- Division signs (we plan to only handle fractions and quotients)
- General radicals (we plan to only implement `Sqrt`s)
- Mixed product signs. We currently default to typesetting products
  as `ab`, but this can be modified to `a ${sign} b` where `sign` can be customized (we forsee $\cdot$ and $\times$ as the common use-cases).
  Mixing two or more signs are not planned.

## Undecided

- Prime factorization
