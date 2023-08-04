import { test, expect } from "vitest";
import { getRandomFraction, getRandomFractions } from "./getRandomFraction";
import { Fraction } from "../core/fraction";

test("invalid arguments", () => {
  expect(() => getRandomFractions(0)).toThrow();
});

test("randomFractions", () => {
  expect(getRandomFraction().num > -10).toBe(true);
  expect(getRandomFraction().num < 10).toBe(true);
  expect(getRandomFraction().den > -10).toBe(true);
  expect(getRandomFraction().den < 10).toBe(true);
  for (let i = 0; i < 17; i++) {
    // > 99% chance of full coverage
    expect(getRandomFraction({ allowInt: false }).den != 1).toBe(true);
  }
  expect(
    getRandomFraction({
      numRange: [1, 3],
      denRange: [1, 1],
      avoid: [2, 3],
    }).is.equalTo(1)
  ).toBe(true);
  const twoArr = getRandomFractions(2);
  expect(twoArr.length).toBe(2);
  const [x, y] = getRandomFractions(2, {
    numRange: [1, 1],
    denRange: [1, 3],
    avoid: new Fraction(1, 3),
    allowReps: false,
  });
  const [half, one] = x.is.greaterThan(y) ? [y, x] : [x, y];
  expect(one.num).toBe(1);
  expect(one.den).toBe(1);
  expect(half.num).toBe(1);
  expect(half.den).toBe(2);
});
