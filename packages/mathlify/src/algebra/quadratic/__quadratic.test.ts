import { test, expect } from "vitest";
import {
  solveQuadratic,
  solveQuadraticSurd,
  factorizeQuadratic,
  discriminant,
} from "./quadratic";
import { Fraction, Polynomial, Expression } from "../../core/";

const x2Plus5xPlus4 = new Polynomial([1, 5, 4]);
const x2MinusXMinus6 = new Polynomial([1, -1, -6]);
const x2Minus7XPlus12 = new Polynomial([1, -7, 12]);

test("Solving Quadratic Polynomial", () => {
  expect(() => solveQuadratic(new Polynomial([1, 5]))).to.throw();
  expect(() => factorizeQuadratic(new Polynomial([1, 5]))).to.throw();
  expect(() => solveQuadratic(new Polynomial([1, 5, 1]))).to.throw();
  expect(() => factorizeQuadratic(new Polynomial([1, 5, 1]))).to.throw();
  expect(() => solveQuadratic(new Polynomial([1, 5, 11]))).to.throw();
  expect(() => solveQuadraticSurd(new Polynomial([1, 5, 11]))).to.throw();
  expect(() => solveQuadraticSurd(new Polynomial([1, 5]))).to.throw();
  expect(() => solveQuadraticSurd(x2Plus5xPlus4)).to.throw();
  expect(`${discriminant([1, 2, 1])}`).to.equal("0");
  expect(`${factorizeQuadratic(x2Plus5xPlus4)}`).to.equal(
    "\\left( x + 4 \\right) \\left( x + 1 \\right)"
  );
  expect(`${factorizeQuadratic(x2Plus5xPlus4.negative())}`).to.equal(
    "- \\left( x + 4 \\right) \\left( x + 1 \\right)"
  );
  expect(`${factorizeQuadratic(x2MinusXMinus6.negative())}`).to.equal(
    "\\left( x + 2 \\right) \\left( 3 - x \\right)"
  );
  expect(`${factorizeQuadratic(x2Minus7XPlus12.negative())}`).to.equal(
    "\\left( 3 - x \\right) \\left( x - 4 \\right)"
  );
  expect(`${solveQuadraticSurd(new Polynomial([1, 5, 1]))[0]}`).to.equal(
    `- \\frac{5}{2} - \\frac{1}{2} \\sqrt{21}`
  );
});
