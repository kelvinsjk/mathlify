---
title: 'State of Mathlify Expression class'
description: 'Collection of thoughts while finalizing Mathlify Expression class'
author: Kelvin Soh
tags: Mathlify,Mathlify Specs
---

## Project status

The Expression class in Mathlify is now capable of handling most algebraic
manipulations seen at the lower secondary level so I thought it will be a good
time to try to clean up the code base and API and jot down some thoughts I have
about it.

## The base ExpressionTypes

We have the current `ExpressionTypes` implemented

- `Product`
- `Sum`
- `Quotient`
- `Exponent`
- `Fn`
  - `Bracket`
- `Numeral`
  - `Fraction`
- `Variable`

In the future, I foresee extending the `Fn` and `Numeral` types to include
functions like square roots and logarithms for the former, and floats for the
latter.

An `Expression` is a wrapper around these base `ExpressionTypes`, with methods
on it to manipulate it. We build up a tree from there: the `Numeral` and
`Variable` types are the leaf nodes, and all other types contain sub-expressions
as children.

- The `Product` node is made up of a `coeff` (of the `Numeral` type) and
  `factors` (an array of `Expression`)
- The `Sum` node is made up of `terms` (an array of `Expression`)
- The `Quotient` node is made up of a `num` and `den` (both an `Expression`)
- The `Exponent` node is made up of a `base` and `power` (both an `Expression`)
- The `Fn` node contains a `Bracket` node with contains a single `Expression`
  node

## Naming convention

### Mutation

`Expression` and `ExpressionType` are equipped with a `simplify` method that
will **mutate** the current instance.

All other public methods should not mutate the instance but instead return new
instances if necessary.

Internal or experimental methods that mutate the instance will have a trailing
underscore.

### Internal vs external vs experimental

Methods and properties that are considered "public" will be camelCased. We
aspire to maintain semantic versioning on these when we hit 1.0.

Methods and properties that are considered as only for internal use have a
leading underscore and will be snake_cased. These methods should be used with
care as they may be subject to change any time. Methods that mutate the current
instance will end with an underscore as well.

"Experimental" methods and properties subject to redesign in the future will
have a leading underscore and be camelCased.

## Common methods

### Constructors

Constructors will accept only numbers, strings or `Expression`. Type coercions
will be pushed to the `macros` module. In fact, we probably should only ship
these `macros` and only ship types for the `Expression` and `ExpressionType`
classes.

### toString

All classes have a `toString` method that return $\LaTeX$ markup strings.

### valueOf

The `Numeral` and `Fraction` class also has the `valueOf` method that return the
JavaScript number type.

### simplify

All `Expression` and `ExpressionType` classes implement the `simplify` method
that mutates the current instance.

### clone

All classes also implement the `clone` method.

## Finalized Expression class APIs

### Properties

- `node`: `ExpressionType`

### Methods

- `expand()`
- `combineFraction()` works on `Expression` with a `Sum` node
- `factorize.commonFactor()` works on `Expression` with a `Sum` node
- `negative()`
- `subIn(scope)`

### Static methods to ponder over

We currently have static methods `gcd()` and `lcm()` on the `Expression` class.
However, if we no longer ship the class, we should ship these functions
separately under a different namespace.
