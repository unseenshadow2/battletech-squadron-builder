import { AssignSquadronDataDefaults } from "./data-types.mjs";

import { TemplatedHtmlElement } from "./templated-html-element.mjs";

await TemplatedHtmlElement.AddTemplate(
  "FighterRow",
  "../templates/fighter-row.html"
);

export class SquadronHeader extends TemplatedHtmlElement {
  squadron = AssignSquadronDataDefaults(undefined);

  constructor() {
    // Always call super first in constructor
    super("FighterRow");
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

customElements.define("ap-squadron-header", SquadronHeader);
