export type FractionJSON = {
  type: "fraction";
  num: number;
  den: number;
  args: [number, number];
};

export type TermJSON = {
  type: TermType;
  coeff: string;
  signature: string;
  args: [FractionJSON, ...[string, FractionJSON][]];
};

export type ExpressionJSON = {
  type: ExpressionType;
  terms: string[];
  args: TermJSON[];
};

export type TermType =
  | "term"
  | "sqrt"
  | "rational-term"
  | "expansion-term"
  | "rational-fn"
  | "power-fn"
  | "exp-fn"
  | "ln-fn"
  | "sin-fn"
  | "cos-fn";

export type ExpressionType =
  | "expression"
  | "polynomial"
  | "extended-polynomial"
  | "general-fn"
  | "polynomial-like";
