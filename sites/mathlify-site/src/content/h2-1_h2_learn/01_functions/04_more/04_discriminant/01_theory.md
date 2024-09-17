---
title: Using the quadratic discriminant
---

So far we have mostly found the range of functions by graphical methods. For example, the following is a sketch of the
graph of $y=f(x)=\frac{2x}{x^2+1}$.

The curve has a minimum point at $(-1,-1)$ and a maximum point $(1, 1)$. Hence the range of the function is
$`[-1, 1]`.

## An algebraic method to find the range

Instead of the graphical method above, the range of some functions can be found using the quadratic discriminant.

The idea behind this method is that the range of a function is the set of values of $y$ for which the equation
$y=f(x)$ has real roots in $x$. If $y=f(x)$ can be manipulated into a quadratic equation in $x$, then we will
be able to use the quadratic discriminant to find the range of the function.

For our earlier example, the range of the function corresponds to the horizontal lines
that cut the curve $y=f(x)$ at one or two points. This corresponds to the case that our quadratic discriminant ${b^2-4ac} \geq 0$.

## Example

$$
\begin{gather*}
  y = \frac{2x}{x^2+1} \\
  yx^2 + y = 2x \\
  yx^2 - 2x + y = 0
\end{gather*}
$$

For the range of $f$,

$$
\begin{gather*}
  b^2 - 4ac \geq 0 \\
  (-2)^2 - 4(y)(y) \geq 0 \\
  4 - 4y^2 \geq 0 \\
  y^2 - 1 \leq 0 \\
  (y+1)(y-1) \leq 0 \\
  -1 \leq y \leq 1
\end{gather*}
$$

Hence the range of $f$ is
$`[-1, 1]`.
