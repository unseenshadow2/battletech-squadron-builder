import {
  AssignFighterDataDefaults,
  AssignFighterBayDefaults,
} from "./data-types.mjs";

export class SquadronPage extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
  }
}

customElements.define("ap-squadron-page", SquadronPage);
