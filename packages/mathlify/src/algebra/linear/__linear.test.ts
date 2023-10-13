import { test, expect } from "vitest";
import { solveLinear } from "./linear";
import { Fraction, Polynomial, Expression } from "../../core/";

const xPlusThree = new Polynomial([1, 3]);
const threePlusX = new Polynomial([3, 1], { ascending: true });
const half = new Fraction(1, 2);
const y2MinusYPlusHalf = new Polynomial([1, -1, half], { variable: "y" });
const xPlus1 = new Expression("x", 1);
const twoXPlus1 = new Expression([2, "x"], 1);

test("Solving Linear Polynomial", () => {
  expect(() => solveLinear(y2MinusYPlusHalf)).to.throw();
  expect(`${solveLinear(xPlusThree)}`).to.equal("- 3");
  expect(`${solveLinear(threePlusX, half)}`).to.equal("- \\frac{5}{2}");
  expect(`${solveLinear(3, threePlusX)}`).to.equal("0");
  expect(`${solveLinear(xPlus1, twoXPlus1)}`).to.equal("0");
});
