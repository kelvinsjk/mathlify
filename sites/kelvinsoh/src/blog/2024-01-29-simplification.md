---
title: 'All about simplification'
description: 'Rules to simplify expressions'
author: Kelvin Soh
tags: Mathlify,Mathlify Specs
---

In this post, we list out all the steps the Mathlify library does to "simplify"
expressions.

## Fraction

- "Hoist" negative denominators to the numerator if necessary so that
  denominators are always positive. For example, $\frac{5}{-2}$ will be
  simplified to $\frac{-5}{2}$.
- Extract gcd such that the numerator and denominator are coprime. For example
  $\frac{15}{6}$ becomes $\frac{5}{2}$ and $\frac{0}{6}$ becomes $\frac{0}{1}$.

## Sum

- Combines like terms into a `Product` of a numerical coefficient and the term
- `_combine_like_terms()` also combines `Numeral`s such that there are at most
  one `Numeral` in a `Sum`.
- Nested sums are flattened.
- Numerals of 0s are removed.

## Product

- Combines `Numeral`s to become a `coeff` at the start of the product
- Nested products are flattened

## Expression

The `Expression` class allow us to modify the underlying type

- Any `Bracket` class are changed to the underlying type.
- An empty `Sum` will be changed to a `Numeral` of 0.
- A singleton `Sum` will be changed to the underlying type.
- An empty `Product` will be changed to a `Numeral` of its `coeff`
- A product with a single factor and `coeff` of 1 will be changed to the
  underlying type
- A product with a `coeff` of 0 will be changed to a `Numeral` 0.
- A `Quotient` with a numerator of `Numeral` 0 will be changed 0
- A `Quotient` with a denominator of `Numeral` 1 will be changed to the
  underlying numerator type
- A `Quotient` with `Numerals` on both numerator and denominator will be changed
  to a `Numeral` class
- An `Exponent` with positive integral `Numeral` power and a `Product` base will
  be cased of a `Product` of `Exponents`
