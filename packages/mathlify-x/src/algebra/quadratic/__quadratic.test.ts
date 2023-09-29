import { test, expect } from "vitest";
import {
  solveQuadratic,
  //solveQuadraticSurd,
  //factorizeQuadratic,
  discriminant,
  solveQuadraticNumerical,
} from "./quadratic";
import {
  Polynomial,
  //Fraction,
  Expression,
} from "../../core/index.js";

const x2Plus5xPlus4 = new Polynomial([1, 5, 4]);
const x2MinusXMinus6 = new Expression([["y", 2]], [-1, "y"], -6);
//const x2Minus7XPlus12 = new Polynomial([1, -7, 12]);

test("Solving Quadratic Polynomial", () => {
  expect(() => solveQuadratic(new Polynomial([1, 5]))).to.throw();
  expect(() => solveQuadratic(new Polynomial([1, 5, 1]))).to.throw();
  expect(() => solveQuadratic(new Polynomial([1, 5, 11]))).to.throw();
  expect(() => solveQuadratic(new Polynomial([1, 5, 11, 1]))).to.throw();
  expect(() => solveQuadratic(new Expression("x", "y"))).to.throw();
  expect(() =>
    solveQuadratic(1, { rhs: new Polynomial([1, 5, 11, 1]) })
  ).to.throw();
  expect(`${discriminant([1, 2, 1]).toTex()}`).to.equal("0");
  expect(() =>
    solveQuadratic(new Polynomial([1, 5, 11]), { surd: true })
  ).to.throw();
  expect(() =>
    solveQuadratic(new Polynomial([1, 5]), { surd: true })
  ).to.throw();
  expect(() => solveQuadratic(x2Plus5xPlus4, { surd: true })).to.throw();
  expect(
    `${solveQuadratic(new Polynomial([1, 5, 1]), { surd: true })[0].toTex()}`
  ).to.equal(`- \\frac{5}{2} - \\frac{1}{2} \\sqrt{21}`);
  expect(
    solveQuadratic(new Polynomial([1, 5, 1]), { numerical: true })[0].toFixed(2)
  ).to.equal("-4.79");
  expect(
    solveQuadratic(new Polynomial([1, 5, 1]).negative(), {
      numerical: true,
    })[0].toFixed(2)
  ).to.equal("-4.79");
  expect(() => solveQuadraticNumerical(1, 1, 1)).to.throw();
  expect(solveQuadratic(x2Plus5xPlus4)[0].toTex()).to.equal("- 4");
  expect(
    solveQuadratic(x2MinusXMinus6, { rhs: new Expression(0) })[0].toTex()
  ).to.equal("- 2");
  expect(solveQuadratic(x2Plus5xPlus4.negative())[1].toTex()).to.equal("- 1");
  expect(
    solveQuadratic(x2Plus5xPlus4.negative(), { numerical: true })[1]
  ).to.equal(-1);
  // expect(() => factorizeQuadratic(new Polynomial([1, 5, 1]))).to.throw();
  // expect(() => factorizeQuadratic(new Polynomial([1, 5]))).to.throw();
  // expect(`${factorizeQuadratic(x2Plus5xPlus4)}`).to.equal(
  //   "\\left( x + 4 \\right) \\left( x + 1 \\right)"
  // );
  // expect(`${factorizeQuadratic(x2Plus5xPlus4.negative())}`).to.equal(
  //   "- \\left( x + 4 \\right) \\left( x + 1 \\right)"
  // );
  // expect(`${factorizeQuadratic(x2MinusXMinus6.negative())}`).to.equal(
  //   "\\left( x + 2 \\right) \\left( 3 - x \\right)"
  // );
  // expect(`${factorizeQuadratic(x2Minus7XPlus12.negative())}`).to.equal(
  //   "\\left( 3 - x \\right) \\left( x - 4 \\right)"
  // );
});
