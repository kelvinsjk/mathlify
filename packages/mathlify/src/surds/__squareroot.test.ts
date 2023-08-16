import { SquareRoot, Term } from "../index";
import { extractPowers } from "./square-roots";
import { test, expect } from "vitest";

const root2 = new SquareRoot(2);

test("square roots", () => {
  expect(() => new SquareRoot(-1)).to.throw();
  expect(() => root2.cast.toFraction()).to.throw();
  expect(`${new SquareRoot(0)}`).to.equal(`0`);
  expect(`${root2.square()}`).to.equal(`2`);
  expect(root2.square().type).to.equal(`fraction-int`);
  expect(`${root2.pow(5)}`).to.equal(`4 \\sqrt{2}`);
  expect(`${new SquareRoot(3, { coeff: -2 }).abs()}`).to.equal(`2 \\sqrt{3}`);
  expect(root2.is.equalTo(new SquareRoot(2))).to.equal(true);
  expect(root2.is.not.equalTo(3)).to.equal(true);
  expect(root2.is.not.equalTo(new Term("x"))).to.equal(true);
  expect(extractPowers(0)).to.deep.equal([0, 0]);
});
