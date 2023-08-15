import { test, expect } from "vitest";
import {
  cramersRule,
  cramersRuleNumerical,
  determinant,
  determinantNumerical,
} from "../../index";
import { Fraction } from "../../..";

test("SLE", () => {
  expect(() => {
    determinant(1);
  }).to.throw();
  expect(() => {
    determinantNumerical(1, 2);
  }).to.throw();
  expect(() => {
    cramersRule([1, 2], 1, [2, 4], 2);
  }).to.throw();
  expect(() => {
    cramersRule([1, 2, 3], 1, [1, 2, 4], 2, [2, 4, 7], 3);
  }).to.throw();
  expect(() => {
    cramersRule(
      [1, 2, 3, 1],
      1,
      [1, 2, 4, 2],
      2,
      [2, 4, 7, 3],
      3,
      [1, 2, 3, 4],
      5
    );
  }).to.throw();
  expect(() => {
    // @ts-expect-error
    cramersRule([1], 2, [2], 2);
  }).to.throw();
  expect(() => {
    // @ts-expect-error
    cramersRuleNumerical([1], 2, [2], 2);
  }).to.throw();
});
