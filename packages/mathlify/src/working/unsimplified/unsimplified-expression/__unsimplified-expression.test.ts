import { test, expect } from "vitest";
import { Fraction, Term, UnsimplifiedExpression } from "../../../index.js";

const uExp1a = new UnsimplifiedExpression(2).plus(9);
const uExp1b = new UnsimplifiedExpression(new Fraction(-2)).plus(9);
const uExp1c = new UnsimplifiedExpression(2).plus(-9);
const uExp1d = new UnsimplifiedExpression({
  term: -2,
  brackets: "always",
}).plus(-9);
const uExp4f = new UnsimplifiedExpression(
  -33,
  { term: 33, addition: false },
  new Term(-87)
);
const uExp4e = new UnsimplifiedExpression(new Term(-24), 16, -10);
//   const uExp2a = new UnsimplifiedExpression(4).minus(7);
//   const uExp2c = new UnsimplifiedExpression(4).minus(-7);
//   const uExp2d = new UnsimplifiedExpression({ term: -4, brackets: "auto" }).minus(
//     -7
//   );
// const uExp4h = new UnsimplifiedExpression({ term: 27, addition: false })
//   .minus(-19)
//   .minus(-24);

test("Unsimplified expression", () => {
  expect(() => new UnsimplifiedExpression()).to.throw();
  expect(`${uExp1a}`).to.equal("2 + 9");
  expect(`${uExp1b}`).to.equal("- 2 + 9");
  expect(`${uExp1c}`).to.equal("2 + \\left( - 9 \\right)");
  expect(`${uExp1d}`).to.equal("\\left( - 2 \\right) + \\left( - 9 \\right)");
  expect(`${uExp4f}`).to.equal("- 33 - 33 + \\left( - 87 \\right)");
  expect(`${uExp4e}`).to.equal("- 24 + 16 + \\left( - 10 \\right)");
  // expect(`${uExp2a}`).to.equal("4 - 7");
  // expect(`${uExp2c}`).to.equal("4 - \\left( - 7 \\right)");
  // expect(`${uExp2d}`).to.equal(`\\left( - 4 \\right) - \\left( - 7 \\right)`);
  // expect(`${uExp4h}`).to.equal(
  //   "- 27 - \\left( - 19 \\right) - \\left( - 24 \\right)"
  // );
  expect(`${new UnsimplifiedExpression([-2, "x"], [-2, "x"])}`).to.equal(
    "- 2 x + \\left( - 2 x \\right)"
  );
});

test("Simplification of expression", () => {
  expect(uExp1a.simplify().toString()).to.equal("11");
  expect(`${new UnsimplifiedExpression("x", "y")}`).to.equal("x + y");
});
