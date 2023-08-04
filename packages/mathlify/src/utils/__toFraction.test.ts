import { test, expect } from "vitest";
import { Fraction } from "../";
import { numberToFraction } from "./toFraction";

test("numberToFraction", () => {
  const two = numberToFraction(2);
  const half = new Fraction(1, 2);
  expect(two.num).toBe(2);
  expect(two.den).toBe(1);
  expect(half.num).toBe(1);
  expect(half.den).toBe(2);
});
