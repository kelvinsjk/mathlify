# Existence of composite functions

## Introduction to composite functions

A **composite** function applies functions in sequence.

For example, consider the functions

$$`\begin{align*} &f: x \mapsto 2x, \quad && x \in \mathbb{R} \\ &g:x\mapsto x+1, \quad && x \in \mathbb{R}.\end{align*}`$$

Starting from $`x=2,` we could first apply the function $`f` to get $`{f(2)=4.}`
We then apply the function $`g` to get $`{g(f(2))=g(4)=5.}`

The overall function that gets us from the starting value of $`x=2` to the final
value of $`x=5` is called the composite function $`gf.`

Note that while we read left to right in English, the composite function $`gf`
applies $`f` first followed by $`g.`

Order of composition is important. The function $`fg` applies $`g` first
followed by $`f` and is a different function. For our example, $`{fg(2)=6.}`

## Composite functions may not exist

Now consider the following functions:

$$`\begin{align*} &f: x \mapsto \frac{1}{x}, \quad && x \in \mathbb{R}, x \neq 0 \\ &g:x\mapsto x+1, \quad && x \in \mathbb{R}.\end{align*}`$$

The function $`fg` does not exist because if we were to start with $`{x=-1,}` we
get $`{g(-1)=0}` and will be unable to continue applying $`f` as zero is not
within the domain of $`f.`

## Criteria for composite to exist

To prevent situations like the example above, all the outputs of the first
function in a composite function must lie within the domain of the second
function. That is, for $`fg` to exist, the range of $`g` must be a **subset** of
the domain of $`f.`

<!-- prettier-ignore-start -->
::: formula

- The composite function $`fg` exists if {=$`R_g \subseteq D_f.`=}
- The composite function $`fg` does not exist if {=$`R_g \not \subseteq D_f.`=}

:::
<!-- prettier-ignore-end -->

### Example

<!-- prettier-ignore-start -->
::: example

**Question**:

$$`\begin{align*} &f: x \mapsto 2x-1, \quad && 0 \leq x < 5 \\ &g:x\mapsto x^2, \quad && -2 < x < 1.\end{align*}`$$

Determine if the composite functions $`gf` and $`fg` exist.

---

**Solution**:\
$`{R_f = [-1, 9)}` and $`{D_g = (-2, 1)}.` Hence $`{R_f \not \subseteq D_g}` so the composite function $`gf` does not exist. $`\QED`

$`{R_g = [0, 4)}` and $`{D_f = [0,5)}.` Hence $`{R_g \subseteq D_f}` so the composite function $`fg` exists. $`\QED`

:::
<!-- prettier-ignore-end -->
