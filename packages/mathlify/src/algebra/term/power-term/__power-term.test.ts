import { test, expect } from "vitest";
import { Fraction, Expression, Term } from "../../../index.js";
import { PowerTerm } from "./power-term.js";

const xPlus1 = new Expression("x", 1);
const xPlus1Pow2 = new PowerTerm(xPlus1, 2);
const negativeXPlus1Pow2 = new PowerTerm(xPlus1, 2, { coeff: -1 });
const rootXPlus1 = new PowerTerm(xPlus1, new Fraction(1, 2));
const cubeRootXPlus1Squared = new PowerTerm(xPlus1, new Fraction(2, 3));
const cubeRootXPlus1Pow10 = new PowerTerm(xPlus1, new Fraction(10, 3));
const halfXPlus1Pow3 = new PowerTerm(["x", 1], 3, {
  coeff: new Fraction(1, 2),
});
const rootHalf = new PowerTerm(new Fraction(1, 2), new Fraction(1, 2));

test("PowerTerm constructor", () => {
  expect(`${xPlus1Pow2}`).to.equal(`\\left( x + 1 \\right)^2`);
  expect(`${negativeXPlus1Pow2}`).to.equal(`- \\left( x + 1 \\right)^2`);
  expect(`${rootXPlus1}`).to.equal(`\\sqrt{x + 1}`);
  expect(`${cubeRootXPlus1Squared}`).to.equal(
    `\\sqrt[3]{\\left( x + 1 \\right)^2}`
  );
  expect(`${cubeRootXPlus1Pow10}`).to.equal(
    `\\sqrt[3]{\\left( x + 1 \\right)^{10}}`
  );
  expect(`${halfXPlus1Pow3}`).to.equal(`\\frac{1}{2} \\left( x + 1 \\right)^3`);
  expect(`${rootHalf}`).to.equal(`\\sqrt{\\frac{1}{2}}`);
});

test("PowerTerm expansion", () => {
  expect(`${negativeXPlus1Pow2.expand()}`).to.equal(`- x^2 - 2 x - 1`);
  expect(() => {
    `${rootXPlus1.expand()}`;
  }).to.throw();
});

test("PowerTerm within Expression", () => {
  const twoMinusXPow2 = new Expression(2, negativeXPlus1Pow2);
  expect(`${twoMinusXPow2}`).to.equal(`2 - \\left( x + 1 \\right)^2`);
});
