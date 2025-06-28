import {
  AssignFighterDataDefaults,
  AssignFighterBayDefaults,
} from "../data-types.mjs";

import { TemplatedHtmlElement } from "./templated-html-element.mjs";

await TemplatedHtmlElement.AddTemplate(
  "FighterRow",
  "../../templates/fighter-row.html"
);

export class FighterRow extends TemplatedHtmlElement {
  constructor() {
    // Always call super first in constructor
    super("FighterRow");
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

customElements.define("ap-fighter-row", FighterRow);
