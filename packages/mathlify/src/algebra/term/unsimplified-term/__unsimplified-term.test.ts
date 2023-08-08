import { test, expect } from "vitest";
import { UnsimplifiedTerm, Term } from "././../../../index.js";

const uTerm1a = new UnsimplifiedTerm(7, 8);
const uTerm1b = new UnsimplifiedTerm({ termAtom: -7, brackets: "always" }, 8);
const uTerm1c = new UnsimplifiedTerm(7, -8);
const uTerm1d = new UnsimplifiedTerm({ termAtom: -7, brackets: "always" }, -8);
const uTerm2a = new UnsimplifiedTerm(24, {
  termAtom: 4,
  multiplication: false,
});
const uTerm3e = new UnsimplifiedTerm(new Term(-34)).divide(2, {
  fractionalDisplayMode: true,
});
const uTerm3e2 = new UnsimplifiedTerm(new Term(-34)).divide(2);
const uTerm4B2g = new UnsimplifiedTerm([6, "x"], "y", {
  termAtom: new Term(7, "z"),
  multiplication: true,
});
const uTerm4B2g2 = new UnsimplifiedTerm([6, "x"], "y", {
  termAtom: new Term(7, "z"),
  multiplication: true,
  brackets: "always",
});
const uTerm4B2g3 = new UnsimplifiedTerm(
  {
    termAtom: new Term(7, "z"),
    multiplication: true,
  },
  2
);

test("Unsimplified term", () => {
  expect(() => new UnsimplifiedTerm()).to.throw();
  expect(
    () =>
      new UnsimplifiedTerm(
        {
          termAtom: 4,
          multiplication: false,
        },
        2
      )
  ).to.throw();
  expect(`${uTerm1a}`).to.equal("7 \\times 8");
  expect(`${uTerm1b}`).to.equal("\\left( - 7 \\right) \\times 8");
  expect(`${uTerm1c}`).to.equal("7 \\times \\left( - 8 \\right)");
  expect(`${uTerm1d}`).to.equal(
    "\\left( - 7 \\right) \\times \\left( - 8 \\right)"
  );
  expect(`${uTerm1d.simplify()}`).to.equal("56");
  expect(`${uTerm2a}`).to.equal("24 \\div 4");
  expect(`${uTerm2a.simplify()}`).to.equal("6");
  expect(`${uTerm3e}`).to.equal("\\frac{- 34}{2}");
  expect(`${uTerm3e2}`).to.equal("- 34 \\div 2");
  expect(`${uTerm3e.simplify()}`).to.equal("- 17");
  expect(`${uTerm4B2g}`).to.equal("6 x \\times y \\times 7 z");
  expect(`${uTerm4B2g3}`).to.equal("7 z \\times 2");
  expect(`${uTerm4B2g2}`).to.equal(
    "6 x \\times y \\times \\left( 7 z \\right)"
  );
  expect(`${new UnsimplifiedTerm(11).times("x")}`).to.equal("11 \\times x");
  expect(`${new UnsimplifiedTerm(4, new Term(-3))}`).to.equal(
    `4 \\times \\left( - 3 \\right)`
  );
  expect(`${new UnsimplifiedTerm("x", 4)}`).to.equal(`x \\times 4`);
  expect(`${new UnsimplifiedTerm("x", [6, "x"])}`).to.equal(`x \\times 6 x`);
  expect(`${new UnsimplifiedTerm("x", [6, "x"]).simplify()}`).to.equal(`6 x^2`);
});
