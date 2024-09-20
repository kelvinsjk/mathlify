---
title: Functions, domain and range
copyright: College Algebra 2e
---

<!-- prettier-ignore-start -->
::: citation
Adapted from OpenStax College Algebra 2e[^cite]
:::

::: definition
A **_function_** is a relation in which each possible input value
leads to exactly one output value.

The input values make up the **_domain_**, and the output values make up the
**_range_**.

We denote the domain and range of a function $`f` by $`D_f` and $`R_f` respectively.
:::
<!-- prettier-ignore-end -->

## Defining functions

We can **_define_** a function by giving its rule and describing its domain
using the following notation:

$$ f:x \mapsto x^2 + 1, \quad \text{for } x \in \mathbb{R}, -1 < x < 3. $$

The _rule_, or formula for the function $f$ is given by
$f(x)=x^2+1$, allowing
us to do computations such as $f(3)=3^2+1=10$.

The _domain_ of $f$ is given by $-1 < x < 3.$ Written in set notation, we
have ${D_f = (1,3).}$

## Domain of a function

We should specify the domain when defining a function, as seen in the above
example. The reason for this could be due to context. For example, if $`x`
represents the number of hours in a day we study, then an appropriate domain
would be $`[0, 24].`

### Largest possible domains

The domain could also be due to considerations of what is mathematically
permitted. For example, we **cannot**

- divide by zero,
- take square roots of negative numbers, or,
- take the logarithm of zero or a negative number.

For example, the function

$$ f: x \mapsto \frac{1}{x-2}, \quad \text{for } x \in \mathbb{R}, x \neq 2 $$

has
$`x = 2` omitted from its domain to avoid division by zero. Meanwhile, the largest possible domains for $`{g(x)=\sqrt{x+3}}` is $`{D_g = [-3, \infty)}` while that of
$`{h(x) = \ln (x+3)}`
is $`{D_h = (-3, \infty).}`

## Range of a function

### Using graphs to find the range

We recall that the range of a function refers to the set of all possible output
values. A graph helps us find the range as we can visualize all the
possible values of $`y.`

As the following examples will illustrate, the important features of graphs that
often affect the range of functions are:

- end-points (be careful of inclusive vs exclusive cases!),
- turning points,
- asymptotes.

### Examples

![range of a function using end point](/images/h2/fns/openStax_functions_range.jpeg)

The above function has a left end point with coordinate
$`{(-5,5).}` By
considering all possible $`y\text{-values},` we get the range
$`{R_f = (-\infty, 5]}.`

![range of a function using turning point](/images/h2/fns/openStax_functions_range3.jpeg)

The above function has both end points tending towards infinity. However, there
is a minimum point on our graph at the origin, which appears in the computed
range of $`[0,\infty).`

![range of a function using asymptote](/images/h2/fns/openStax_functions_range2.jpeg)

For this last example above, the range consists of all values **except** $`0`
which is a result of the horizontal asymptote $`y=0.` Hence we can write the range
as a union of two exclusive intervals.

[^cite]:
    Content in this page is adapted from OpenStax College Algebra 2e by Jay
    Abramson under the
    [Creative Commons Attribution License](https://creativecommons.org/licenses/by/4.0/).\
    Access
    for free at
    <https://openstax.org/books/college-algebra-2e/pages/3-1-functions-and-function-notation>
