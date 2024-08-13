# Piecewise functions

<!-- prettier-ignore-start -->
::: citation
Adapted from OpenStax Calculus Volume 1[^cite]
:::
<!-- prettier-ignore-end -->

## Introduction

Sometimes a function is defined by different formulas on different parts of its
domain. A function with this property is known as a **piecewise** function.

We will use the following example to better understand how to work with
piecewise functions.

$$`f(x) = \begin{cases} x + 3, & x < 1 \\ (x-2)^2, & x \geq 1 \end{cases}`$$

## Evaluating piecewise functions

To evaluate a piecewise function (e.g. find the value of
$`f(2)`), we use the
appropriate formula (the "piece") based on the part of the domain the value of
$`x`
is in.

For example, $`f(0)=0+3=3,` $`f(1)=(1-2)^2=1` and $`f(2)=(2-2)^2=0.`

## Graphing piecewise functions

To sketch a graph of our example $`f(x),` we graph the linear function
$`{y=x+3}`
on the interval $`(-\infty, 1)` and graph the quadratic function
$`{y=(x-2)^2}`
on the interval $`[1, \infty)`.

Since the formula for a function is different for $`{x<1}` and $`{x>1,}` we need
to pay special attention to what happens at $`{x=1}` when we graph the function.

$`f(1)=(1-2)^2=1` and this is different from the value we get when substituting
$`{x=1}`
into
$`{x+3.}` We thus draw an open circle at $`{(1,4)}` and a closed circle at
$`{(1,1)}`
to indicate the behavior of $`f` at $`{x=1}` on our graph.

![graphing a piecewise function](/images/h2/fns/openStax_functions_piecewise.jpeg)

[^cite]:
    Content in this page is adapted from OpenStax Calculus Volume 1 by Gilbert
    Strang and Edwin "Jed" Herman under the
    [Creative Commons Attribution Noncommercial Sharealike 4.0 License](https://creativecommons.org/licenses/by-nc-sa/4.0).\
    Access
    for free at
    <https://openstax.org/books/calculus-volume-1/pages/1-2-basic-classes-of-functions>
