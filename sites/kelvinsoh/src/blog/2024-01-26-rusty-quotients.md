---
title: 'Rusty quotients'
description: 'Adding quotients and the current rust implementation'
author: Kelvin Soh
tags: Mathlify
---

## Implementing quotients

In the previous post, we mentioned how we plan to use
the `Product` operator and handle division via negative exponents.

On further consideration, manipulation of algebraic fractions is a
non-insignificant part of learning algebra so we have decided to implement
the `Quotient` operator in our expression tree.

## Rust implementation update

We have been implementing a preliminary version of the Mathlify library
rewrite in rust, and it has been a really enjoyable journey.

I love how
most of my coding errors are caught during compilation with mostly helpful
hints on how to fix them.

I still struggle every now and then about borrowing
and ownership and probably use `clone` too much (though I think that is
eminently necessary as I want to avoid mutations when creating new objects
from old).

However, the compiler and built-in testing solution makes me very
confident when writing and refactoring code.

### GitHub Copilot

GitHub Copilot has also been really useful in making the process more effective.
In particular, the suggestions for the $\LaTeX$ display test output has been
mostly high quality, though it often fluffed on the numbers when performing
manipulations, producing a suggestion that matches the shape of the final
expression but with wrong values.

### Current features

As of today, I have implemented most of the common expression manipulation techniques:

- substituting variables for numbers or other expressions
- expansion and factorization (of common factors)
- algebraic fractions: simplification via cancellation of terms and combining fractions under addition/subtraction
- combining like terms in products and sums
- common heuristics for "simplification" of expressions

## JavaScript time

With the good progress, I am considering to start transferring the ideas into a JavaScript implementation before
starting work on arithmetic methods, polynomials and handling equations.
