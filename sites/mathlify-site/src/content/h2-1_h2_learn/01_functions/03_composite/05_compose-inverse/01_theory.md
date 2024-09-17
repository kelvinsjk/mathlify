---
title: Composing inverse functions
---

We can also compose a function with its inverse to get composite functions
$`ff^{-1}` and $`f^{-1}f.`

We can try to find the formula for $`f^{-1}(x)` and perform composition, but
turns out we can get the result in a simpler manner by consideration the meaning
of this composition.

$`f^{-1}` is the function that reverses $`f,` so $`f^{-1}f`
will take a number, apply $`f` to it and then try to reverse the process. We
then end up with the original number. A similar argument can be made for
$`ff^{-1},`
leading us to the following results.

## Formulas

- $`ff^{-1}(x) = x`
- $`f^{-1}f(x) = x`

## Differences between the two functions

So is $`ff^{-1}(x)` and $`f^{-1}f(x)` the exact same function? Turns out that is
not true because of domain considerations. Recall that $`{D_{fg} = D_g}` so we
have

- $`D_{f^{-1}f} = D_f`
- $`D_{ff^{-1}} = D_{f^{-1}}`

```=comment
TODO: Add a picture for these graphs
```

## Using the result

<!-- prettier-ignore-start -->

::: example

**Question**:

$$ \begin{align*} &f: x \mapsto 2x-1, \quad && x \in \mathbb{R}, \\ &g:x\mapsto x^2 + 3, \quad && x \in \mathbb{R}.\end{align*} $$

We also know that $`f^{-1}(x) = \frac{x+1}{2}.`
\
Solve

$$ fg(x) = 5. $$

Give a definition, in similar form, for the composite function $`fg.`

---

**Discussion**:

We could tackle the question by finding a formula for the composite function $`fg(x).`

However, if we already have a formula for $`f^{-1}(x),` we can get the answer in a simpler way by applying the result $`f^{-1}f(x) = x.`

In particular, we use the result $`f^{-1}fg(x) = g(x)` in the following solution.

**Solution**:

$$ \begin{gather*} fg(x) = 7 \\ \text{Applying } f^{-1} \text{ on both sides}, \\ f^{-1}fg(x) = f^{-1}(5) \\ \text{Note that } f^{-1}fg(x)=g(x), \\ g(x) = f^{-1}(5) \\ x^2 + 3 = \frac{5+1}{2} \\ x^2 + 3 = 3 \\ x = 0 \; \QED \end{gather*} $$

:::
<!-- prettier-ignore-end -->
