import { test, expect } from "vitest";
import { solveLinear } from "./linear";
import { Polynomial } from "../../core/algebra/polynomial";
import { Fraction } from "../../core/fraction";

const xPlusThree = new Polynomial([1, 3]);
const threePlusX = new Polynomial([3, 1], { ascending: true });
const half = new Fraction(1, 2);
const y2MinusYPlusHalf = new Polynomial([1, -1, half], { variable: "y" });

test("Solving Linear Polynomial", () => {
  expect(() => solveLinear(y2MinusYPlusHalf)).to.throw();
  expect(`${solveLinear(xPlusThree)}`).to.equal("- 3");
  expect(`${solveLinear(threePlusX, half)}`).to.equal("- \\frac{5}{2}");
  expect(`${solveLinear(3, threePlusX)}`).to.equal("0");
});
