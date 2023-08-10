import { test, expect } from "vitest";
import { Expression, Fraction, Term } from "../../../index.js";
import { castExpression } from "./cast-expression.js";

const y = new Term("y");
const xPlus1 = new Expression("x", 1);
const xPlus1PlusY = xPlus1.plus(y);
const xHalf = new Expression(new Term(["x", new Fraction(1, 2)]));
const xy = new Expression(new Term("x", "y"));
const x2 = new Term(["x", 2]);
const x2Plus1 = new Expression(x2, 1);

test("Cast Expression to Polynomial", () => {
  expect(() => {
    castExpression.toPolynomial(xPlus1PlusY);
  }).to.throw();
  expect(() => {
    castExpression.toPolynomial(xPlus1, { variable: "y" });
  }).to.throw();
  expect(() => {
    castExpression.toPolynomial(xHalf);
  }).to.throw();
  expect(() => {
    castExpression.toPolynomial(xy);
  }).to.throw();
  expect(
    `${castExpression.toPolynomial(xPlus1, { ascending: true })}`
  ).to.equal("1 + x");
  expect(`${castExpression.toPolynomial(x2Plus1)}`).to.equal("x^2 + 1");
});
