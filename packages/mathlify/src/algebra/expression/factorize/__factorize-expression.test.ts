import { test, expect } from "vitest";
import { Expression, Fraction, Term } from "../../../index.js";
import { factorizeExpression } from "./factorize-expression.js";

const sixteenXPlus12 = new Expression([16, "x"], 12);
const negativeXMinus2AX = new Expression([-1, "x"], [-2, "a", "x"]);
const xPlus2 = new Expression("x", 2);

test("Factorize Expression", () => {
  expect(`${factorizeExpression(sixteenXPlus12)}`).to.equal(
    `4 \\left( 4 x + 3 \\right)`
  );
  expect(`${factorizeExpression(negativeXMinus2AX, "x")}`).to.equal(
    `- x \\left( 1 + 2 a \\right)`
  );
  expect(`${factorizeExpression(xPlus2)}`).to.equal(`x + 2`);
});
