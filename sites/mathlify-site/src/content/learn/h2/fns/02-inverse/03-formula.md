# Formula of inverse functions

<!-- prettier-ignore-start -->
::: citation
Adapted from OpenStax Calculus Volume 1[^cite]
:::
<!-- prettier-ignore-end -->

After confirming that an inverse function exists, we now attempt to find the
formula that defines the inverse function.

<!-- prettier-ignore-start -->
::: technique

## Finding a function's inverse

1. Let $`y=f(x)`.
2. Make $`x` the subject of the equation in terms of $`y`.
3. Interchange the variables $`x` and $`y` and write $`y=f^{-1}(x)`.

:::
<!-- prettier-ignore-end -->

## Example

### Simpler examples

Use the technique above to find the formula for the inverses of
$`{f(x)=3x-4}` and
$`{g(x)=2\mathrm{e}^{x+1}-5.}`

You should get
$`{f^{-1}(x) = \frac{x+4}{3}}` and
$`{g^{-1}(x) = \ln \left( \frac{x+5}{2} \right) - 1.}`

### Inverse of a quadratic function

There are a couple of tricks to find the inverse of a quadratic function. First,
**completing the square** may be useful to help us make $`x` the subject.

We will then have a $`\pm` when taking square roots, and will need to **use the
domain** to determine if we should take the positive or negative version of our
expression.

The following example illustrates both of these concepts:

<!-- prettier-ignore-start -->
::: example

**Question**:\
The function $`f` is given by

$$`f: x \mapsto x^2+4x, \quad x \in \mathbb{R}, x \leq -2,`$$

Define $`f^{-1}` in similar form.

---

**Solution**:

$$`\begin{align*} & y=x^2 + 4x \\ &y=(x+2)^2 - 4 \\ &(x+2)^2 = y+4 \\ &x+2 = \pm \sqrt{y+4} \end{align*}`$$

Since $`x \leq -2` (the domain of $`f`),

$$`\begin{align*} x+2 &= - \sqrt{y+4} \\ x &= -2 - \sqrt{y+4} \\ f^{-1}(x) &= -2 - \sqrt{x+4} \end{align*}`$$

Note that $`D_{f^{-1}} = R_f = [-4, \infty).`\
Hence the definition of $`f^{-1}` is

$$`f^{-1}: x \mapsto -2 - \sqrt{x+4}, \quad x \in \mathbb{R}, x \geq -4. \; \QED`$$

:::
<!-- prettier-ignore-end -->

[^cite]:
    Content in this page is adapted from OpenStax Calculus Volume 1 by Gilbert
    Strang and Edwin "Jed" Herman under the
    [Creative Commons Attribution License](https://creativecommons.org/licenses/by/4.0/).\
    Access
    for free at
    <https://openstax.org/books/calculus-volume-1/pages/1-4-inverse-functions>
