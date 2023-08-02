export type Question = {
  body?: string;
  marks?: number;
  parts?: Part[]
}

export type Part = {
  body?: string,
  marks?: number,
  partNo?: number,
  uplevel?: string,
  subparts?: Subpart[]
}

export type Subpart = {
  body?: string,
  marks?: number,
  subpartNo?: number,
  uplevel?: string,
}

export type Answer = {
  body?: string;
  parts?: Part[]
}
