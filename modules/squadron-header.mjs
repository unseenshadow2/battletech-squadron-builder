import { AssignSquadronDataDefaults } from "./data-types.mjs";

export class SquadronHeader extends HTMLElement {
  squadron = AssignSquadronDataDefaults(undefined);

  constructor() {
    // Always call super first in constructor
    super();
  }
}

customElements.define("ap-squadron-header", SquadronHeader);
