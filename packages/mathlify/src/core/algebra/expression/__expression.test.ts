import { test, expect } from "vitest";
import { Fraction } from "../../fraction";
import { Term } from "../term";
import { Expression } from "./expression";

const uExp1a = new Expression(2).plus(9);
const uExp1b = new Expression(new Fraction(-2)).plus(9);
const uExp1c = new Expression(2).plus(-9);
const uExp1d = new Expression({ term: -2 }).plus(-9);
const uExp2a = new Expression(4).minus(7);
const uExp2c = new Expression(4).minus(-7);
const uExp2d = new Expression({ term: -4 }).minus(-7);
const uExp4f = new Expression(
  -33,
  { term: 33, addition: false },
  new Term(-87)
);
const uExp4e = new Expression(new Term(-24), 16, -10);
const uExp4h = new Expression({ term: 27, addition: false })
  .minus(-19)
  .minus(-24);

const uExpFraction1c = new Expression({
  term: new Term(new Fraction(4, 5)),
  addition: false,
}).plus(new Fraction(3, 10));

const zero = new Expression(1, new Fraction(-2, 3)).minus(new Fraction(1, 3));
const xPlus1 = new Expression(new Term("x"), 1);
const xMinus1 = new Expression("x", -1);
const minusXPlus1 = new Expression({ term: "x", addition: false }, 1);
const xPlus2 = new Expression({ term: "x", addition: true }, 2);
const threeFifthX = new Term(new Fraction(3, 5), "x");
threeFifthX.setDisplayMode("always");
const threeFifthXPlus1 = new Expression(threeFifthX, 1);

test("Expression", () => {
  expect(() => new Expression()).to.throw();
  expect(`${uExp1a}`).to.equal("11");
  expect(`${uExp1b}`).to.equal("7");
  expect(`${uExp1c}`).to.equal("- 7");
  expect(`${uExp1d}`).to.equal("- 11");
  expect(`${uExp2a}`).to.equal("- 3");
  expect(`${uExp2c}`).to.equal("11");
  expect(`${uExp2d}`).to.equal("3");
  expect(`${uExp4f}`).to.equal("- 153");
  expect(`${uExp4e}`).to.equal("- 18");
  expect(`${uExp4h}`).to.equal("16");
  expect(`${uExpFraction1c}`).to.equal("- \\frac{1}{2}");
  expect(`${zero}`).to.equal("0");
  expect(`${xPlus1}`).to.equal("x + 1");
  expect(`${xPlus2}`).to.equal("x + 2");
  expect(`${xMinus1}`).to.equal("x - 1");
  expect(`${minusXPlus1}`).to.equal("- x + 1");
  expect(`${threeFifthXPlus1}`).to.equal("\\frac{3 x}{5} + 1");
  expect(`${threeFifthXPlus1.subIn(5)}`).to.equal("4");
  expect(`${new Expression([2, "x"], 1)}`).to.be.equal("2 x + 1");
});

test("Expression casting", () => {
  const frac2 = new Fraction(1, 2);
  const exp2 = new Expression(frac2);
  const zeroExp = new Expression(1, -1);
  // @ts-expect-error
  expect(frac2.is.equalTo(exp2)).toBe(false);
  expect(frac2.is.equalTo(exp2.cast.toFraction())).toBe(true);
  expect(exp2.cast.toTerm().kind).to.equal("term");
  expect(`${zeroExp}`).to.equal("0");
  expect(() => {
    zeroExp.gcd();
  }).to.throw();
  expect(`${zeroExp.cast.toTerm()}`).to.equal("0");
  expect(`${zeroExp.cast.toFraction()}`).to.equal("0");
  expect(() => {
    new Expression(2, "x").cast.toFraction();
  }).to.throw();
  expect(() => {
    new Expression(2, "x").cast.toTerm();
  }).to.throw();
});
