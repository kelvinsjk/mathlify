import { partialFractionsWorking } from "./partial-fractions";
import { Polynomial } from "../../core";

import { test, expect } from "vitest";

const num = new Polynomial([18, 11, -2], { ascending: true });
const d1 = new Polynomial([1, -1]);
const d2 = new Polynomial([1, 2]);

const { working, result } = partialFractionsWorking(num, [d1, [d2, 2]]);
const { start, substitutions, comparing, final } = working;
const xValues = substitutions.map((s) => s[0].toString()).join(", ");

test("Partial Fractions", () => {
  expect(start).to
    .equal(`\\frac{18 + 11 x - 2 x^2}{\\left( x - 1 \\right) \\left( x + 2 \\right)^2} &= \\frac{A}{x - 1} + \\frac{B}{x + 2} + \\frac{C}{(x + 2)^2} \\\\
18 + 11 x - 2 x^2 &= A\\left(x + 2\\right)^2 + B\\left(x - 1\\right)\\left(x + 2\\right) + C\\left(x - 1\\right)`);
  expect(`${result}`).to.equal(
    "\\frac{3}{x - 1} - \\frac{5}{x + 2} + \\frac{4}{\\left( x + 2 \\right)^2}"
  );
  expect(xValues).to.equal("1, - 2");
  expect(substitutions[0][1]).to.equal(
    `27 &= A \\left( 9 \\right) \\\\\nA &= 3`
  );
  expect(substitutions[1][1]).to.equal(
    `- 12 &= C \\left( - 3 \\right) \\\\\nC &= 4`
  );
  expect(comparing).to.equal(`&x^2:& \\quad A + B &= - 2 \\\\\n&& B &= - 5`);
  expect(final).to.equal(
    `\\frac{18 + 11 x - 2 x^2}{\\left( x - 1 \\right) \\left( x + 2 \\right)^2} = \\frac{3}{x - 1} - \\frac{5}{x + 2} + \\frac{4}{\\left( x + 2 \\right)^2}`
  );
});
