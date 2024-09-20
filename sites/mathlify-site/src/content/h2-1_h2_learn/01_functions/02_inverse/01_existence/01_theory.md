---
title: Existence of inverse functions
copyright: OpenStax Calculus Volume 1
---

<!-- prettier-ignore-start -->
::: citation
Adapted from OpenStax Calculus Volume 1[^cite]
:::
<!-- prettier-ignore-end -->

## Introduction to inverse functions

An **inverse** function reverses the operation done by a particular function. In
other words, whatever a function does, the inverse function undoes it.

We denote the inverse of $`f` by $`f^{-1}.`

For example, if
$`f(x)=2x+1,` and $`x=1` we can make use of the function
to find $`y=f(1)=3.` The inverse function aims to take the value
$`y=3,`
and get back the original value of
$`x=1.` We can check that the function
$`f^{-1}(x) = \frac{x-1}{2}` achieves this
aim (we will learn how to find this in a later section).

## Inverse functions may not exist

Consider the function $`g(x)=x^2.` It is a function: every input $x$ leads to exactly
one output $g(x)$. However, the reverse is not true: an output of $`y=4` could have
come from either $`x=-2` or $`x=2.` In such a case we say that the _inverse
function does not exist_.

## One-to-one functions

The earlier function $`f` sends each input to a _different_ output while $`g`
will sometimes sends different inputs to the same output. This is what allows $`f`
to have an inverse while $`g` does not.

We call this behavior of sending each input to a different output a **one-to-one
function**.

We can check if a function is one-to-one (and thus its inverse exist) by
employing the **horizontal line test**.

<!-- prettier-ignore-start -->
::: technique

## Horizontal line test

A function $`f` is one-to-one and has an inverse if and only if every **horizontal** line intersects the graph of $`f` **no more than once**.
:::
<!-- prettier-ignore-end -->

The following two examples illustrate how to phrase the horizontal line test for
the cases where $`f` is one-to-one and has an inverse, and where $`f` is not
one-to-one and does not have an inverse.

![horizontal line test](/images/h2/fns/openStax_functions_horizontal.jpeg)

<!-- prettier-ignore-start -->
::: example

### Inverse does not exist

The horizontal line $`y=2` intersects the graph of $`y=f(x)=x^2` more than once. Thus, $`f` is not one-to-one and does not have an inverse.

### Inverse exist

All horizontal lines $`y=k, k\in\mathbb{R}` intersects the graph of $`y=f(x)=x^3` at most once. Thus, $`f` is one-to-one and has an inverse.
:::
<!-- prettier-ignore-end -->

[^cite]:
    Content in this page is adapted from OpenStax Calculus Volume 1 by Gilbert
    Strang and Edwin "Jed" Herman under the
    [Creative Commons Attribution Noncommercial Sharealike 4.0 License](https://creativecommons.org/licenses/by-nc-sa/4.0).\
    Access
    for free at
    <https://openstax.org/books/calculus-volume-1/pages/1-4-inverse-functions>
