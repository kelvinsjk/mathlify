---
title: 'Decisions about trees'
description: 'Laying the foundations of the Mathlify computer algebra system'
author: Kelvin Soh
tags: Mathlify
---

## Representing mathematical expressions

How do we represent mathematical expressions such as
$\frac{-5+z}{8} - x^2$ in a computer algebra system?

Trees such as the [Binary expression tree](https://en.wikipedia.org/wiki/Binary_expression_tree)
is a robust way. Our nodes will consist of numbers and symbols (the leaves) and
unary and binary functions (representing operations like $\sin$ and $+$).

Conversion from the tree to the displayed expression will then be a relatively straightforward
depth-first parsing of the tree.

However, working on that expression in the tree-form will be complicated.
Even something seemingly straightforward as looking for like terms in an expression will be
non-trivial.

## Avoiding trees fully

In my first go at developing Mathlify I tried to avoid using trees entirely. We forgo general
expressiveness for the ease of working with our expressions.

As I was learning about class-based object-oriented programming, I set up Mathlify to consist of
classes such as `Fraction`, `Term`, `Expression`, `Polynomial` and `Vector` and build our content
from these constructs.

They work reasonably well, especially for cases with at most one unknown over the rationals
(eg the library handled questions involving polynomials and vectors over $\mathbb{Q}$ really well).

It started getting a bit unwieldy with a lot of edge cases to account for when I tried to move into
calculus (the chain/product/quotient differentiation rules as well as adding trigonometric and exponential/logarithmic functions into the mix
caused many edge cases).

Working with more than one unknown and when to handle automatic simplification was also challenging in this
framework.

Thus I am now exploring using trees as the underlying data structure in the next iteration of Mathlify.

## Full vs condensed trees

To find a balance between the two competing aims (ability to express general mathematical expressions and ease of writing code to work on
such expressions), I will be exploring working with a simplified tree structure.

Instead of a full tree of unary and binary operations, I will try to use the following

- $n$-ary `Sum` operator
- $n$-ary `Product` operator
- Binary `Exponent` operator
- Unary `Function` operator
- `Number` and `Symbol` leaf nodes

The hope is this will provide a happy medium and I look forward to sharing my work in this blog in this aspect.
I am also taking this opportunity to learn and experiment in Rust before porting any final results to JavaScript.
