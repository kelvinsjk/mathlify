---
title: 'All about simplification'
description: 'Rules to simplify expressions'
author: Kelvin Soh
tags: Mathlify,Mathlify Specs
---

In this post, we list out all the steps the Mathlify library does to "simplify" expressions.

## Fraction

- "Hoist" negative denominators to the numerator if necessary so that denominators are always positive. For example, $\frac{5}{-2}$ will be simplified to $\frac{-5}{2}$.
- Extract gcd such that the numerator and denominator are coprime. For example $\frac{15}{6}$ becomes $\frac{5}{2}$ and $\frac{0}{6}$ becomes $\frac{0}{1}$.

## Sum

- Combines `Numeral`s such that there are at most one `Numeral` in a `Sum`.
- Nested sums are flattened.

## Expression

The `Expression` class allow us to modify the underlying type

- An empty `Sum` will be changed to a `Numeral` of 0.
- A singleton `Sum` will be changed to the underlying type.
- Any `Bracket` class are changed to the underlying type.
