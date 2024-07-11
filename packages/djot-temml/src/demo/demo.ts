import djMarkup from "./demo.dj?raw";
import { djotTemml } from "../main.js";
import { parse, renderHTML } from "@djot/djot";
const html = renderHTML(parse(djMarkup), { overrides: djotTemml() });

document.querySelector<HTMLDivElement>("#app")!.innerHTML = html;
