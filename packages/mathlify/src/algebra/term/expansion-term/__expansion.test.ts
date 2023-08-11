import { test, expect } from "vitest";
import { Fraction, Expression, Term } from "../../../index.js";
import { ExpansionTerm } from "./expansion.js";

const threeY2 = new Term(3, ["y", 2]);
const xPlus2 = new Expression("x", 2);
const half = new Fraction(1, 2);

const twoXPlus1 = new ExpansionTerm(2, xPlus2);
const halfXPlus1 = new ExpansionTerm(half, xPlus2);
const xXPlus1 = new ExpansionTerm("x", xPlus2);
const threeY2XPlus1 = new ExpansionTerm(threeY2, xPlus2);

test("ExpansionTerm constructor", () => {
  expect(`${twoXPlus1}`).to.equal(`2 \\left( x + 2 \\right)`);
  expect(`${halfXPlus1}`).to.equal(`\\frac{1}{2} \\left( x + 2 \\right)`);
  expect(`${xXPlus1}`).to.equal(`x \\left( x + 2 \\right)`);
  expect(`${threeY2XPlus1}`).to.equal(`3 y^2 \\left( x + 2 \\right)`);
  expect(`${new ExpansionTerm(2, new Expression("x", 2))}`).to.equal(
    `2 \\left( x + 2 \\right)`
  );
  expect(`${new ExpansionTerm(2, "x", "y")}`).to.equal(
    `2 x \\left( y \\right)`
  );
});

test("ExpansionTerm expansion", () => {
  expect(`${twoXPlus1.expand()}`).to.equal(`2 x + 4`);
  expect(`${halfXPlus1.expand()}`).to.equal(`\\frac{1}{2} x + 1`);
  expect(`${xXPlus1.expand()}`).to.equal(`x^2 + 2 x`);
  expect(`${threeY2XPlus1.expand()}`).to.equal(`3 y^2 x + 6 y^2`);
});

test("ExpansionTerm in Expression", () => {
  const exp = new Expression(twoXPlus1, 3);
  expect(`${exp}`).to.equal(`2 \\left( x + 2 \\right) + 3`);
});

test("negative ExpansionTerm", () => {
  const exp = new ExpansionTerm(-1, xPlus2);
  const exp2 = new ExpansionTerm(-2, xPlus2);
  const exp3 = new ExpansionTerm(1, xPlus2);
  expect(`${exp}`).to.equal(`- \\left( x + 2 \\right)`);
  expect(`${exp2}`).to.equal(`- 2 \\left( x + 2 \\right)`);
  expect(`${exp3}`).to.equal(`\\left( x + 2 \\right)`);
  const expression = new Expression(5, exp);
  expect(`${expression}`).to.equal(`5 - \\left( x + 2 \\right)`);
});
