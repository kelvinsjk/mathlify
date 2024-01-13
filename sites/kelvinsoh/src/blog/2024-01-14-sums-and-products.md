---
title: 'Sums and products'
description: 'Considerations when forgoing subtraction and division'
author: Kelvin Soh
tags: Mathlify
---

As mentioned in the previous post, instead of a full binary tree, we will attempt
use a simplified expression tree. One possible design decision is to only include the
`Sum` and `Product` operators and not have a node for subtraction and division.

## Representing subtraction

To represent subtraction, we will have to determine if a term within a sum is negative.
We implement this by having all products have a numerical coefficient, apply subtraction when
this coefficient is negative.

## Representing division

We will use our `Exponent` operator to represent division by the presence of a negative power (either
in numeric form or a product with a negative coefficient).

## Drawbacks of this approach

Consider the following:

- $4+(-3x)$ vs $4-3x$
- $\frac{1}{3} xy$ vs $\frac{xy}{3}$
- $\frac{1}{3} xy^{-2}$ vs $\frac{x}{3y^2}$

Each set contain two different expressions one might want to work with representing
the same mathematic content. Our current approach as it stands will be unable to represent both.

For the case of $4+(-3x)$, Mathlify current does not support it without workarounds as we believe
the latter $4-3x$ is what most will considered as more "simplified".

For the next two cases, we supply a `fraction_mode` flag on each product, and typeset the left sided
expression when this flag is `false` and the right sided expression when set to `true`.

This has worked so far in our investigations, but may warrant changes in the future. At the moment
our code has a workaround for the edge case of expressions like $x^{-1}$. Ordinarily, Mathlify
automatically simplifies the internal tree structure by removing singleton sums and products. For example,
the sum containing the $x$ term should be just a `Variable` node, while the product containing just a factor
of $x^2$ is better represented by just a `Exponent` node.

However, our `fraction_mode` flag only lives in a `Product` node at the moment, so converting the singleton
product $x^{-1}$ into an `Exponent` node removes the flag. Thus, at the moment, our workaround is to only do
the `Product` simplification of singletons if the `fraction_mode` is set to `false`. In the future (especially
when we move back to JavaScript from the current Rust based experiments), we may want to have the `fraction_mode`
flag at the root of our expression.
