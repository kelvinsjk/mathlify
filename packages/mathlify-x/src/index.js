import { Fraction as oldFrac } from "mathlify";
import { math } from "mathlifier";

// update the prototype of toString
// to add $xxx$ around the string
class Fraction extends oldFrac {
  toString() {
    return math(super.toString());
  }
}
export { Fraction };
