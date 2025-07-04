import { AssignSquadronDataDefaults } from "../data-types.mjs";

import { TemplatedHtmlElement } from "./templated-html-element.mjs";

/**
 * @typedef {import('../data-types.mjs').Squadron} Squadron
 */

await TemplatedHtmlElement.AddTemplate(
  "SquadronHeader",
  "../../templates/squadron-header.html"
);

export class SquadronHeader extends TemplatedHtmlElement {
  /**
   * @type {Squadron}
   */
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
