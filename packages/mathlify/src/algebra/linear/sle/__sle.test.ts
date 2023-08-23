import { test, expect } from "vitest";
import { SLE, Fraction } from "../../..";
import { SLENumerical } from "./system-of-linear-equations";

const twoX2 = new SLE(
  [
    [2, 1],
    [-1, -1],
  ],
  [5, -1]
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

const fourX4 = new SLE(
  [
    [1, 1, 1, 1],
    [-1, 1, -1, 1],
    [3, 2, 1, 0],
    [new Fraction(1, 4), new Fraction(1, 3), new Fraction(1, 2), 1],
  ],
  [5, -3, 0, 6],
  { alignMode: "align" }
);

test("SLE", () => {
  expect(`${twoX2}`).to.be.equal(
    `2 &x&  &\\,+\\,&  &y&  &= 5 \\\\\n-  &x&  &\\,-\\,&  &y&  &= - 1`
  );
  expect(`${threeX3}`).to.be.equal(
    `2 a + 3 b + 4 c = 12 \\\\\n4 a - 3 b + 8 c = 6 \\\\\na + b + c = 7`
  );
  expect(`${fourX4}`).to.be.equal(
    `x + y + z + w &= 5 \\\\\n- x + y - z + w &= - 3 \\\\\n3 x + 2 y + z &= 0 \\\\\n\\frac{1}{4} x + \\frac{1}{3} y + \\frac{1}{2} z + w &= 6`
  );
  expect(`${twoX2.solve()}`).to.be.equal(`x = 4,y = - 3`);
  expect(`${threeX3.solve()}`).to.be.equal(`a = 7,b = 2,c = - 2`);
  expect(`${fourX4.solve()}`).to.be.equal(`x = 4,y = - 6,z = 0,w = 7`);
});

const numeric2X2 = new SLENumerical(
  [
    [2, 1],
    [1, 1],
  ],
  [5, 1],
  { alignMode: "off", variables: ["a", "b"], toFixed: 0 }
);
const numeric3x3 = new SLENumerical(
  [
    [1.15, 0.6, 0.55],
    [1, 0.45, 0.3],
    [-2.15, -0.9, -0.65],
  ],
  [8.28, 6.14, -13.05]
);
const numeric4X4 = new SLENumerical(
  [
    [1, 1, 1, 1],
    [-1, 1, -1, 1],
    [3, 2, 1, 0],
    [new Fraction(1, 4), new Fraction(1, 3), new Fraction(1, 2), 1],
  ],
  [5, -3, 0, 6],
  { alignMode: "align", toFixed: 1 }
);
test("SLE numerical", () => {
  expect(`${numeric2X2}`).to.be.equal(`2 a + b = 5 \\\\\na + b = 1`);
  expect(`${numeric3x3}`).to.be.equal(
    `1.15 &x&  &\\,+\\,& 0.60 &y&  &\\,+\\,& 0.55 &z&  &= 8.28 \\\\\n &x&  &\\,+\\,& 0.45 &y&  &\\,+\\,& 0.30 &z&  &= 6.14 \\\\\n- 2.15 &x&  &\\,-\\,& 0.90 &y&  &\\,-\\,& 0.65 &z&  &= -13.05`
  );
  expect(`${numeric4X4}`).to.be.equal(
    `x + y + z + w &= 5.0 \\\\\n- x + y - z + w &= -3.0 \\\\\n3.0 x + 2.0 y + z &= 0.0 \\\\\n0.3 x + 0.3 y + 0.5 z + w &= 6.0`
  );
  expect(`${numeric2X2.solve()}`).to.be.equal(`a = 4,b = -3`);
  expect(`${numeric3x3.solve()}`).to.be.equal(`x = 3.50,y = 2.60,z = 4.90`);
  expect(`${numeric4X4.solve()}`).to.be.equal(
    `x = 4.0,y = -6.0,z = 0.0,w = 7.0`
  );

  expect(() => {
    new SLE([[1, 2]], [3]).solve();
  }).to.throw();
  expect(() => {
    new SLENumerical([[1, 2], [2, 3], [3], [4], [5]], [3]).solve();
  }).to.throw();
});
