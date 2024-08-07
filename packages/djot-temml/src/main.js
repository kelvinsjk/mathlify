import temml from "temml";

/** @typedef {import('@djot/djot').HTMLRenderer} HTMLRenderer */
/** @typedef {import('@djot/djot').Visitor<HTMLRenderer, string>} Visitor */
/** @typedef {import('temml').Options} TemmlOptions */

/** @type {(options?: TemmlOptions) => Partial<Visitor>} */
export const djotTemml = (options) => {
  return {
    inline_math: (node) => {
      return temml.renderToString(node.text, { wrap: "tex", ...options });
    },
    display_math: (node) => {
      return temml.renderToString(node.text, { displayMode: true, ...options });
    },
  };
};

import { parse, renderHTML as djotRenderHTML } from "@djot/djot";

/**
 * @param {string} input
 * @param {Parameters<djotRenderHTML>[1]} [djotOptions]
 * @param {TemmlOptions} [temmlOptions]
 */
export const renderHTML = (input, djotOptions, temmlOptions) => {
  const overrides = { ...djotOptions?.overrides, ...djotTemml(temmlOptions) };

  // workaround for prettier table formatting
  // Use a regular expression to remove spaces around pipe characters when they are next to --- or :--- patterns
  input = input.replace(/ ?(\|) (-+|:-+|-+:|:-+:) (\|) ?/g, "$1$2$3");
  // workaround for prettier ignore
  input = input.replace(/<!-- prettier-ignore-start -->/g, "");
  input = input.replace(/<!-- prettier-ignore-end -->/g, "");
  // workaround for display math
  input = input.replace(/(\$\$`[^`]*`)\$\$/g, "$1");
  const ast = parse(input);
  return djotRenderHTML(ast, { ...djotOptions, overrides });
};

/** @typedef {{level: number, text: string, children?: Heading[]}} Heading */

/**
 * @param {string} input;
 * @returns {Heading[]}
 */
export function getToc(input) {
  const flatHeadings = getTocFromAST(parse(input)).filter((h) => h.level !== 1);
  /** @type {Required<Heading>[]} */
  const headings = [];
  /** @type {Required<Heading>[]} */
  const stack = [];
  for (const heading of flatHeadings) {
    const newHeading = { ...heading, children: [] };
    while (
      stack.length > 0 &&
      /** @type {Heading} */ (stack.at(-1)).level >= newHeading.level
    ) {
      stack.pop();
    }
    if (stack.length === 0) {
      headings.push(newHeading);
    } else {
      /** @type {Required<Heading>} */ (stack.at(-1)).children.push(newHeading);
    }
    stack.push(newHeading);
  }
  return removeEmptyChildren(headings);
}

/**
 *
 * @param {Heading[]} headings
 * @param {Heading[]} headings
 */
function removeEmptyChildren(headings) {
  for (const heading of headings) {
    if (heading.children && heading.children.length === 0) {
      delete heading.children;
    } else if (heading.children) {
      removeEmptyChildren(heading.children);
    }
  }
  return headings;
}

/**
 *
 * @param {ReturnType<parse>|import('@djot/djot').Block} ast
 * @returns {{level: number, text: string}[]}
 */
function getTocFromAST(ast) {
  /** @type {{level: number, text: string}[]} */
  const headings = [];
  if (
    ast.tag === "thematic_break" ||
    ast.tag === "code_block" ||
    ast.tag === "raw_block"
  )
    return headings;
  for (const node of ast.children) {
    if (node.tag === "heading") {
      // @ts-ignore
      const text = node.children.map((c) => c.text ?? "").join("");
      headings.push({ level: node.level, text });
    } else {
      if (
        node.tag === "para" ||
        node.tag === "section" ||
        node.tag === "div" ||
        node.tag === "block_quote" ||
        node.tag === "bullet_list" ||
        node.tag === "ordered_list" ||
        node.tag === "task_list" ||
        node.tag === "definition_list" ||
        node.tag === "table"
      ) {
        headings.push(...getTocFromAST(node));
      }
    }
  }
  return headings;
}
