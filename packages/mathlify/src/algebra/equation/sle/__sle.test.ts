import { test, expect } from "vitest";
import { SLE } from "../../index";

const twoX2 = new SLE(
  [
    [2, 1],
    [1, 1],
  ],
  [5, 1]
);
const threeX3 = new SLE(
  [
    [2, 3, 4],
    [4, -3, 8],
    [1, 1, 1],
  ],
  [12, 6, 7],
  { alignMode: "off", variables: ["a", "b", "c"] }
);

test("SLE", () => {
  expect(`${twoX2}`).to.be.equal(
    `2 &x&  &\\,+\\,&  &y&  &= 5 \\\\\n &x&  &\\,+\\,&  &y&  &= 1`
  );
  expect(`${threeX3}`).to.be.equal(
    `2 a + 3 b + 4 c = 12 \\\\\n4 a - 3 b + 8 c = 6 \\\\\na + b + c = 7`
  );
  expect(`${twoX2.solve()}`).to.be.equal(`x = 4,y = - 3`);
  expect(`${threeX3.solve()}`).to.be.equal(`a = 7,b = 2,c = - 2`);
});
