---
title: Range of composite functions
---

One method to find the range of composite functions is to first
[find its definition](../formula/theory), and then find
[its range](../../concepts/domain-and-range/theory), being mindful of its domain.

However, this method is often potentially tricky to execute. In particular, the
graph of $`{y=fg(x)}` is often more complicated than the graphs of the
individual functions $`f` and $`g.`

We will thus consider the following method to get the range of the composite
function.

<!-- prettier-ignore-start -->
::: technique

## Finding range of composite functions

To find the range of the composite function $`fg,`

1. Find $`R_g,` the range of the "first" (inner) function $`g`
2. Use $`R_g` as the domain of the "second" (outer) function $`f`
3. The range of this restricted function is $`R_{fg},` the range of the composite function $`fg`

:::
<!-- prettier-ignore-end -->

## Example

<!-- prettier-ignore-start -->
::: example

**Question**:\
The functions $`f` and $`g` are given by

$$ \begin{align*} &f: x \mapsto x^2, &&\quad x \in \mathbb{R},\\ &g: x \mapsto 3-x, &&\quad x \in \mathbb{R}, 1 < x \leq 4. \end{align*} $$

Find the range of the composite function $`fg.`

---

**Solution**:

![gx-graph](/images/h2/fns/0303-gx.svg)

From the graph above, the range of $`g` is given by $`{R_g = [-1, 2).}`

We then restrict the domain of $`f` to $`{[-1,3).}`
\
In the graph below, this is represented by the solid line, as opposed to the dashed lines representing the rest of $`f` following its original domain.

![fx-graph](/images/h2/fns/0303-fx.svg)

Considering the range of this restricted function, $`{R_{fg} = [0, 4). \; \blacksquare}`

_Remark 1_: Observe how $`R_{fg}` is different from $`{R_f = [0, \infty).}`

_Remark 2_: Upon finding $`{R_g = (-1,2],}` It is tempting to skip the graph of $`y=g(x)` and immediately sub the end-points into $`f(x)` to get $`{f(-1)=1}` and $`{f(2)=4}.` Observe how this does not get us the final range $`{R_{fg} = [0, 4)}` due to the minimum point on the graph.

:::

<!-- prettier-ignore-end -->
