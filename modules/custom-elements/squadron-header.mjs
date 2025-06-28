import { AssignSquadronDataDefaults } from "../data-types.mjs";

import { TemplatedHtmlElement } from "./templated-html-element.mjs";

await TemplatedHtmlElement.AddTemplate(
  "SquadronHeader",
  "../../templates/squadron-header.html"
);

export class SquadronHeader extends TemplatedHtmlElement {
  squadron = AssignSquadronDataDefaults(undefined);

  constructor() {
    // Always call super first in constructor
    super("SquadronHeader");
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

customElements.define("ap-squadron-header", SquadronHeader);
