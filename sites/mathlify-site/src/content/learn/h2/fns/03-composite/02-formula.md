# Formula and domain of composite functions

## Formula

To get the formula of a composite function $`fg,` we take the inner function
$`g`
and substitute into $`f.` For example, if $`{f(x)=2x-1}` and $`{g(x)=x^2},` then
we have

$$`\begin{align*} fg(x) &= f(x^2) \\ &= 2x^2 - 1 \end{align*}`$$

and

$$`\begin{align*} gf(x) &= g(2x+1) \\ &= (2x-1)^2 \end{align*}`$$

## Domain

Since the composite function $`fg` starts by applying $`g,` the domain of $`fg`
will be the domain of $`g.`

<!-- prettier-ignore-start -->
::: formula

- {=$`D_{fg} = D_g`=}
- {=$`D_{gf} = D_f`=}

:::
<!-- prettier-ignore-end -->

## Example

<!-- prettier-ignore-start -->
::: example

**Question**:

$$`\begin{align*} &f: x \mapsto 2x-1, \quad && 0 \leq x < 10 \\ &g:x\mapsto x^2 + 3, \quad && -2 < x < 1.\end{align*}`$$

Give a definition, in similar form, for the composite function $`fg.`

---

**Solution**:

$$`\begin{align*} fg(x) &= f(x^2+3) \\ &= 2(x^2+3) - 1 \\&= 2x^2 + 5 \end{align*}`$$

We note that $`{D_{fg} = D_g = (-2, 1),}` so

$$`fg:x \mapsto 2x^2 + 5, \quad -2 < x < 1. \; \QED`$$

:::
<!-- prettier-ignore-end -->
