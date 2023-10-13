import { test, expect } from "vitest";
import { castToPoly } from "./castToPoly";
import { Fraction, Expression, Polynomial } from "../../core";

test("cast to poly", () => {
  expect(() => castToPoly(new Expression("x"), { variable: "y" })).to.throw();
  expect(() =>
    castToPoly(new Expression([["x", new Fraction(1, 2)]]))
  ).to.throw();
  expect(castToPoly(new Expression("x"), { variable: "x" }).type).to.eq(
    "polynomial"
  );
  expect(
    castToPoly(new Expression(1), { variable: "y" })
      .plus(new Polynomial("y"))
      .toTex()
  ).to.eq("y + 1");
  expect(() =>
    castToPoly(new Expression("y", 1), { variable: "y" }).plus(
      new Polynomial("x")
    )
  ).to.throw();
});
