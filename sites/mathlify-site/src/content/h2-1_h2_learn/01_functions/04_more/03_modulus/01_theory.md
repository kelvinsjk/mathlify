---
title: Modulus functions
---

## Understanding the modulus function

Numbers can be positive or negative (or zero). We sometimes will
like to convert our numbers into positive numbers (non-negative to be exact). The modulus
function, denoted by $\lvert \cdot \rvert$, does that.

For example $|3|=3$, $|0|=0$ and $|-5|=5$.

This is sometimes also called the absolute value function.

## Modulus as a piecewise function

The modulus function can be defined as a piecewise function:

$$ |f(x)| = \begin{cases} f(x) & \text{if } f(x) \geq 0 \\ -f(x) & \text{if } f(x) < 0 \end{cases} $$

### Example

For example, consider the function $f(x) = |x-2|$.

If $x < 2$, then $x-2$ is negative so
the function can be rewritten as $f(x) = -(x-2) = 2-x$.

On the other hand, if $x \geq 2$, then $x-2$ is non-negative so
the function can be rewritten as $f(x) = x-2$.

## Finding inverses of modulus functions

<!-- prettier-ignore-start -->

::: example

**Question**:

$$ \begin{align*} &f: x \mapsto |x-2|, \quad && x < 1, \\ &g:x\mapsto |x -2|, \quad && x \geq 2.\end{align*} $$

Find $f^{-1}(x)$ and $g^{-1}(x)$.

---

**Solution**:

When $x<1$, then $x-2$ is negative so $f(x)=-(x-2)$

$$
\begin{align*}
\text{Let } y &= -(x-2)
\\ y &= -x + 2
\\ x &= 2 - y
\end{align*}
$$

$$ f^{-1}(x) = 2-x \; \QED $$

When $x \geq 2$, then $x-2$ is non-negative so $g(x)=x-2$

$$
\begin{align*}
\text{Let } y &= x-2
\\ x &= y + 2
\end{align*}
$$

$$ g^{-1}(x) = x+2 \; \QED $$

:::
<!-- prettier-ignore-end -->
