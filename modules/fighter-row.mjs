import {
  AssignFighterDataDefaults,
  AssignFighterBayDefaults,
} from "./data-types.mjs";

export class FighterRow extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
  }
}

customElements.define("ap-fighter-row", FighterRow);
