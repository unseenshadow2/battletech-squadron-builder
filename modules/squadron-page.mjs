import { AssignSquadronDataDefaults } from "./data-types.mjs";
import { TemplatedHtmlElement } from "./templated-html-element.mjs";

import "./fighter-row.mjs";
import "./squadron-header.mjs";

await TemplatedHtmlElement.AddTemplate(
  "SquadronPage",
  "../templates/squadron-page.html"
);

export class SquadronPage extends TemplatedHtmlElement {
  constructor() {
    // Always call super first in constructor
    super("SquadronPage");
  }

  connectedCallback() {
    super.connectedCallback();
  }
}

customElements.define("ap-squadron-page", SquadronPage);
