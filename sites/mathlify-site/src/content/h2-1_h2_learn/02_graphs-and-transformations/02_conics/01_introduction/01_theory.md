---
title: Conic sections
copyright: College Algebra 2e
---

<!-- prettier-ignore-start -->
::: citation
Adapted from OpenStax College Algebra 2e[^cite]
:::
<!-- prettier-ignore-end -->

## Brief historical overview

Around 300 BCE, the Greek mathematician Menaechmus discovered shapes by intersecting a plane
with right circular cones. He was able to obtain **ellipses**,
**hyperbolas** and **parabolas** depending on how he tilted the plane.

![conic sections](/images/h2/graphs/openStax_graphs_conics.jpeg)

Around 2000 years later, we see these shapes in real life applications. The ellipse describes
how planets orbit around the sun, while the hyperbola describes magnetic repulsion.

## Standard forms

We describe these shapes algebraically by the following equations:

$$
\begin{align*}
& \text{Ellipse:} \quad   && \frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \\
& \text{Hyperbola:} \quad && \frac{x^2}{a^2} - \frac{y^2}{b^2} = 1 \\
& \text{Hyperbola:} \quad && \frac{y^2}{a^2} - \frac{x^2}{b^2} = 1 \\
& \text{Parabola:} \quad  && y = ax^2 \\
& \text{Parabola:} \quad  && x = ay^2 \\
\end{align*}
$$

The ellipses and hyperbolas have _center_ at the origin $(0, 0)$
while the parabolas have _vertex_ at the origin. We will explore more about
these features in the subsequent sections.

When the center or vertex is not at the origin, the curves have equations:

$$
\begin{align*}
& \text{Ellipse:} \quad   && \frac{(x-h)^2}{a^2} + \frac{(y-k)^2}{b^2} = 1 \\
& \text{Hyperbola:} \quad && \frac{(x-h)^2}{a^2} - \frac{(y-k)^2}{b^2} = 1 \\
& \text{Hyperbola:} \quad && \frac{(y-k)^2}{a^2} - \frac{(x-h)^2}{b^2} = 1 \\
& \text{Parabola:} \quad  && y = a(x-h)^2 + k \\
& \text{Parabola:} \quad  && x = a(y-k)^2 + h \\
\end{align*}
$$

We call these equations the **standard form** of each shape.

## Completing the square

If a conics equation is not of standard form, we can convert to standard form by _completing the square_.

The following is an example where we convert the equation

$$ x^2 + 6x + 4y^2 + 5 = 0 $$

into the standard form of an ellipse:

$$
\begin{gather*}
    x^2 + 6x + 4y^2 + 5 = 0 \\
    (x+3)^2 - 9 + 4y^2 + 5 = 0 \\
    (x+3)^2 + 4y^2 = 4 \\
    \frac{(x+3)^2}{2^2} + \frac{y^2}{1^2} = 1
\end{gather*}
$$

[^cite]:
    Content in this page is adapted from OpenStax College Algebra 2e by Jay
    Abramson under the
    [Creative Commons Attribution License](https://creativecommons.org/licenses/by/4.0/).\
    Access
    for free at
    <https://openstax.org/books/college-algebra-2e/pages/5-6-rational-functions>
